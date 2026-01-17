import Link from "next/link";
import { Activity, Brain, TrendingUp, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">SkillXIntell</h1>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="#features" className="hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#sectors" className="hover:text-primary transition-colors">
              Sectors
            </Link>
            <Link href="/login" className="hover:text-primary transition-colors font-medium">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 transition-opacity">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
            Holistic Academic & Professional
            <span className="block text-primary mt-2">Skill Intelligence</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track, analyze, and enhance your skills across Healthcare, Agriculture, and Urban Development sectors with AI-powered insights.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/register">
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Get Started
              </button>
            </Link>
            <Link href="/login">
              <button className="px-8 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition-colors">
                Login
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sectors Section */}
      <section id="sectors" className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Specialized Sectors</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Healthcare */}
          <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-healthcare/10 flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 text-healthcare" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Healthcare Informatics</h4>
            <p className="text-muted-foreground">
              Track skills in EHR systems, medical coding, telemedicine, and healthcare IT infrastructure.
            </p>
          </div>

          {/* Agriculture */}
          <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-agriculture/10 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-agriculture" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Agricultural Technology</h4>
            <p className="text-muted-foreground">
              Master precision agriculture, IoT sensors, crop monitoring, and sustainable farming practices.
            </p>
          </div>

          {/* Urban */}
          <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-urban/10 flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-urban" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Urban & Smart Cities</h4>
            <p className="text-muted-foreground">
              Develop expertise in GIS, smart infrastructure, sustainable urban design, and city planning.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16 bg-muted/50 rounded-2xl my-16">
        <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <h5 className="font-semibold mb-1">Skill Tracking</h5>
            <p className="text-sm text-muted-foreground">Comprehensive skill portfolio management</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🎯</div>
            <h5 className="font-semibold mb-1">Gap Analysis</h5>
            <p className="text-sm text-muted-foreground">Identify and bridge skill gaps</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🤖</div>
            <h5 className="font-semibold mb-1">AI Recommendations</h5>
            <p className="text-sm text-muted-foreground">Personalized learning paths</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <h5 className="font-semibold mb-1">Career Insights</h5>
            <p className="text-sm text-muted-foreground">Industry alignment scoring</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2026 SkillXIntell. Built for better education and career outcomes.</p>
        </div>
      </footer>
    </div>
  );
}
