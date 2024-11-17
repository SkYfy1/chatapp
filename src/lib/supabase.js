import { createClient } from "@supabase/supabase-js";


const API_KEY = import.meta.env.VITE_SUPABASE_API2;
const URL = import.meta.env.VITE_SUPABASE_URL;

const supabase = createClient(URL, API_KEY);

export default supabase;