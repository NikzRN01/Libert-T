type SupabaseClientLike = {
  from: (table: string) => unknown;
};

export function getSupabaseClient(): SupabaseClientLike {
  throw new Error(
    "Supabase client not configured yet. Install @supabase/supabase-js and wire env vars."
  );
}
