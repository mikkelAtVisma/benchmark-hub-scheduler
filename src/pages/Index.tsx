const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Scheduling Algorithm Benchmark</h1>
          <p className="text-lg text-foreground/80">Upload your results and compete in our hackathon!</p>
        </header>

        <div className="grid gap-8">
          <section>
            <Leaderboard />
          </section>

          <section className="max-w-md mx-auto">
            <SubmitResult />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;