type SupabasePublicConfigStatus = {
  isConfigured: boolean;
  reason: string | null;
  url: string | null;
  urlProjectRef: string | null;
  keyProjectRef: string | null;
};

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');

  if (typeof atob === 'function') {
    return atob(padded);
  }

  return Buffer.from(padded, 'base64').toString('utf-8');
}

function getProjectRefFromUrl(url: string) {
  const match = url.match(/^https:\/\/([^.]+)\.supabase\.co$/i);
  return match?.[1] ?? null;
}

function getProjectRefFromJwt(token: string) {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(parts[1])) as { ref?: string };
    return payload.ref ?? null;
  } catch {
    return null;
  }
}

export function getSupabasePublicConfigStatus(): SupabasePublicConfigStatus {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';

  if (!url || !key) {
    return {
      isConfigured: false,
      reason: 'Supabase credentials are missing.',
      url: url || null,
      urlProjectRef: null,
      keyProjectRef: null,
    };
  }

  if (
    url === 'https://placeholder.supabase.co' ||
    key.includes('placeholder') ||
    key === 'your_supabase_anon_key'
  ) {
    return {
      isConfigured: false,
      reason: 'Supabase credentials still contain placeholder values.',
      url,
      urlProjectRef: getProjectRefFromUrl(url),
      keyProjectRef: getProjectRefFromJwt(key),
    };
  }

  const urlProjectRef = getProjectRefFromUrl(url);
  if (!urlProjectRef) {
    return {
      isConfigured: false,
      reason: 'Supabase URL is invalid.',
      url,
      urlProjectRef: null,
      keyProjectRef: null,
    };
  }

  // Support both old JWT format and new sb_* format
  let keyProjectRef = getProjectRefFromJwt(key);
  
  // If JWT parsing failed, assume new sb_publishable_* format (project ref is already validated via URL)
  if (!keyProjectRef && key.startsWith('sb_publishable_')) {
    keyProjectRef = urlProjectRef;
  }
  
  if (!keyProjectRef) {
    return {
      isConfigured: false,
      reason: 'Supabase anon key is malformed.',
      url,
      urlProjectRef,
      keyProjectRef: null,
    };
  }

  if (urlProjectRef !== keyProjectRef) {
    return {
      isConfigured: false,
      reason: 'Supabase URL and anon key belong to different projects.',
      url,
      urlProjectRef,
      keyProjectRef,
    };
  }

  return {
    isConfigured: true,
    reason: null,
    url,
    urlProjectRef,
    keyProjectRef,
  };
}
