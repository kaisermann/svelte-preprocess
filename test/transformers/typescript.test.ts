import { resolve } from 'path';

import { Diagnostic } from 'typescript';

import getAutoPreprocess from '../../src';
import { Processed } from '../../src/types';
import { preprocess, getFixtureContent } from '../utils';

const EXPECTED_SCRIPT = getFixtureContent('script.js');

const transpile = (content: string, compilerOptions?: any) => {
  const opts = getAutoPreprocess({
    typescript: {
      tsconfigFile: false,
      compilerOptions: {
        ...compilerOptions,
        skipLibCheck: true,
      },
    },
  });

  return opts.script({
    content,
    attributes: { type: 'text/typescript' },
    filename: resolve(__dirname, '..', 'App.svelte'),
  }) as Processed & { diagnostics: Diagnostic[] };
};

describe('transformer - typescript', () => {
  const template = `<div></div><script lang="ts">${getFixtureContent(
    'script.ts',
  )}</script>`;

  it('should disallow transpilation to es5 or lower', async () => {
    expect(
      transpile('export let foo = 10', { target: 'es3' }),
    ).rejects.toThrow();
    expect(
      transpile('export let foo = 10', { target: 'es5' }),
    ).rejects.toThrow();
  });

  describe('configuration file', () => {
    it('should work with no compilerOptions', async () => {
      const opts = getAutoPreprocess({ typescript: { tsconfigFile: false } });
      const preprocessed = await preprocess(template, opts);
      expect(preprocessed.toString()).toContain('export var hello');
    });

    it('should work with tsconfigDirectory', async () => {
      const opts = getAutoPreprocess({
        typescript: {
          tsconfigFile: false,
          tsconfigDirectory: './test/fixtures',
        },
      });
      const preprocessed = await preprocess(template, opts);
      expect(preprocessed.toString()).toContain(EXPECTED_SCRIPT);
    });

    it('should work with tsconfigFile', async () => {
      const opts = getAutoPreprocess({
        typescript: {
          tsconfigFile: './test/fixtures/tsconfig.json',
        },
      });
      const preprocessed = await preprocess(template, opts);
      expect(preprocessed.toString()).toContain(EXPECTED_SCRIPT);
    });

    it('should report config syntactic errors in tsconfig file', () => {
      const opts = getAutoPreprocess({
        typescript: {
          tsconfigFile: './test/fixtures/tsconfig.syntactic.json',
        },
      });
      return expect(preprocess(template, opts)).rejects.toThrow('TS1005');
    });

    it('should report config semantic errors in tsconfig file', () => {
      const opts = getAutoPreprocess({
        typescript: {
          tsconfigFile: './test/fixtures/tsconfig.semantic.json',
        },
      });
      return expect(preprocess(template, opts)).rejects.toThrow('TS6046');
    });

    it('should not type check if "transpileOnly: true"', async () => {
      const opts = getAutoPreprocess({
        typescript: {
          transpileOnly: true,
          compilerOptions: {
            module: 'es6',
            sourceMap: false,
          },
        },
      });
      const { code } = await preprocess(template, opts);
      return expect(code).toContain(getFixtureContent('script.js'));
    });
  });

  describe('code errors', () => {
    it('should report semantic errors in template', async () => {
      const { diagnostics } = await transpile('let label:string = 10');
      expect(diagnostics.some(d => d.code === 2322)).toBe(true);
    });

    it('should report invalid relative svelte import statements', async () => {
      const { diagnostics } = await transpile(
        `import Nested from './fixtures/NonExistent.svelte'`,
      );
      expect(diagnostics.some(d => d.code === 2307)).toBe(true);
    });

    it('should NOT report valid relative svelte import statements', async () => {
      const { diagnostics } = await transpile(
        `import Nested from './fixtures/Nested.svelte'`,
      );
      expect(diagnostics.some(d => d.code === 2307)).toBe(false);
    });

    it('should NOT report non-relative svelte import statements', async () => {
      const { diagnostics } = await transpile(
        `import Nested from 'svelte/FakeSvelte.svelte'`,
      );
      expect(diagnostics.some(d => d.code === 2307)).toBe(false);
    });

    it('should NOT affect non-svelte import statement', async () => {
      const { diagnostics } = await transpile(
        `import Nested from './relative/yaddaYadda.js'`,
      );
      expect(diagnostics.some(d => d.code === 2307)).toBe(true);
    });

    it('should NOT affect import statement without file extension', async () => {
      const { diagnostics } = await transpile(
        `import Nested from './relative/noExtension'`,
      );
      expect(diagnostics.some(d => d.code === 2307)).toBe(true);
    });

    it('should NOT report a mismatched variable name error when using reactive variables', async () => {
      const { diagnostics } = await transpile(
        `
          const user = {};
          $user.name = "test";
        `,
      );
      expect(diagnostics.some(d => d.code === 2552)).toBe(false);
    });
    
    it('should report a mismatched variable name error', async () => {
      const { diagnostics } = await transpile(
        `
          const user = {};
          xuser.name = "test";
        `,
      );
      expect(diagnostics.some(d => d.code === 2552)).toBe(true);
    });

  });
});
