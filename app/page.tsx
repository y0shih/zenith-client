import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, ShieldCheck, CheckCircle2, MessageSquare, MessageCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomeGlobe } from "@/components/home-globe";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF9] text-[#0C0A09] selection:bg-stone-200 selection:text-stone-900 font-sans">
      
      {/* Subtle Dot Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-30" />

      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-24 lg:pt-40 lg:pb-32 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="xl:col-span-7 flex flex-col items-start gap-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-200 text-stone-600 text-xs font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                The Social Job Platform
              </div>

              <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight text-[#0C0A09]">
                Recruitment, <span className="text-stone-400 font-serif italic">now</span>
                <br />
                social.
              </h1>

              <p className="text-lg sm:text-xl text-stone-500 font-medium leading-relaxed max-w-xl">
                A hybrid platform where job descriptions are interactive discussions. Ask questions, engage directly, and track your applications in real-time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
                <Button asChild size="lg" className="h-14 px-8 bg-[#0C0A09] hover:bg-stone-800 text-white rounded-none text-base font-semibold shadow-none transition-transform hover:-translate-y-0.5">
                  <Link href="/jobs">
                    Browse Open Roles
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-none border-stone-300 bg-transparent text-[#0C0A09] hover:bg-stone-100 hover:text-stone-900 text-base font-semibold shadow-none transition-transform hover:-translate-y-0.5">
                  <Link href="/register">
                    Hire Talent
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-6 mt-6 text-sm font-semibold text-stone-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0C0A09]" />
                  <span>Interactive JDs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0C0A09]" />
                  <span>Direct Chat</span>
                </div>
              </div>
            </div>

            {/* Right Globe */}
            <div className="xl:col-span-5 w-full h-[400px] lg:h-[500px] relative">
              <div className="absolute inset-0 z-10 w-full h-full flex items-center justify-center">
                 <HomeGlobe />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative z-10 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-[#0C0A09] mb-4 tracking-tight">Built for transparency.</h2>
              <p className="text-stone-500 text-lg font-medium">We've transformed static job boards into dynamic, secure communities.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-8 bg-[#FAFAF9] border border-stone-200 group hover:border-stone-400 transition-colors">
              <div className="w-12 h-12 bg-white border border-stone-200 flex items-center justify-center mb-8">
                <MessageSquare className="w-5 h-5 text-stone-900" />
              </div>
              <h3 className="text-xl font-bold text-[#0C0A09] mb-3">Interactive JDs</h3>
              <p className="text-stone-500 font-medium leading-relaxed text-sm">
                Job postings aren't just text. They are social objects where you can comment, ask questions, and get official replies from employers before applying.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-[#FAFAF9] border border-stone-200 group hover:border-stone-400 transition-colors">
              <div className="w-12 h-12 bg-white border border-stone-200 flex items-center justify-center mb-8">
                <MessageCircle className="w-5 h-5 text-stone-900" />
              </div>
              <h3 className="text-xl font-bold text-[#0C0A09] mb-3">Direct Private Chat</h3>
              <p className="text-stone-500 font-medium leading-relaxed text-sm">
                Once an application is submitted, unlock a dedicated 1-on-1 chat channel with the employer to discuss next steps instantly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-[#FAFAF9] border border-stone-200 group hover:border-stone-400 transition-colors">
              <div className="w-12 h-12 bg-white border border-stone-200 flex items-center justify-center mb-8">
                <Shield className="w-5 h-5 text-stone-900" />
              </div>
              <h3 className="text-xl font-bold text-[#0C0A09] mb-3">Tenant Isolation</h3>
              <p className="text-stone-500 font-medium leading-relaxed text-sm">
                While jobs are globally visible, all operational data—applications, chats, and internal statistics—is securely isolated per organization.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
