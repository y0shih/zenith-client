import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Briefcase, Zap, ShieldCheck, Sparkles, Code, Globe, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FAF5FF] text-[#1E1B4B] selection:bg-purple-200 selection:text-purple-900 relative overflow-hidden font-sans">
      {/* Vibrant Background Blurs for Glassmorphism */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-300/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-300/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-300/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(124,58,237,0.07)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Hero Section - 2 Column Layout */}
      <section className="relative w-full min-h-[100vh] flex flex-col lg:flex-row">
        
        {/* Left Content Column */}
        <div className="w-full lg:w-1/2 pt-32 pb-16 lg:pt-0 lg:pb-0 px-6 flex flex-col justify-center items-center relative z-10 bg-[#FAF5FF]">
          
          {/* Glassmorphism Blurs constrained to left side */}
          <div className="absolute top-[10%] left-[10%] w-[60%] h-[60%] bg-purple-300/40 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] bg-cyan-300/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-start gap-6 w-full max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-purple-200 shadow-sm text-purple-700 text-sm font-semibold mb-2 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>The Premier Platform for Tech Talent</span>
            </div>

            <h1 className="text-5xl md:text-7xl xl:text-[5.5rem] font-bold leading-[1.05] tracking-tight text-[#1E1B4B]">
              Find the work that
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#06B6D4]">
                moves you.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-700 mt-2 font-medium leading-relaxed">
              Connect directly with top-tier startups and innovative companies. Zero clutter, strict vetting, and a seamless hiring experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
              <Button asChild size="lg" className="w-full sm:w-auto text-base px-8 py-7 rounded-2xl group bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-[0_8px_30px_rgba(124,58,237,0.3)] hover:shadow-[0_8px_30px_rgba(124,58,237,0.5)] transition-all duration-300">
                <Link href="/jobs">
                  Browse Open Roles
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 py-7 rounded-2xl border-purple-200 hover:bg-purple-50 text-[#1E1B4B] bg-white transition-all duration-300 shadow-sm">
                <Link href="/register">
                  Hire Talent
                </Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-slate-700 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
                <span>Dev-focused</span>
              </div>
              <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-400" />
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                <span>Verified Roles</span>
              </div>
              <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-400" />
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-600" />
                <span>Remote First</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Column (Wallpaper) */}
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-auto relative z-0 border-l border-white/20">
          <Image
            src="/wp.jpg"
            alt="Professional background"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Subtle overlay to enhance image contrast if needed */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/20 to-transparent" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative z-10 bg-white/60 backdrop-blur-3xl border-t border-purple-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#1E1B4B] mb-6 tracking-tight">Why choose Zenith?</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">We've rebuilt the hiring process from the ground up to respect your time and skills.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-[2rem] bg-white border border-purple-100 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-6 group-hover:bg-[#7C3AED] transition-colors duration-300">
                <Zap className="w-8 h-8 text-[#7C3AED] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-[#1E1B4B] mb-4">Instant Apply</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                One-click applications using your curated profile. Never fill out another redundant Workday form again.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-[2rem] bg-white border border-purple-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6 group-hover:bg-[#A78BFA] transition-colors duration-300">
                <ShieldCheck className="w-8 h-8 text-[#A78BFA] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-[#1E1B4B] mb-4">Verified Roles</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Every listing is manually vetted. We guarantee no ghost jobs and require transparent salary ranges.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-[2rem] bg-white border border-purple-100 shadow-sm hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-cyan-100 flex items-center justify-center mb-6 group-hover:bg-[#06B6D4] transition-colors duration-300">
                <Briefcase className="w-8 h-8 text-[#06B6D4] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-2xl font-bold text-[#1E1B4B] mb-4">Direct Access</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Bypass the ATS black hole. Connect and message directly with hiring managers and founders.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
