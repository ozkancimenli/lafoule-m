import { createClient } from '@supabase/supabase-js';

let cachedClient = null;

const createSupabaseServerClient = () => {
  if (cachedClient) {
    return cachedClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL is not set. Please add it to your environment configuration.'
    );
  }

  if (!anonKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Please add it to your environment configuration.'
    );
  }

  cachedClient = createClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
    },
  });

  return cachedClient;
};

export default createSupabaseServerClient;
