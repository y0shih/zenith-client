'use client'

import Link from "next/link";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 0.03,
    scale: 1,
    transition: {
      duration: 2,
      ease: "easeOut",
    },
  },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6 selection:bg-primary selection:text-white overflow-hidden relative">
      {/* Massive Typographic Hero Background */}
      <motion.div 
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span className="font-heading text-[25vw] font-black tracking-tighter uppercase whitespace-nowrap leading-none">
          Zenith Apex
        </span>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[480px] z-10"
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
          {/* Subtle accent border at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-cta" />

          <motion.div variants={itemVariants} className="mb-10 text-center">
            <h1 className="font-heading text-4xl font-bold text-primary tracking-tight mb-3">
              Welcome back
            </h1>
            <p className="text-secondary font-medium">
              Join the apex of recruitment technology.
            </p>
          </motion.div>

          <form className="space-y-8">
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="email" className="font-bold text-xs uppercase tracking-widest text-secondary/70">
                Email Address
              </Label>
              <div className="relative">
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@zenith.com" 
                  className="bg-transparent border-0 border-b-2 border-muted rounded-none px-0 py-6 text-lg focus-visible:ring-0 focus-visible:border-cta transition-colors placeholder:text-muted-foreground/30"
                />
                <Mail className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-bold text-xs uppercase tracking-widest text-secondary/70">
                  Secure Password
                </Label>
                <Link href="/auth/forgot" className="text-xs font-bold text-cta hover:text-cta/80 transition-colors uppercase tracking-wider">
                  Reset
                </Link>
              </div>
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
                Access Account
              </Button>
            </motion.div>
          </form>

          <motion.p variants={itemVariants} className="mt-10 text-center text-sm text-secondary font-medium border-t border-muted pt-8">
            Don't have an account?{" "}
            <Link href="/register" className="font-bold text-cta hover:underline underline-offset-4">
              Create one
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </main>
  );
}
