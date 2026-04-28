export function AuthSetupNeeded() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="pixel-panel bg-ink/90 p-6 text-parchment">
        <p className="font-display text-xs uppercase leading-relaxed text-gold">Clerk setup needed</p>
        <h1 className="mt-4 text-4xl uppercase tracking-[0.12em] sm:text-5xl">Add your auth keys</h1>
        <p className="mt-6 text-3xl leading-8 sm:text-4xl sm:leading-10">
          This build is ready for Clerk, but it needs `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in `.env.local` before the auth flow can render.
        </p>
        <p className="mt-6 text-2xl text-parchment/85">
          After that, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, then connect Clerk as a third-party auth provider in the Supabase dashboard.
        </p>
      </section>
    </main>
  );
}
