import { Controller, Get } from '@nestjs/common';
import { AppLogger } from './logger/logger.service';

@Controller()
export class AppController {
  constructor(private readonly logger: AppLogger) {}

  @Get()
  getHello(): string {
    this.logger.log('Está página foi acessada!', 'Default');
    this.logger.error('Erro de teste', 'Default', 'Stack trace de exemplo');
    this.logger.warn('Aviso de teste', 'Default');
    return 'Hello World!';
  }

  @Get('error-test')
  testError(): string {
    try {
      throw new Error('Erro de teste');
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(error.message, 'Default', error.stack);
      } else {
        this.logger.error('Erro desconhecido capturado', 'Default');
      }
      return 'Erro registrado no log!';
    }
  }

  @Get('user-log')
  testUserLog(): string {
    this.logger.log('Usuário criou uma conta', 'UserModule', {
      userId: 'user123',
      action: 'CREATE_ACCOUNT',
      details: { username: 'gabriel', email: 'gabriel@email.com' },
    });
    return 'Log de usuário registrado!';
  }
}
