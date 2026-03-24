"use client";
import { useEffect, useState } from "react";
import {
  getMessages,
  sendMessage,
  getTasks,
  addTask,
  completeTask,
} from "../lib/supabase";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    getMessages().then(setMessages);
    getTasks().then(setTasks);
  }, []);

  async function handleSend() {
    if (!text) return;
    await sendMessage({ content: text, sender: "me" });
    setText("");
    const msgs = await getMessages();
    setMessages(msgs);
  }

  async function handleAddTask() {
    if (!text) return;
    await addTask({ text, owner: "me" });
    setText("");
    const t = await getTasks();
    setTasks(t);
  }

  async function handleComplete(id) {
    await completeTask(id);
    const t = await getTasks();
    setTasks(t);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Elena Care</h1>

      <h2>Messages</h2>
      {messages.map((m) => (
        <div key={m.id}>{m.content}</div>
      ))}

      <h2>Tasks</h2>
      {tasks.map((t) => (
        <div key={t.id} onClick={() => handleComplete(t.id)}>
          {t.text}
        </div>
      ))}

      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleSend}>Send</button>
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
}
