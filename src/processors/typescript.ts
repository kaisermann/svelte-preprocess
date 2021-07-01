import type { Options, PreprocessorGroup } from '../types';
import { getTagInfo } from '../modules/tagInfo';
import { concat } from '../modules/utils';
import { prepareContent } from '../modules/prepareContent';

export default (options?: Options.Typescript): PreprocessorGroup => ({
  async script(svelteFile) {
    const { transformer } = await import('../transformers/typescript');
    let {
      content,
      filename,
      attributes,
      lang,
      dependencies,
    } = await getTagInfo(svelteFile);

    if (lang !== 'typescript') {
      return { code: content };
    }

    content = prepareContent({ options, content });

    const transformed = await transformer({
      content,
      filename,
      attributes,
      options,
    });

    return {
      ...transformed,
      dependencies: concat(dependencies, transformed.dependencies),
    };
  },
});
