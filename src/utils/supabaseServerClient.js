import { createClient } from "@supabase/supabase-js";

let cachedClient = null;

const createSupabaseServerClient = () => {
  if (cachedClient) {
    return cachedClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is not set. Please add it to your environment configuration."
    );
  }

  // Use service role key if available, otherwise fall back to anon key
  const key = serviceRoleKey || anonKey;
  
  if (!key) {
    throw new Error(
      "Neither SUPABASE_SERVICE_ROLE_KEY nor NEXT_PUBLIC_SUPABASE_ANON_KEY is set."
    );
  }

  cachedClient = createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
    },
  });

  return cachedClient;
};

export default createSupabaseServerClient;
