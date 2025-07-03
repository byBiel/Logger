## 📦 AppLogger - Logger Centralizado com ECS para NestJS

Este módulo fornece uma solução de log genérica, padronizada e pronta para produção usando Winston com suporte ao [Elastic Common Schema (ECS)](https://www.elastic.co/guide/en/ecs/current/index.html), facilitando a integração com:

- 🔹 Console
- 🔹 Elastic Stack (Elasticsearch + Kibana)
- 🔹 AWS CloudWatch

---

### ✅ Instalação

```bash
npm install winston @elastic/ecs-winston-format winston-cloudwatch
```

---

### ⚙️ Configuração

#### 1. **Arquivos de transporte (**``**)**

```ts
// console.transport.ts
import { transports } from 'winston';

export const consoleTransport = new transports.Console();
```

```ts
// elastic.transport.ts
export const elasticTransport = new transports.Http({
  host: 'http://localhost:5000',
  path: '/_bulk',
  ssl: false,
});
```

```ts
// cloudwatch.transport.ts
import WinstonCloudWatch from 'winston-cloudwatch';

export const cloudWatchTransport = new WinstonCloudWatch({
  logGroupName: 'my-log-group',
  logStreamName: 'my-stream',
  awsRegion: 'us-east-1',
});
```

---

#### 2. **Configuração de logger**

```ts
// logger.config.ts
export interface LoggerModuleConfig {
  level: string;
  transports: string[];
  formatter: string;
}

export const LoggerConfig: Record<'console' | 'elastic' | 'cloudwatch', LoggerModuleConfig> = {
  console: {
    level: 'info',
    transports: ['console'],
    formatter: 'ecs',
  },
  elastic: {
    level: 'info',
    transports: ['elastic', 'console'],
    formatter: 'ecs',
  },
  cloudwatch: {
    level: 'info',
    transports: ['cloudwatch', 'console'],
    formatter: 'ecs',
  },
};
```

---

### 🧠 Uso no Controller (Exemplo real)

```ts
import { Controller, Get } from '@nestjs/common';
import { AppLogger } from './logger/logger.service';

@Controller()
export class AppController {
  constructor(private readonly logger: AppLogger) {}

  @Get()
  getHello(): string {
    this.logger.log('Página acessada com sucesso.', 'Default');
    this.logger.warn('Aviso de teste', 'Default');
    this.logger.error('Erro de teste', 'Default', 'Stack trace opcional');
    return 'Hello World!';
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
```

---

### 📄 Formato de Log Padrão (ECS)

Exemplo de estrutura de log gerado:

```json
{
  "@timestamp": "2025-07-03T18:00:00.000Z",
  "log.level": "info",
  "message": "Usuário criou uma conta",
  "log": { "logger": "UserModule" },
  "user": { "id": "user123" },
  "event": { "action": "CREATE_ACCOUNT" },
  "labels": {
    "username": "gabriel",
    "email": "gabriel@email.com"
  }
}
```

---

### 🧹 APIs do AppLogger

```ts
log(
  message: string,
  context?: string,
  meta?: LogMeta,
  transport?: 'console' | 'elastic' | 'cloudwatch',
): void
```

```ts
error(
  message: string,
  context?: string,
  traceOrMeta?: string | LogMeta,
  transport?: 'console' | 'elastic' | 'cloudwatch',
): void
```

```ts
warn(
  message: string,
  context?: string,
  meta?: LogMeta,
  transport?: 'console' | 'elastic' | 'cloudwatch',
): void
```

---

### 🛡️ Boas práticas

- **Não precisa se preocupar com a estrutura dos logs**, basta enviar os dados no objeto `meta`.
- Os campos `userId`, `action` e `details` são tratados automaticamente conforme o [ECS](https://www.elastic.co/guide/en/ecs/current/index.html).
- Informações extras são adicionadas como `labels`.

---
