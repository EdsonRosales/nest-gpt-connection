import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases';

@Injectable()
export class GptService {
  // Only call use Cases in this Service
  async orthographyCheck() {
    return await orthographyCheckUseCase();
  }
}
