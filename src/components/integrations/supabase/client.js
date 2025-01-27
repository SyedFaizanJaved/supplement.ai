import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://gfzdxckeajqmjeshysyo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmemR4Y2tlYWpxbWplc2h5c3lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxNzkxMjEsImV4cCI6MjA1MTc1NTEyMX0.-h3fOQD95qIsVqcI6Of-erA48tlwOL7cycg1D3STVyk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
