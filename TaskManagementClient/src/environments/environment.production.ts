export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com',
  retry: {
    count: 3,       // max retry attempts
    delayMs: 1000,  // base delay: 1s → 2s → 4s (exponential backoff)
  },
};
