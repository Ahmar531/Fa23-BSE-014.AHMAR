import { NextResponse } from 'next/server';

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    init
  );
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details,
    },
    { status }
  );
}

export function getErrorStatus(error: unknown, fallback = 400) {
  if (error instanceof Error) {
    if (error.message === 'Unauthorized') return 401;
    if (error.message === 'Forbidden' || error.message === 'Account disabled') return 403;
  }

  return fallback;
}
