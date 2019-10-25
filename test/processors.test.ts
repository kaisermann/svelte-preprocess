import {
  scss,
  sass,
  less,
  stylus,
  postcss,
  coffeescript,
  typescript,
  pug,
} from '../src';
import { CSS_PATTERN, getFixtureContent, preprocess } from './utils';

const EXPECTED_SCRIPT = getFixtureContent('script.js');

type ProcessorEntries = [string, string, (...args: any) => any, any?][];

const STYLE_LANGS: ProcessorEntries = [
  ['sass', 'sass', sass],
  ['scss', 'scss', scss],
  ['less', 'less', less],
  ['stylus', 'styl', stylus],
  ['postcss', 'css', postcss],
];
const SCRIPT_LANGS: ProcessorEntries = [
  ['coffeescript', 'coffee', coffeescript],
  [
    'typescript',
    'ts',
    typescript,
    { tsconfigFile: false, compilerOptions: { module: 'es2015' } },
  ],
];
const MARKUP_LANGS: ProcessorEntries = [['pug', 'pug', pug]];

STYLE_LANGS.forEach(([lang, ext, processor, options]) => {
  describe(`processor - ${lang}`, () => {
    it('should support external src files', async () => {
      const template = `<style src="./fixtures/style.${ext}"></style><div></div>`;
      const preprocessed = await preprocess(template, [processor(options)]);
      expect(preprocessed.toString()).toMatch(CSS_PATTERN);
    });
  });
});

SCRIPT_LANGS.forEach(([lang, ext, processor, options]) => {
  describe(`processor - ${lang}`, () => {
    it('should support external src files', async () => {
      const template = `<script src="./fixtures/script.${ext}"></script><div></div>`;
      const preprocessed = await preprocess(template, [processor(options)]);
      expect(preprocessed.toString()).toContain(EXPECTED_SCRIPT);
    });
  });
});

MARKUP_LANGS.forEach(([lang, ext, processor, options]) => {
  const EXPECTED_TEMPLATE = getFixtureContent('template.html');
  describe(`processor - ${lang}`, () => {
    it('should preprocess the whole file', async () => {
      const template = getFixtureContent('template.pug');
      const preprocessed = await preprocess(template, [processor(options)]);
      expect(preprocessed.toString()).toContain(EXPECTED_TEMPLATE);
    });
  });
});
