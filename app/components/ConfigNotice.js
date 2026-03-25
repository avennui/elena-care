"use client";

const REQUIRED_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

export default function ConfigNotice({ error }) {
  return (
    <main className="min-h-screen bg-bg px-5 py-8 text-t1">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center">
        <section className="w-full rounded-3xl border border-line bg-surface p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Elena Care
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight">
            Supabase needs to be configured before the app can connect.
          </h1>
          <p className="mt-3 text-base leading-7 text-t2">
            {error || "Add the required public Supabase environment variables and restart the app."}
          </p>

          <div className="mt-6 space-y-3 rounded-2xl border border-line bg-bg/70 p-4">
            {REQUIRED_VARS.map((envVar) => (
              <div key={envVar} className="rounded-xl border border-line/80 bg-bg px-3 py-3 font-mono text-sm text-t1">
                {envVar}
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm leading-6 text-t3">
            Create <span className="font-mono text-t2">.env.local</span> from the example file, add your Supabase URL and anon key, then restart the dev server.
          </p>
        </section>
      </div>
    </main>
  );
}
