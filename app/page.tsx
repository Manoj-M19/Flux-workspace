export default function HomePage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-6xl font-light tracking-tight mb-6">
          Flux
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          A minimalist workspace for modern teams
        </p>
        <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full">
          Get started
        </button>
      </div>
    </main>
  );
}

