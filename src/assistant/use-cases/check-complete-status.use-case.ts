import { InternalServerErrorException } from '@nestjs/common';

import OpenAI from 'openai';

interface Options {
  threadId: string;
  runId: string;
}

export const checkCompleteStatusUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { threadId, runId } = options;

  const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

  console.log({ status: runStatus.status }); // completed

  if (runStatus.status === 'completed') {
    return runStatus;
  } else if (runStatus.status === 'failed') {
    throw new InternalServerErrorException('Run failed');
  }

  // Wait for 1 second before checking the status again
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Recursively check the status until it's completed
  return await checkCompleteStatusUseCase(openai, options);
};
