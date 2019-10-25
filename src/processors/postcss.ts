import { concat, parseFile } from '../utils';
import { PreprocessorGroup, Options } from '../typings';

/** Adapted from https://github.com/TehShrike/svelte-preprocess-postcss */
export default (options: Options.Postcss): PreprocessorGroup => ({
  async style(svelteFile) {
    const { default: transformer } = await import('../transformers/postcss');
    const { content, filename, dependencies } = await parseFile(
      svelteFile,
      'css',
    );

    /** If manually passed a plugins array, use it as the postcss config */
    const transformed = await transformer({ content, filename, options });
    return {
      ...transformed,
      dependencies: concat(dependencies, transformed.dependencies),
    };
  },
});
