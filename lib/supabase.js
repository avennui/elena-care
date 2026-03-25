import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const configError = "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY";
const DEFAULT_PATIENT_INFO = {
  id: 1,
  name: "",
  dob: "",
  hospital: "",
  nurse_station: "",
  case_manager: "",
  case_manager_phone: "",
  insurance: "",
  phase: "hospital",
  current_shift: "",
};

export function isSupabaseConfigured() {
  return Boolean(url && key);
}

export function getSupabaseConfigError() {
  return isSupabaseConfigured() ? null : configError;
}

export const supabase = isSupabaseConfigured()
  ? createClient(url, key, {
      realtime: { params: { eventsPerSecond: 10 } },
    })
  : null;

function getSupabaseClient() {
  if (!supabase) {
    throw new Error(configError);
  }

  return supabase;
}

// ---- Messages ----

export async function getMessages(limit = 100) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function sendMessage({ type = "text", content, file_url, transcript, sender }) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("messages")
    .insert({ type, content, file_url, transcript, sender })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---- Tasks ----

export async function getTasks() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("tasks")
    .select("*")
    .eq("done", false)
    .order("created_at", { ascending: true })
    .limit(5);
  if (error) throw error;
  return data;
}

export async function addTask({ text, owner }) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("tasks")
    .insert({ text, owner })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function completeTask(id) {
  const client = getSupabaseClient();
  const { error } = await client
    .from("tasks")
    .update({ done: true })
    .eq("id", id);
  if (error) throw error;
}

// ---- Patient Info ----

export async function getPatientInfo() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("patient_info")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  return data || DEFAULT_PATIENT_INFO;
}

export async function updatePatientInfo(fields) {
  const client = getSupabaseClient();
  const existing = await getPatientInfo();
  const { data, error } = await client
    .from("patient_info")
    .upsert({
      ...DEFAULT_PATIENT_INFO,
      ...existing,
      ...fields,
      id: 1,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---- File Upload ----

export async function uploadFile(file, path) {
  const client = getSupabaseClient();
  const { data, error } = await client.storage
    .from("care-files")
    .upload(path, file, { upsert: true });
  if (error) throw error;
  const { data: urlData } = client.storage
    .from("care-files")
    .getPublicUrl(data.path);
  return urlData.publicUrl;
}

// ---- Realtime subscriptions ----

export function subscribeMessages(callback) {
  return getSupabaseClient()
    .channel("messages-realtime")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
      callback(payload.new);
    })
    .subscribe();
}

export function subscribeTasks(callback) {
  return getSupabaseClient()
    .channel("tasks-realtime")
    .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => {
      callback();
    })
    .subscribe();
}
