export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="w-full max-w-2xl px-8 py-24 sm:px-12">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Gary Johnson
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Welcome to my corner of the internet.
        </p>
        <p className="mt-8 max-w-prose leading-7 text-zinc-700 dark:text-zinc-300">
          This is a placeholder homepage — replace this paragraph with a short
          intro about who you are, what you work on, and what you&apos;re into.
        </p>
        <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
          <li>
            <a
              href="https://github.com/jazzbassjohnson"
              className="text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href="mailto:jazzbassjohnson@gmail.com"
              className="text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
            >
              Email
            </a>
          </li>
        </ul>
      </main>
    </div>
  );
}
