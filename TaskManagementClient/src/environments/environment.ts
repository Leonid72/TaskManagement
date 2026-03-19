export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000',
  retry: {
    count: 3,       // max retry attempts
    delayMs: 1000,  // base delay: 1s → 2s → 4s (exponential backoff)
  },
};
