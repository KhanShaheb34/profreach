"use client";

import { Button } from "@/components/ui/button";
import { setIsAuthenticated } from "@/lib/storage";
import { ArrowRight, FlaskConical, LineChart, MessageSquareText, Sparkles } from "lucide-react";

const highlights = [
  {
    title: "Research-Matched Outreach",
    description: "Track faculty, map overlap, and keep every conversation context-rich.",
    icon: FlaskConical,
  },
  {
    title: "Drafts That Sound Human",
    description: "Generate first-pass emails grounded in your profile and each professor's work.",
    icon: MessageSquareText,
  },
  {
    title: "Pipeline Clarity",
    description: "Move from guesswork to a clear, measurable outreach strategy.",
    icon: LineChart,
  },
];

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#faf6ef_0%,#f8f0e4_45%,#f3e7d7_100%)] text-[#2d1b0f]">
      <div className="landing-orb landing-orb-a" />
      <div className="landing-orb landing-orb-b" />
      <div className="landing-grid" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="landing-fade-up flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm tracking-[0.14em] text-[#6f4a2e] uppercase">
            <Sparkles className="h-4 w-4" />
            Profreach
          </div>
          <span className="rounded-full border border-[#cda77f] bg-white/70 px-3 py-1 text-xs font-medium text-[#7b5333] backdrop-blur-sm">
            Mock Auth Mode
          </span>
        </header>

        <main className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="space-y-6">
            <p className="landing-fade-up landing-delay-1 inline-flex items-center gap-2 rounded-full border border-[#d2b08d] bg-white/65 px-3 py-1 text-xs font-medium text-[#7f5737]">
              Application Season, But Structured
            </p>

            <h1 className="landing-fade-up landing-delay-2 max-w-xl font-serif text-4xl leading-[1.08] tracking-tight text-[#2f190a] sm:text-5xl lg:text-6xl">
              Turn Professor Outreach Into a Deliberate System.
            </h1>

            <p className="landing-fade-up landing-delay-3 max-w-xl text-base leading-relaxed text-[#5a3921] sm:text-lg">
              Profreach helps you research faster, write better emails, and keep every interaction tied to your grad school strategy.
            </p>

            <div className="landing-fade-up landing-delay-4 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="h-11 rounded-full bg-[#7a3f1f] px-6 text-white shadow-[0_8px_24px_rgba(122,63,31,0.28)] transition hover:bg-[#663418]"
                onClick={() => setIsAuthenticated(true)}
              >
                Mock Sign In
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <span className="text-sm text-[#70492d]">
                Clerk will replace this flow later.
              </span>
            </div>
          </section>

          <section className="landing-fade-up landing-delay-5 rounded-3xl border border-[#d4b596] bg-white/72 p-5 shadow-[0_20px_50px_rgba(76,44,24,0.16)] backdrop-blur-md sm:p-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="Tracked" value="120+" />
              <Stat label="Drafts" value="340+" />
              <Stat label="Response Rate" value="31%" />
            </div>

            <div className="mt-5 space-y-3">
              {highlights.map((item, index) => (
                <article
                  key={item.title}
                  className="landing-fade-up rounded-2xl border border-[#eddac5] bg-[#fff9f2] p-4"
                  style={{ animationDelay: `${420 + index * 120}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <item.icon className="mt-0.5 h-4 w-4 text-[#7b4829]" />
                    <div>
                      <h3 className="text-sm font-semibold text-[#3e240f]">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-[#664027]">{item.description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#e8cfb3] bg-white/90 p-3 text-center">
      <p className="text-xl font-semibold text-[#3f230d]">{value}</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-[#8a613f]">{label}</p>
    </div>
  );
}
