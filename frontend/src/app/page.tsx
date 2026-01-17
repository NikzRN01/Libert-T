import Link from "next/link";
import { Activity, Brain, TrendingUp, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">SkillXIntell</h1>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="#features" className="text-foreground/70 hover:text-primary transition-colors font-medium">
              Features
            </Link>
            <Link href="#sectors" className="text-foreground/70 hover:text-primary transition-colors font-medium">
              Sectors
            </Link>
            <Link href="/login" className="text-foreground/70 hover:text-primary transition-colors font-medium">
              Login
            </Link>
            <Link href="/register" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-md hover:shadow-lg">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            🚀 AI-Powered Skill Intelligence
          </div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Holistic Academic & Professional
            <span className="block bg-linear-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mt-2">
              Skill Intelligence
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Track, analyze, and enhance your skills across Healthcare, Agriculture, and Urban Development sectors with AI-powered insights.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/register">
              <button className="px-8 py-4 bg-linear-to-r from-primary to-accent text-white rounded-xl font-semibold hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                Get Started Free
              </button>
            </Link>
            <Link href="/login">
              <button className="px-8 py-4 border-2 border-border rounded-xl font-semibold hover:bg-muted transition-all transform hover:-translate-y-0.5">
                Login
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sectors Section */}
      <section id="sectors" className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-foreground">Specialized Sectors</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Healthcare */}
          <div className="p-8 rounded-2xl border-2 border-border bg-card hover:shadow-xl hover:border-primary/50 transition-all transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-xl bg-linear-to-br from-primary to-primary/70 flex items-center justify-center mb-4 shadow-lg">
              <Activity className="h-7 w-7 text-white" />
            </div>
            <h4 className="text-xl font-bold mb-3 text-foreground">Healthcare Informatics</h4>
            <p className="text-muted-foreground leading-relaxed">
              Track skills in EHR systems, medical coding, telemedicine, and healthcare IT infrastructure.
            </p>
          </div>

          {/* Agriculture */}
          <div className="p-8 rounded-2xl border-2 border-border bg-card hover:shadow-xl hover:border-secondary/50 transition-all transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-xl bg-linear-to-br from-secondary to-secondary/70 flex items-center justify-center mb-4 shadow-lg">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <h4 className="text-xl font-bold mb-3 text-foreground">Agricultural Technology</h4>
            <p className="text-muted-foreground leading-relaxed">
              Master precision agriculture, IoT sensors, crop monitoring, and sustainable farming practices.
            </p>
          </div>

          {/* Urban */}
          <div className="p-8 rounded-2xl border-2 border-border bg-card hover:shadow-xl hover:border-accent/50 transition-all transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-xl bg-linear-to-br from-accent to-accent/70 flex items-center justify-center mb-4 shadow-lg">
              <Target className="h-7 w-7 text-white" />
            </div>
            <h4 className="text-xl font-bold mb-3 text-foreground">Urban & Smart Cities</h4>
            <p className="text-muted-foreground leading-relaxed">
              Develop expertise in GIS, smart infrastructure, sustainable urban design, and city planning.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="bg-linear-to-br from-muted to-primary/5 rounded-3xl p-12">
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">Key Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-3">📊</div>
              <h5 className="font-bold mb-2 text-foreground">Skill Tracking</h5>
              <p className="text-sm text-muted-foreground">Comprehensive skill portfolio management</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">🎯</div>
              <h5 className="font-bold mb-2 text-foreground">Gap Analysis</h5>
              <p className="text-sm text-muted-foreground">Identify and bridge skill gaps</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">🤖</div>
              <h5 className="font-bold mb-2 text-foreground">AI Recommendations</h5>
              <p className="text-sm text-muted-foreground">Personalized learning paths</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-3">📈</div>
              <h5 className="font-bold mb-2 text-foreground">Career Insights</h5>
              <p className="text-sm text-muted-foreground">Industry alignment scoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20 bg-card">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2026 SkillXIntell. Built for better education and career outcomes.</p>
        </div>
      </footer>
    </div>
  );
}
