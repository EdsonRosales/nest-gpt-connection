import OpenAI from 'openai';

interface Options {
  threadId: string;
  assistantId?: string;
}

export const createRunUseCase = async (openai: OpenAI, options: Options) => {
  const { threadId, assistantId = 'asst_aIgSicqjFYYv7GXYeyRZKmtb' } = options; // TO DO: Move assistantId to env

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    // instructions: ¡CAUTION! assistant_id can override the assistant_id set in the thread.
  });
  console.log({ run });

  return run;
};
