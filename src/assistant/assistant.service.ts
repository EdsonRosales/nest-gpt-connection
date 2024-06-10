import { Injectable } from '@nestjs/common';

import OpenAI from 'openai';
import {
  createMessageUseCase,
  createRunUseCase,
  createThreadUseCase,
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
    const message = await createMessageUseCase(this.openai, {
      question,
      threadId,
    });

    const run = await createRunUseCase(this.openai, { threadId });
  }
}
