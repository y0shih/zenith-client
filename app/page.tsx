import Link from "next/link";
import { ArrowRight, Briefcase, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      {/* Massive Typographic Hero */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-start gap-6 relative z-10">
            <h1 className="font-heading text-6xl md:text-8xl lg:text-[10rem] font-bold leading-[0.85] tracking-tighter text-primary">
              FIND
              <br />
              <span className="text-cta">WORK.</span>
              <br />
              FASTER.
            </h1>
            
            <p className="max-w-xl text-xl md:text-2xl text-secondary mt-8 font-medium">
              The premier job board for modern tech professionals. Zero clutter, strict vetting, direct access to top-tier startups.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
              <Button asChild size="lg" className="w-full sm:w-auto text-lg px-8 py-6 group">
                <Link href="/jobs">
                  Browse Jobs
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                <Link href="/register">
                  Post a Job
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Decorative Flat Geometries (Anti-Cliché: Sharp & Structural) */}
          <div className="hidden lg:block absolute top-20 right-10 w-96 h-96 bg-cta opacity-10 rotate-12 -z-10"></div>
          <div className="hidden lg:block absolute bottom-10 right-32 w-64 h-64 border-8 border-primary opacity-20 -rotate-6 -z-10"></div>
        </div>
      </section>

      {/* Features Section (Flat Data Presentation) */}
      <section className="py-24 bg-primary text-white px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 border-t-4 border-white pt-16">
          <div className="flex flex-col items-start gap-4">
            <div className="p-4 bg-cta border-2 border-white rounded-none">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-heading text-3xl font-bold">Instant Apply</h3>
            <p className="text-white/80 text-lg">
              One-click applications with your saved profile. Stop filling out endless Workday forms.
            </p>
          </div>
          
          <div className="flex flex-col items-start gap-4">
            <div className="p-4 bg-chart-2 border-2 border-white rounded-none">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-heading text-3xl font-bold">Verified Roles</h3>
            <p className="text-white/80 text-lg">
              Every job is manually vetted. No ghost jobs, no bait-and-switch salary ranges.
            </p>
          </div>
          
          <div className="flex flex-col items-start gap-4">
            <div className="p-4 bg-chart-3 border-2 border-white rounded-none">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-heading text-3xl font-bold">Direct Access</h3>
            <p className="text-white/80 text-lg">
              Message the hiring manager directly on select roles. Bypass the ATS black hole.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
