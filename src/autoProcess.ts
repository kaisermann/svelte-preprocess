import type {
  PreprocessorGroup,
  Preprocessor,
  Processed,
  TransformerArgs,
  TransformerOptions,
  Transformers,
  Options,
} from './types';
import { hasDepInstalled, concat, setProp } from './modules/utils';
import { getTagInfo } from './modules/tagInfo';
import {
  addLanguageAlias,
  getLanguageFromAlias,
  SOURCE_MAP_PROP_MAP,
  getLanguage,
  getLanguageDefaults,
} from './modules/language';
import { prepareContent } from './modules/prepareContent';
import { transformMarkup } from './modules/markup';

type AutoPreprocessGroup = PreprocessorGroup & {
  defaultLanguages: Readonly<{
    markup: string;
    style: string;
    script: string;
  }>;
};

type AutoPreprocessOptions = {
  markupTagName?: string;
  aliases?: Array<[string, string]>;
  preserve?: string[];
  defaults?: {
    markup?: string;
    style?: string;
    script?: string;
  };
  sourceMap?: boolean;

  // transformers
  babel?: TransformerOptions<Options.Babel>;
  typescript?: TransformerOptions<Options.Typescript>;
  scss?: TransformerOptions<Options.Sass>;
  sass?: TransformerOptions<Options.Sass>;
  less?: TransformerOptions<Options.Less>;
  stylus?: TransformerOptions<Options.Stylus>;
  postcss?: TransformerOptions<Options.Postcss>;
  coffeescript?: TransformerOptions<Options.Coffeescript>;
  pug?: TransformerOptions<Options.Pug>;
  globalStyle?: Options.GlobalStyle | boolean;
  replace?: Options.Replace;

  // workaround while we don't have this
  // https://github.com/microsoft/TypeScript/issues/17867
  [languageName: string]: TransformerOptions;
};

export const transform = async (
  name: string,
  options: TransformerOptions,
  { content, map, filename, attributes }: TransformerArgs<any>,
): Promise<Processed> => {
  if (options === false) {
    return { code: content };
  }

  if (typeof options === 'function') {
    return options({ content, map, filename, attributes });
  }

  // todo: maybe add a try-catch here looking for module-not-found errors
  const { transformer } = await import(`./transformers/${name}`);

  return transformer({
    content,
    filename,
    map,
    attributes,
    options: typeof options === 'boolean' ? null : options,
  });
};

export function sveltePreprocess(
  {
    aliases,
    markupTagName = 'template',
    preserve = [],
    defaults,
    sourceMap = process?.env?.NODE_ENV === 'development' ?? false,
    ...rest
  } = {} as AutoPreprocessOptions,
): AutoPreprocessGroup {
  const defaultLanguages = Object.freeze({
    markup: 'html',
    style: 'css',
    script: 'javascript',
    ...defaults,
  });

  const transformers = rest as Transformers;

  if (aliases?.length) {
    addLanguageAlias(aliases);
  }

  const getTransformerOptions = (
    name: string,
    alias?: string,
  ): TransformerOptions<unknown> => {
    const { [name]: nameOpts, [alias]: aliasOpts } = transformers;

    if (typeof aliasOpts === 'function') return aliasOpts;
    if (typeof nameOpts === 'function') return nameOpts;
    if (aliasOpts === false || nameOpts === false) return false;

    const opts: Record<string, any> = {};

    if (typeof nameOpts === 'object') {
      Object.assign(opts, nameOpts);
    }

    Object.assign(opts, getLanguageDefaults(name), getLanguageDefaults(alias));

    if (name !== alias && typeof aliasOpts === 'object') {
      Object.assign(opts, aliasOpts);
    }

    if (sourceMap && name in SOURCE_MAP_PROP_MAP) {
      setProp(opts, ...SOURCE_MAP_PROP_MAP[name]);
    }

    return opts;
  };

  const getTransformerTo = (
    type: 'markup' | 'script' | 'style',
    targetLanguage: string,
  ): Preprocessor => async (svelteFile) => {
    let {
      content,
      filename,
      lang,
      alias,
      dependencies,
      attributes,
    } = await getTagInfo(svelteFile);

    if (lang == null || alias == null) {
      alias = defaultLanguages[type];
      lang = getLanguageFromAlias(alias);
    }

    if (preserve.includes(lang) || preserve.includes(alias)) {
      return { code: content };
    }

    const transformerOptions = getTransformerOptions(lang, alias);

    content = prepareContent({
      options: transformerOptions,
      content,
    });

    if (lang === targetLanguage) {
      return { code: content, dependencies };
    }

    const transformed = await transform(lang, transformerOptions, {
      content,
      filename,
      attributes,
    });

    return {
      ...transformed,
      dependencies: concat(dependencies, transformed.dependencies),
    };
  };

  const scriptTransformer = getTransformerTo('script', 'javascript');
  const cssTransformer = getTransformerTo('style', 'css');
  const markupTransformer = getTransformerTo('markup', 'html');

  const markup: PreprocessorGroup['markup'] = async ({ content, filename }) => {
    if (transformers.replace) {
      const transformed = await transform('replace', transformers.replace, {
        content,
        filename,
      });

      content = transformed.code;
    }

    return transformMarkup({ content, filename }, markupTransformer, {
      // we only pass the markupTagName because the rest of options
      // is fetched internally by the `markupTransformer`
      markupTagName,
    });
  };

  const script: PreprocessorGroup['script'] = async ({
    content,
    attributes,
    filename,
  }) => {
    const transformResult: Processed = await scriptTransformer({
      content,
      attributes,
      filename,
    });

    let { code, map, dependencies, diagnostics } = transformResult;

    if (transformers.babel) {
      const transformed = await transform(
        'babel',
        getTransformerOptions('babel'),
        {
          content: code,
          map,
          filename,
          attributes,
        },
      );

      code = transformed.code;
      map = transformed.map;
      dependencies = concat(dependencies, transformed.dependencies);
      diagnostics = concat(diagnostics, transformed.diagnostics);
    }

    return { code, map, dependencies, diagnostics };
  };

  const style: PreprocessorGroup['style'] = async ({
    content,
    attributes,
    filename,
  }) => {
    const transformResult = await cssTransformer({
      content,
      attributes,
      filename,
    });

    let { code, map, dependencies } = transformResult;

    // istanbul ignore else
    if (await hasDepInstalled('postcss')) {
      if (transformers.postcss) {
        const { alias } = getLanguage(attributes);

        const transformed = await transform(
          'postcss',
          getTransformerOptions('postcss', alias),
          { content: code, map, filename, attributes },
        );

        code = transformed.code;
        map = transformed.map;
        dependencies = concat(dependencies, transformed.dependencies);
      }

      const transformed = await transform(
        'globalStyle',
        getTransformerOptions('globalStyle'),
        { content: code, map, filename, attributes },
      );

      code = transformed.code;
      map = transformed.map;
    } else if ('global' in attributes) {
      console.warn(
        `[svelte-preprocess] 'global' attribute found, but 'postcss' is not installed.`,
      );
    }

    return { code, map, dependencies };
  };

  return {
    defaultLanguages,
    markup,
    script,
    style,
  };
}
