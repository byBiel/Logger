# Logger Module

Módulo de logger customizado para aplicações NestJS utilizando **Winston** com suporte a múltiplos destinos de log (transports), formato compatível com **Elastic Common Schema (ECS)** e integração com **CloudWatch** e **Elasticsearch**.

---

## 📦 Visão Geral

Este módulo fornece uma forma flexível e extensível para registrar logs em aplicações Node/NestJS. Ele suporta:

- Múltiplos **transports** (`console`, `cloudwatch`, `elastic`)
- Formatação ECS para compatibilidade com ELK Stack
- Injeção automática via `AppLogger` com escopo **transient**
- Logs estruturados com informações como `userId`, `action`, `details`, e `stack_trace`

---

## ⚙️ Estrutura do Módulo

### Configuração (`logger.config.ts`)

Define os níveis de log, os `transports` habilitados e o formato utilizado:

```ts
export const LoggerConfig: Record<TransportType, LoggerModuleConfig> = {
  console: {
    level: 'info',
    transports: ['console'],
    formatter: 'ecs',
  },
  cloudwatch: {
    level: 'info',
    transports: ['cloudwatch', 'console'],
    formatter: 'ecs',
  },
  elastic: {
    level: 'info',
    transports: ['elastic', 'console'],
    formatter: 'ecs',
  },
};
```

---

### Formatador (`logger.formatter.ts`)

Utiliza o `@elastic/ecs-winston-format` para padronizar os logs no formato ECS:

```ts
export const ecsFormatter = ecsFormat({ convertReqRes: true });
```

---

### Módulo NestJS (`logger.module.ts`)

Exponibiliza a instância `AppLogger` como provider:

```ts
@Module({
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggerModule {}
```

---

### Serviço (`logger.service.ts`)

Classe principal para geração dos logs:

- `log`: nível info
- `warn`: nível warn
- `error`: nível error
- `buildLogObject`: retorna o objeto formatado (útil para testes ou inspeção)

#### Exemplo:

```ts
this.logger.log('Usuário logado com sucesso', 'AuthController', {
  userId: 123,
  action: 'login',
  details: { ip: '192.168.0.1' },
});
```

---

## 🚚 Transports Suportados

Mapeados em `logger.transports.ts`, cada transport é registrado conforme a chave:

```ts
export const transportMap = {
  console: consoleTransport,
  elastic: elasticTransport,
  cloudwatch: cloudWatchTransport,
};
```

Você pode adicionar novos transports personalizados adicionando novos arquivos na pasta `transports/`.

---

## 🧠 Metadados (`logger.types.ts`)

A interface `LogMeta` permite enriquecer o log com:

```ts
export interface LogMeta {
  userId?: number;
  action?: string;
  details?: Record<string, unknown>;
  [key: string]: unknown;
}
```

Essas informações são convertidas automaticamente para os campos ECS como `user.id`, `event.action`, `labels`.

---

## 📘 Uso no NestJS

### 1. Importação no módulo principal

```ts
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [LoggerModule],
})
export class AppModule {}
```

### 2. Injeção no serviço ou controller

```ts
constructor(private readonly logger: AppLogger) {}
```

### 3. Exemplos de uso

```ts
this.logger.log('Mensagem informativa', 'MeuContexto', { userId: 1 });

this.logger.warn('Atenção com operação inválida', 'AuthService', {
  action: 'login-failed',
  details: { ip: '127.0.0.1' },
});

this.logger.error('Erro crítico', 'ProdutosService', 'Stacktrace do erro');
```

---

## 🐞 Troubleshooting

- **Logger não imprime no console**: verifique se o nível (`level`) em `LoggerConfig` está abaixo ou igual ao nível atual de log.
- **Problemas com CloudWatch ou Elastic**: certifique-se de que as credenciais, permissões e configurações de destino estão corretas.

---

## 📌 Observações

- A instância de logger é escopo `TRANSIENT`, ou seja, é criada para cada injeção. Isso permite que o `context` seja dinâmico e isolado por uso.
- Campos extras que não são `userId`, `action` ou `details` também são incluídos no `labels`.

---

## 🛠️ Futuras Melhorias (Sugestões)

- Suporte a filtros de log por ambiente
- Integração com Sentry
- Inclusão de requestId automático em cada log

---

## 📁 Estrutura de Arquivos

```
logger/
│
├── logger.module.ts
├── logger.service.ts
├── logger.config.ts
├── logger.formatter.ts
├── logger.transports.ts
├── logger.types.ts
└── transports/
    ├── console.transport.ts
    ├── elastic.transport.ts
    └── cloudwatch.transport.ts
```

---

## 📄 Licença

Esse módulo pode ser reutilizado e customizado conforme a necessidade da equipe. Caso utilize serviços externos como AWS CloudWatch ou Elastic Cloud, consulte suas respectivas políticas de uso.