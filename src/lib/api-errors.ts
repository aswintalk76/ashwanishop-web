import type { AxiosError } from 'axios';

type ValidationPayload = {
  message?: string;
  errors?: Record<string, string[]>;
};

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  const axiosErr = error as AxiosError<ValidationPayload>;
  const data = axiosErr.response?.data;

  if (data?.errors) {
    const first = Object.values(data.errors).flat().find(Boolean);
    if (first) return first;
  }

  if (data?.message) return sanitizeApiMessage(data.message);

  return fallback;
}

/** Hide long SQL errors in toasts; keep full text in Laravel debug pages. */
function sanitizeApiMessage(message: string): string {
  if (
    message.includes('SQLSTATE') ||
    message.includes('Access denied for user') ||
    message.includes('Connection refused')
  ) {
    return 'Database not reachable. On your PC use SQLite in backend/.env, or enable Hostinger Remote MySQL for your IP.';
  }
  if (message.length > 160) {
    return `${message.slice(0, 160)}…`;
  }
  return message;
}
