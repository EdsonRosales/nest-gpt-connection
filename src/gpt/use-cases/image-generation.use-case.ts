import OpenAI from 'openai';
import { downloadImageAsPng } from '../../helpers';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt, maskImage, originalImage } = options;
  // TO DO: Verify the original image

  const resp = await openai.images.generate({
    prompt,
    model: 'dall-e-3',
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    response_format: 'url',
  });

  // TO DO: Save the image in FileSystem
  await downloadImageAsPng(resp.data[0].url);

  console.log(resp);
  return {
    url: resp.data[0].url,
    localPath: '',
    revised_promp: resp.data[0].revised_prompt,
  };
};
