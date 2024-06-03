import * as fs from 'fs';

import OpenAI from 'openai';

interface Options {
  prompt?: string;
  audioFile: Express.Multer.File;
}

export const audioToTextUseCase = async (openai: OpenAI, options: Options) => {
  const { audioFile, prompt } = options;

  console.log({ audioFile, prompt });

  const response = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file: fs.createReadStream(audioFile.path),
    prompt: prompt, // <---- In the same language as the audio file
    language: 'es',
    response_format: 'verbose_json', // <---- More info to cosume in the frontend
  });

  return response;
};
