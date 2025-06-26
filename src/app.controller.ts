import { Controller } from '@nestjs/common';
import { AppLogger } from './logger/logger.service';

@Controller()
export class AppController {
  constructor(private readonly logger: AppLogger) {}
}
