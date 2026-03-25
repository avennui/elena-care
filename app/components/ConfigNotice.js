"use client";

const REQUIRED_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

export default function ConfigNotice({ error }) {
  return (
    <main className="min-h-screen bg-bg px-5 py-8 text-t1">
      <div className="mx-auto max-w-md pt-16">
        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-accent mb-4">Elena Care</p>
        <h1 className="text-[28px] font-light leading-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
          Supabase needs to be configured before the app can connect.
        </h1>
        <p className="text-[15px] text-t2 mb-8" style={{ lineHeight: "1.5" }}>
          {error || "Add the required public Supabase environment variables and restart the app."}
        </p>

        <div className="border-t border-black/8">
          {REQUIRED_VARS.map((envVar) => (
            <div key={envVar} className="py-4 border-b border-black/8 font-mono text-[13px] text-t2">
              {envVar}
            </div>
          ))}
        </div>

        <p className="text-[13px] text-t3 mt-6" style={{ lineHeight: "1.6" }}>
          Create <span className="font-mono text-t2">.env.local</span> from the example file, add your Supabase URL and anon key, then restart the dev server.
        </p>
      </div>
    </main>
  );
}
