'use client'

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, Building2, Mail, Lock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const heroVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 0.03,
    scale: 1,
    transition: {
      duration: 2,
      ease: "easeOut",
    },
  },
};

export default function RegisterPage() {
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate');

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6 py-12 selection:bg-primary selection:text-white overflow-hidden relative">
      {/* Massive Typographic Hero Background */}
      <motion.div 
        variants={heroVariants}
        initial="initial"
        animate="animate"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span className="font-heading text-[25vw] font-black tracking-tighter uppercase whitespace-nowrap leading-none">
          Network Apex
        </span>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[540px] z-10"
      >
        {/* Back Link */}
        <motion.div variants={itemVariants} className="mb-8">
          <Link href="/" className="group inline-flex items-center gap-2 text-secondary hover:text-primary font-bold transition-all duration-300">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            <span className="text-sm tracking-widest uppercase">Return Home</span>
          </Link>
        </motion.div>

        {/* Content Card (Flat Design) */}
        <div className="bg-card border border-border p-8 md:p-12 relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-cta" />

          <motion.div variants={itemVariants} className="mb-10 text-center">
            <h1 className="font-heading text-4xl font-bold text-primary tracking-tight mb-3">
              Join the Network
            </h1>
            <p className="text-secondary font-medium">
              Start your journey at the apex of modern recruitment.
            </p>
          </motion.div>

          {/* Role Selection Toggle */}
          <motion.div variants={itemVariants} className="mb-10">
            <div className="grid grid-cols-2 gap-2 bg-muted p-1 border border-border">
              <button
                type="button"
                onClick={() => setRole('candidate')}
                className={`flex items-center justify-center gap-2 py-3 px-4 transition-all duration-300 ${
                  role === 'candidate' 
                    ? 'bg-card text-primary font-bold border border-border' 
                    : 'text-secondary font-medium hover:text-primary'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest">Candidate</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('employer')}
                className={`flex items-center justify-center gap-2 py-3 px-4 transition-all duration-300 ${
                  role === 'employer' 
                    ? 'bg-card text-primary font-bold border border-border' 
                    : 'text-secondary font-medium hover:text-primary'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="text-xs uppercase tracking-widest">Employer</span>
              </button>
            </div>
          </motion.div>

          <form className="space-y-8">
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="fullname" className="font-bold text-xs uppercase tracking-widest text-secondary/70">
                Full Name
              </Label>
              <Input 
                id="fullname" 
                placeholder={role === 'candidate' ? "John Doe" : "Jane Smith"} 
                className="bg-transparent border-0 border-b-2 border-muted rounded-none px-0 py-6 text-lg focus-visible:ring-0 focus-visible:border-cta transition-colors placeholder:text-muted-foreground/30"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="email" className="font-bold text-xs uppercase tracking-widest text-secondary/70">
                Email Address
              </Label>
              <div className="relative">
                <Input 
                  id="email" 
                  type="email" 
                  placeholder={role === 'candidate' ? "you@example.com" : "jane@company.com"} 
                  className="bg-transparent border-0 border-b-2 border-muted rounded-none px-0 py-6 text-lg focus-visible:ring-0 focus-visible:border-cta transition-colors placeholder:text-muted-foreground/30"
                />
                <Mail className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {role === 'employer' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label htmlFor="tenant" className="font-bold text-xs uppercase tracking-widest text-secondary/70">
                    Tenant ID
                  </Label>
                  <Input 
                    id="tenant" 
                    placeholder="e.g. acme-corp-123" 
                    className="bg-transparent border-0 border-b-2 border-muted rounded-none px-0 py-6 text-lg focus-visible:ring-0 focus-visible:border-cta transition-colors placeholder:text-muted-foreground/30"
                  />
                  <p className="text-[10px] uppercase font-bold text-secondary/50 tracking-tighter">Must be pre-assigned by Administrator</p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="password" className="font-bold text-xs uppercase tracking-widest text-secondary/70">
                Create Password
              </Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="bg-transparent border-0 border-b-2 border-muted rounded-none px-0 py-6 text-lg focus-visible:ring-0 focus-visible:border-cta transition-colors placeholder:text-muted-foreground/30"
                />
                <Lock className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button 
                type="button" 
                size="lg" 
                className="w-full h-14 text-sm uppercase tracking-[0.2em] font-bold rounded-none bg-primary text-primary-foreground hover:bg-cta transition-all duration-300 shadow-sm"
              >
                Create Account
              </Button>
            </motion.div>
          </form>

          <motion.p variants={itemVariants} className="mt-10 text-center text-sm text-secondary font-medium border-t border-muted pt-8">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-cta hover:underline underline-offset-4">
              Return to Login
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </main>
  );
}
