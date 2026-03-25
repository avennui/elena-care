"use client";

import { useState, useRef, useCallback } from "react";

export default function Composer({ user, onSend }) {
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [sending, setSending] = useState(false);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  const handleSendText = useCallback(async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try { await onSend({ type: "text", content: text.trim() }); setText(""); } catch (e) { console.error(e); }
    setSending(false);
  }, [text, sending, onSend]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], `voice-${Date.now()}.webm`, { type: "audio/webm" });
        setSending(true);
        try { await onSend({ type: "voice", content: "\uD83C\uDFA4 Voice message", file }); } catch (e) { console.error(e); }
        setSending(false);
      };
      mediaRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch (e) { console.error("Mic access denied:", e); }
  }, [onSend]);

  const stopRecording = useCallback(() => {
    if (mediaRef.current && recording) { mediaRef.current.stop(); setRecording(false); }
  }, [recording]);

  const handleFile = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSending(true);
    try {
      const isImg = file.type.startsWith("image/");
      await onSend({ type: "file", content: isImg ? "\uD83D\uDCF7 Photo" : `\uD83D\uDCCE ${file.name}`, file });
    } catch (err) { console.error(err); }
    setSending(false);
    e.target.value = "";
  }, [onSend]);

  const handleCamera = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSending(true);
    try { await onSend({ type: "file", content: "\uD83D\uDCF7 Photo", file }); } catch (err) { console.error(err); }
    setSending(false);
    e.target.value = "";
  }, [onSend]);

  const iconBtn = "w-9 h-9 flex items-center justify-center rounded-lg transition-colors";

  return (
    <div className="border-t border-line bg-surface px-4 py-3 safe-bottom">
      <input ref={fileRef} type="file" accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={handleFile} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCamera} />

      <div className="flex items-end gap-2">
        <div className="flex gap-0.5 pb-0.5">
          <button onClick={() => cameraRef.current?.click()} className={`${iconBtn} text-t3 hover:text-accent`} title="Camera">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
            </svg>
          </button>
          <button onClick={() => fileRef.current?.click()} className={`${iconBtn} text-t3 hover:text-accent`} title="File">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>
          <button onClick={recording ? stopRecording : startRecording}
            className={`${iconBtn} ${recording ? "text-danger rec-pulse" : "text-t3 hover:text-accent"}`} title="Voice">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 flex items-end gap-2">
          <input type="text" value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendText()}
            placeholder={recording ? "Recording\u2026" : "Update\u2026"}
            disabled={recording || sending}
            className="flex-1 bg-dim border border-line rounded-xl px-4 py-2.5 text-sm text-t1 font-body focus:outline-none focus:border-accent placeholder:text-t3 disabled:opacity-50 transition-colors" />
          <button onClick={handleSendText} disabled={!text.trim() || sending}
            className="px-4 py-2.5 bg-t1 text-white text-sm font-semibold font-body rounded-xl disabled:opacity-20 transition-opacity">
            \u2192
          </button>
        </div>
      </div>
    </div>
  );
}
