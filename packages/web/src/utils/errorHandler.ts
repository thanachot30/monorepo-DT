import { AxiosError } from 'axios';

export function handleAxiosError(
  err: unknown,
  showError: (message: string) => void,
  fallbackMessage = 'An unknown error occurred'
): void {
  const error = err as AxiosError<any>;

  const message =
    error?.response?.data?.message || // NestJS structured error
    error?.response?.data || // raw body string
    error?.message || // network / client error
    fallbackMessage;

  showError(
    `Error: ${typeof message === 'string' ? message : JSON.stringify(message)}`
  );
}
