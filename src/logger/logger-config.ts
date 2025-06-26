export const LoggerConfig = {
  modules: {
    OrderModule: {
      destinations: ['elastic', 'console'],
      formatter: 'order',
    },
    UserModule: {
      destinations: ['cloudwatch', 'console'],
      formatter: 'user',
    },
    StockModule: {
      destinations: ['console'],
      formatter: 'default',
    },
  },
};
