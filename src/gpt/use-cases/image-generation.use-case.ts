import * as fs from 'fs';
import * as path from 'path';

import OpenAI from 'openai';
import { downloadBase64ImageAsPng, downloadImageAsPng } from '../../helpers';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt, originalImage, maskImage } = options;
  // Verify the original image
  if (!originalImage || !maskImage) {
    const resp = await openai.images.generate({
      prompt,
      model: 'dall-e-3',
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    });

    // Save the image in FileSystem
    const url = await downloadImageAsPng(resp.data[0].url);

    return {
      url, // <--- TO DO: http://localhost:3000/image-generator/nameFile.png
      openAIUrl: resp.data[0].url,
      revised_promp: resp.data[0].revised_prompt,
    };
  }

  // The original Image source
  const pngImagePath = await downloadImageAsPng(originalImage);
  const maskPath = await downloadBase64ImageAsPng(maskImage);

  const response = await openai.images.edit({
    model: 'dall-e-2',
    prompt,
    image: fs.createReadStream(pngImagePath),
    mask: fs.createReadStream(maskPath),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  const localImagePath = await downloadImageAsPng(response.data[0].url);
  const fileName = path.basename(localImagePath);
  const publicUrl = `localhost:3000/${fileName}`; // <--- Just a temporal solution

  return {
    url: publicUrl, // <--- TO DO: http://localhost:3000/image-generator/nameFile.png
    openAIUrl: response.data[0].url,
    revised_promp: response.data[0].revised_prompt,
  };
};
