"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getSupabaseConfigError,
  isSupabaseConfigured,
  getMessages, sendMessage, subscribeMessages,
  getTasks, addTask, completeTask, subscribeTasks,
  getPatientInfo, updatePatientInfo, uploadFile,
} from "../lib/supabase";
import ConfigNotice from "./components/ConfigNotice";
import TopInfo from "./components/TopInfo";
import PhaseTracker from "./components/PhaseTracker";
import Feed from "./components/Feed";
import Tasks from "./components/Tasks";
import NavBar from "./components/NavBar";
import Composer from "./components/Composer";
import CoveragePing from "./components/CoveragePing";
import UserSetup from "./components/UserSetup";
import ElenaView from "./components/ElenaView";
import CareAdvisor from "./components/CareAdvisor";

export default function Home() {
  const supabaseReady = isSupabaseConfigured();
  const [tab, setTab] = useState("feed");
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [info, setInfo] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("elena-care-user");
    if (saved) setUser(saved);
  }, []);

  useEffect(() => {
    if (!user || !supabaseReady) { setLoading(false); return; }
    (async () => {
      try {
        const [msgs, tks, inf] = await Promise.all([getMessages(), getTasks(), getPatientInfo()]);
        setMessages(msgs || []);
        setTasks(tks || []);
        setInfo(inf);
      } catch (e) { console.error("Load error:", e); }
      setLoading(false);
    })();
  }, [supabaseReady, user]);

  useEffect(() => {
    if (!user || !supabaseReady) return;
    const msgSub = subscribeMessages((newMsg) => setMessages((prev) => [...prev, newMsg]));
    const taskSub = subscribeTasks(async () => { const tks = await getTasks(); setTasks(tks || []); });
    return () => { msgSub.unsubscribe(); taskSub.unsubscribe(); };
  }, [supabaseReady, user]);

  const handleSend = useCallback(async ({ type, content, file, transcript }) => {
    let file_url = null;
    if (file) {
      const ext = file.name?.split(".").pop() || "bin";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      file_url = await uploadFile(file, path);
    }
    await sendMessage({ type, content, file_url, transcript, sender: user });
  }, [user]);

  const handleAddTask = useCallback(async (text) => {
    if (tasks.length >= 5) return;
    await addTask({ text, owner: user });
    const tks = await getTasks(); setTasks(tks || []);
  }, [user, tasks]);

  const handleCompleteTask = useCallback(async (id) => {
    await completeTask(id);
    const tks = await getTasks(); setTasks(tks || []);
  }, []);

  const handleUpdateInfo = useCallback(async (fields) => {
    const updated = await updatePatientInfo(fields);
    setInfo(updated);
  }, []);

  const handleHandoff = useCallback(async (toUser) => {
    await sendMessage({ type: "handoff", content: `${user} → ${toUser}`, sender: user });
    await updatePatientInfo({ current_shift: toUser });
    setInfo((prev) => ({ ...prev, current_shift: toUser }));
  }, [user]);

  if (!supabaseReady) {
    return <ConfigNotice error={getSupabaseConfigError()} />;
  }

  if (!user) return <UserSetup onSet={(name) => { localStorage.setItem("elena-care-user", name); setUser(name); }} />;
  if (loading) return <div className="flex items-center justify-center h-screen text-[11px] tracking-[0.1em] uppercase text-t3">Loading…</div>;

  const isElena = user.toLowerCase() === "elena";

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-bg">
      <TopInfo info={info} onUpdate={handleUpdateInfo} user={user} onHandoff={handleHandoff} />
      <PhaseTracker phase={info?.phase} onUpdate={(phase) => handleUpdateInfo({ phase })} isElena={isElena} />
      <CoveragePing messages={messages} />

      <div className="flex-1 overflow-hidden">
        {tab === "feed" && (
          <div className="flex flex-col h-full">
            <Feed messages={messages} user={user} />
            <Composer user={user} onSend={handleSend} />
          </div>
        )}
        {tab === "tasks" && <Tasks tasks={tasks} user={user} onAdd={handleAddTask} onComplete={handleCompleteTask} />}
        {tab === "recovery" && <ElenaView messages={messages} />}
        {tab === "advisor" && <CareAdvisor info={info} />}
      </div>

      <NavBar tab={tab} onTab={setTab} isElena={isElena} />
    </div>
  );
}
