import { Leaderboard } from "@/components/Leaderboard";
import { SubmitResult } from "@/components/SubmitResult";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Grid Pattern Background with Wombats */}
      <div className="absolute inset-0 grid-pattern"></div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/20 blur-[100px] animate-pulse"></div>
      
      <div className="container py-8 space-y-8 relative">
        <header className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center justify-center space-x-2 bg-secondary/50 px-4 py-2 rounded-full mb-4 animate-fade-in">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">2024 Official Workforce Management Performance Olympics</span>
          </div>
          
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-fade-in">
            Performance Leaderboard
          </h1>
          
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Welcome to the official 2024 WORKFORCE WOMBOTS PERFORMANCE HACKATHON!
            Submit your results and compete with your colleagues to create the most efficient solutions.

            Feel free to ask Fianne or Mikkel for any questions related to setup.
          </p>
        </header>

        <div className="grid gap-8 animate-fade-in">
          <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg -m-1 blur"></div>
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