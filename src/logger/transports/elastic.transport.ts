import {
  ElasticsearchTransport,
  ElasticsearchTransportOptions,
} from 'winston-elasticsearch';

const esTransportOpts: ElasticsearchTransportOptions = {
  level: 'info',
  clientOpts: {
    node: 'https://localhost:9200',
    auth: {
      username: 'elastic',
      password: 'vortex',
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
  indexPrefix: 'app-logs',
};

export const elasticTransport = new ElasticsearchTransport(esTransportOpts);
