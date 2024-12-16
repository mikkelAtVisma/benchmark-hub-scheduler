import { Leaderboard } from "@/components/Leaderboard";
import { SubmitResult } from "@/components/SubmitResult";

const Index = () => {
  return (
    <div className="min-h-screen bg-background grid-pattern">
      <div className="container py-8 space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Scheduling Algorithm Benchmark</h1>
          <p className="text-lg text-foreground/80">Upload your results and compete in our hackathon!</p>
        </header>

        <div className="grid md:grid-cols-[1fr_400px] gap-8">
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Leaderboard</h2>
            <Leaderboard />
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Submit Result</h2>
            <SubmitResult />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;