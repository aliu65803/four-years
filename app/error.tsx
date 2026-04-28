"use client";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="pixel-panel bg-ink/90 p-6 text-parchment">
        <p className="font-display text-xs uppercase leading-relaxed text-gold">Something broke</p>
        <h1 className="mt-4 text-4xl uppercase tracking-[0.12em] sm:text-5xl">The semester hit an unexpected snag</h1>
        <p className="mt-6 text-3xl leading-8 sm:text-4xl sm:leading-10">
          {error.message || "An unexpected app error happened."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="pixel-button mt-6 rounded-none bg-gold px-6 py-4 font-display text-xs uppercase text-ink"
        >
          Try Again
        </button>
      </section>
    </main>
  );
}
