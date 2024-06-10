import { Injectable } from '@nestjs/common';

import OpenAI from 'openai';
import {
  checkCompleteStatusUseCase,
  createMessageUseCase,
  createRunUseCase,
  createThreadUseCase,
  getMessageListUseCase,
} from './use-cases';
import { QuestionDto } from './dtos/question.dto';
@Injectable()
export class AssistantService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async createThread() {
    return await createThreadUseCase(this.openai);
  }

  async userQuestion(questionDto: QuestionDto) {
    const { question, threadId } = questionDto;
    await createMessageUseCase(this.openai, {
      question,
      threadId,
    });

    const run = await createRunUseCase(this.openai, { threadId });

    await checkCompleteStatusUseCase(this.openai, { runId: run.id, threadId });

    const messages = await getMessageListUseCase(this.openai, { threadId });

    return messages;
  }
}
