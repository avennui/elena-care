import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(url, key, {
  realtime: { params: { eventsPerSecond: 10 } },
});

// ---- Messages ----

export async function getMessages(limit = 100) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function sendMessage({ type = "text", content, file_url, transcript, sender }) {
  const { data, error } = await supabase
    .from("messages")
    .insert({ type, content, file_url, transcript, sender })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---- Tasks ----

export async function getTasks() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("done", false)
    .order("created_at", { ascending: true })
    .limit(5);
  if (error) throw error;
  return data;
}

export async function addTask({ text, owner }) {
  const { data, error } = await supabase
    .from("tasks")
    .insert({ text, owner })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function completeTask(id) {
  const { error } = await supabase
    .from("tasks")
    .update({ done: true })
    .eq("id", id);
  if (error) throw error;
}

// ---- Patient Info ----

export async function getPatientInfo() {
  const { data, error } = await supabase
    .from("patient_info")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw error;
  return data;
}

export async function updatePatientInfo(fields) {
  const { data, error } = await supabase
    .from("patient_info")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", 1)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---- File Upload ----

export async function uploadFile(file, path) {
  const { data, error } = await supabase.storage
    .from("care-files")
    .upload(path, file, { upsert: true });
  if (error) throw error;
  const { data: urlData } = supabase.storage
    .from("care-files")
    .getPublicUrl(data.path);
  return urlData.publicUrl;
}

// ---- Realtime subscriptions ----

export function subscribeMessages(callback) {
  return supabase
    .channel("messages-realtime")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
      callback(payload.new);
    })
    .subscribe();
}

export function subscribeTasks(callback) {
  return supabase
    .channel("tasks-realtime")
    .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => {
      callback();
    })
    .subscribe();
}
