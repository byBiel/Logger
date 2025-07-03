import { Controller, Get } from '@nestjs/common';
import { AppLogger } from './logger/logger.service';

@Controller()
export class AppController {
  constructor(private readonly logger: AppLogger) {}

  @Get()
  getHello(): string {
    this.logger.log('Página inicial acessada', 'Default');
    this.logger.error(
      'Erro de teste simulado',
      'Default',
      'Stack trace de exemplo',
    );
    this.logger.warn('Aviso de teste emitido', 'Default');

    return 'Hello World!';
  }

  @Get('error-test')
  testError(): string {
    try {
      throw new Error('Erro gerado propositalmente');
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(error.message, 'ErrorTest', error.stack);
      } else {
        this.logger.error('Erro desconhecido capturado', 'ErrorTest');
      }
      return 'Erro registrado com sucesso!';
    }
  }

  @Get('user-log')
  testUserLog(): string {
    const user = {
      userId: 'user123',
      action: 'CREATE_ACCOUNT',
      details: {
        username: 'gabriel',
        email: 'gabriel@email.com',
        plan: 'premium',
      },
    };

    this.logger.log('Usuário criou uma conta', 'UserModule', user);
    return 'Log de criação de usuário registrado!';
  }

  @Get('custom-log')
  testCustomLog(): string {
    const computador = {
      gabinete: 'Samsung',
      monitor: 'Samsung',
      processador: 'i9',
      memoria: '16GB',
    };
    this.logger.log('Computador criado com sucesso', 'InfraModule', computador);

    return 'Log de computador registrado!';
  }
}
