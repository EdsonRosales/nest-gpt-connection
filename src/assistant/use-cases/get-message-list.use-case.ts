import OpenAI from 'openai';

interface Options {
  threadId: string;
}

export const getMessageListUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { threadId } = options;

  const messagesList = await openai.beta.threads.messages.list(threadId);

  console.log(messagesList);

  const messages = messagesList.data.map((messages) => ({
    role: messages.role,
    content: messages.content.map((content) => (content as any).text.value),
  }));

  return messages;
};
