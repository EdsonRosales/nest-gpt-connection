import * as fs from 'fs';

import OpenAI from 'openai';
import { downloadImageAsPng } from '../../helpers';

interface Options {
  baseImage: string;
}

export const imageVariationUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { baseImage } = options;

  // Save the image
  const pngImagePath = await downloadImageAsPng(baseImage, true);
  const response = await openai.images.createVariation({
    image: fs.createReadStream(pngImagePath),
    model: 'dall-e-2',
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  // Save the image in FileSystem
  const fileName = await downloadImageAsPng(response.data[0].url);
  const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

  return {
    url,
    openAIUrl: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};
