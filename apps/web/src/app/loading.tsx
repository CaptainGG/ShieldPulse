export default function Loading() {
  return (
    <main className="grid-shell min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="panel rounded-card animate-pulse p-8">
          <div className="h-4 w-32 rounded-full bg-white/10" />
          <div className="mt-6 h-24 max-w-4xl rounded-[24px] bg-white/10" />
          <div className="mt-6 h-8 max-w-2xl rounded-full bg-white/10" />
        </section>
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="panel rounded-card animate-pulse p-5">
              <div className="h-4 w-32 rounded-full bg-white/10" />
              <div className="mt-4 h-10 w-28 rounded-[18px] bg-white/10" />
              <div className="mt-4 h-14 rounded-[18px] bg-white/10" />
            </div>
          ))}
        </section>
        {[0, 1, 2, 3].map((item) => (
          <section key={item} className="panel rounded-card animate-pulse p-8">
            <div className="h-4 w-28 rounded-full bg-white/10" />
            <div className="mt-4 h-14 w-4/5 rounded-[20px] bg-white/10" />
            <div className="mt-6 space-y-3">
              <div className="h-28 rounded-[24px] bg-white/10" />
              <div className="h-28 rounded-[24px] bg-white/10" />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
