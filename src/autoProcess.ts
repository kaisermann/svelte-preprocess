import stripIndent from 'strip-indent';
import { version } from 'svelte/package.json';

import {
  concat,
  addLanguageAlias,
  parseFile,
  runTransformer,
  isFn,
  throwUnsupportedError,
} from './utils';
import {
  PreprocessorGroup,
  TransformerOptions,
  Preprocessor,
  Options,
  ProcessedScript,
} from './types';

interface Transformers {
  typescript?: TransformerOptions<Options.Typescript>;
  scss?: TransformerOptions<Options.Sass>;
  sass?: TransformerOptions<Options.Sass>;
  less?: TransformerOptions<Options.Less>;
  stylus?: TransformerOptions<Options.Stylus>;
  postcss?: TransformerOptions<Options.Postcss>;
  coffeescript?: TransformerOptions<Options.Coffeescript>;
  pug?: TransformerOptions<Options.Pug>;
  globalStyle?: TransformerOptions<Options.Typescript>;
  replace?: Options.Replace;
  [languageName: string]: TransformerOptions<any>;
}

type AutoPreprocessOptions = {
  /** @deprecated for svelte v3 use instead a array of processors */
  onBefore?: ({
    content,
    filename,
  }: {
    content: string;
    filename: string;
  }) => Promise<string> | string;
  markupTagName?: string;
  /** @deprecated add transformer config directly to svelte-preprocess options object */
  transformers?: Transformers;
  aliases?: [string, string][];
  preserve?: string[];
  typescript?: TransformerOptions<Options.Typescript>;
  scss?: TransformerOptions<Options.Sass>;
  sass?: TransformerOptions<Options.Sass>;
  less?: TransformerOptions<Options.Less>;
  stylus?: TransformerOptions<Options.Stylus>;
  postcss?: TransformerOptions<Options.Postcss>;
  babel?: TransformerOptions<Options.Babel>;
  coffeescript?: TransformerOptions<Options.Coffeescript>;
  pug?: TransformerOptions<Options.Pug>;
  globalStyle?: TransformerOptions<Options.Typescript>;
  // workaround while we don't have this
  // https://github.com/microsoft/TypeScript/issues/17867
  [languageName: string]:
    | string
    | Promise<string>
    | [string, string][]
    | string[]
    | TransformerOptions<any>;
};

const SVELTE_MAJOR_VERSION = +version[0];
const ALIAS_OPTION_OVERRIDES: Record<string, any> = {
  sass: {
    indentedSyntax: true,
  },
};

export function autoPreprocess(
  {
    onBefore,
    aliases,
    markupTagName = 'template',
    preserve = [],
    ...rest
  }: AutoPreprocessOptions = {} as AutoPreprocessOptions,
): PreprocessorGroup {
  markupTagName = markupTagName.toLocaleLowerCase();

  const optionsCache: Record<string, any> = {};
  const transformers = rest.transformers || (rest as Transformers);
  const markupPattern = new RegExp(
    `<${markupTagName}([\\s\\S]*?)(?:>([\\s\\S]*)<\\/${markupTagName}>|/>)`,
  );

  if (aliases && aliases.length) {
    addLanguageAlias(aliases);
  }

  const getTransformerOptions = (
    lang: string,
    alias: string,
  ): TransformerOptions<unknown> => {
    if (isFn(transformers[alias])) return transformers[alias];
    if (isFn(transformers[lang])) return transformers[lang];
    if (optionsCache[alias] != null) return optionsCache[alias];

    const opts: TransformerOptions<unknown> = {};

    if (typeof transformers[lang] === 'object') {
      Object.assign(opts, transformers[lang]);
    }

    if (lang !== alias) {
      Object.assign(opts, ALIAS_OPTION_OVERRIDES[alias] || null);

      if (typeof transformers[alias] === 'object') {
        Object.assign(opts, transformers[alias]);
      }
    }

    return (optionsCache[alias] = opts);
  };

  const getTransformerTo = (
    targetLanguage: string,
  ): Preprocessor => async svelteFile => {
    const { content, filename, lang, alias, dependencies } = await parseFile(
      svelteFile,
      targetLanguage,
    );

    if (preserve.includes(lang) || preserve.includes(alias)) {
      return;
    }

    if (lang === targetLanguage) {
      return { code: content, dependencies };
    }

    if (transformers[lang] === false || transformers[alias] === false) {
      throwUnsupportedError(alias, filename);
    }

    const transformed = await runTransformer(
      lang,
      getTransformerOptions(lang, alias),
      { content: stripIndent(content), filename },
    );

    return {
      ...transformed,
      dependencies: concat(dependencies, transformed.dependencies),
    };
  };

  const scriptTransformer = getTransformerTo('javascript');
  const cssTransformer = getTransformerTo('css');
  const markupTransformer = getTransformerTo('html');

  return {
    async markup({ content, filename }) {
      if (isFn(onBefore)) {
        // istanbul ignore next
        if (SVELTE_MAJOR_VERSION >= 3) {
          console.warn(
            '[svelte-preprocess] For svelte >= v3, instead of onBefore(), prefer to prepend a preprocess object to your array of preprocessors',
          );
        }
        content = await onBefore({ content, filename });
      }

      if (transformers.replace) {
        const transformed = await runTransformer(
          'replace',
          transformers.replace,
          { content, filename },
        );

        content = transformed.code;
      }

      const templateMatch = content.match(markupPattern);

      /** If no <template> was found, just return the original markup */
      if (!templateMatch) {
        return { code: content };
      }

      const [fullMatch, attributesStr, templateCode] = templateMatch;

      /** Transform an attribute string into a key-value object */
      const attributes = attributesStr
        .split(/\s+/)
        .filter(Boolean)
        .reduce((acc: Record<string, string | boolean>, attr) => {
          const [name, value] = attr.split('=');
          // istanbul ignore next
          acc[name] = value ? value.replace(/['"]/g, '') : true;
          return acc;
        }, {});

      /** Transform the found template code */
      let { code, map, dependencies } = await markupTransformer({
        content: templateCode,
        attributes,
        filename,
      });

      code =
        content.slice(0, templateMatch.index) +
        code +
        content.slice(templateMatch.index + fullMatch.length);

      return { code, map, dependencies };
    },
    async script({ content, attributes, filename }) {
      const transformResult: ProcessedScript = await scriptTransformer({
        content,
        attributes,
        filename,
      });

      if (transformResult == null) return;

      let { code, map, dependencies, diagnostics } = transformResult;

      if (transformers.babel) {
        const transformed = await runTransformer('babel', transformers.babel, {
          content: code,
          map,
          filename,
        });

        code = transformed.code;
        map = transformed.map;
        dependencies = concat(dependencies, transformed.dependencies);
        diagnostics = concat(diagnostics, transformed.diagnostics);
      }

      return { code, map, dependencies, diagnostics };
    },
    async style({ content, attributes, filename }) {
      const transformResult = await cssTransformer({
        content,
        attributes,
        filename,
      });

      if (transformResult == null) return;

      let { code, map, dependencies } = transformResult;

      if (transformers.postcss) {
        const transformed = await runTransformer(
          'postcss',
          transformers.postcss,
          { content: code, map, filename },
        );

        code = transformed.code;
        map = transformed.map;
        dependencies = concat(dependencies, transformed.dependencies);
      }

      if (attributes.global) {
        const transformed = await runTransformer('globalStyle', null, {
          content: code,
          map,
          filename,
        });

        code = transformed.code;
        map = transformed.map;
      }

      return { code, map, dependencies };
    },
  };
}
