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

  if (data?.message) return data.message;

  return fallback;
}
