import { resolve } from 'path';

import { importAny } from '../src/modules/importAny';
import { getIncludePaths } from '../src/modules/getIncludePaths';
import { globalifySelector } from '../src/modules/globalifySelector';

describe('importAny', () => {
  it('should throw error when none exist', () => {
    return expect(importAny('_1', '_2')).rejects.toThrowError(
      'Cannot find any of modules: _1,_2',
    );
  });

  it('should not throw error when any exist', async () => {
    const nodeSass = await import('node-sass');

    expect((await importAny('_1', 'node-sass', '_2')).default).toBe(
      nodeSass.default,
    );
  });
});

describe('getIncludePaths', () => {
  const dummyDir = resolve(process.cwd(), 'src');
  const dummyFile = resolve(dummyDir, 'App.svelte');

  it('should default to cwd, node_modules and current file dirname', () => {
    const paths = getIncludePaths(dummyFile);

    expect(paths).toEqual(
      expect.arrayContaining(['node_modules', process.cwd(), dummyDir]),
    );
  });

  it('should prepend any passed paths via config object', () => {
    const paths = getIncludePaths(dummyFile, ['src']);

    expect(paths).toEqual(
      expect.arrayContaining(['src', 'node_modules', process.cwd(), dummyDir]),
    );
  });

  it('should remove duplicate paths', () => {
    const paths = getIncludePaths(dummyFile, [
      'src',
      'node_modules',
      process.cwd(),
    ]);

    expect(paths).toEqual(['src', 'node_modules', process.cwd(), dummyDir]);
  });
});

describe('globalifySelector', () => {
  it('correctly treats CSS selectors with legal spaces', async () => {
    const selector = '[attr="with spaces"]';

    expect(globalifySelector(selector)).toEqual(
      ':global([attr="with spaces"])',
    );
  });

  it('correctly treats CSS combinators', async () => {
    const selector1 = 'div > span';
    const selector2 = 'div, span';

    expect(globalifySelector(selector1)).toMatch(
      // either be :global(div > span)
      //        or :global(div) > :global(span)
      /(:global\(div> span\)|:global\(div\) > :global\(span\))/,
    );
    expect(globalifySelector(selector2)).toEqual(':global(div), :global(span)');
  });
});
