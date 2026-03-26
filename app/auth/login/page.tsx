import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 selection:bg-primary selection:text-white">
      <div className="w-full max-w-[400px] mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-secondary hover:text-primary font-bold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
      </div>

      <Card className="w-full max-w-[400px] border-4 border-primary rounded-none shadow-[8px_8px_0_0_#0F172A]">
        <CardHeader className="text-center pb-8 pt-8 border-b-2 border-border">
          <CardTitle className="font-heading text-3xl font-bold text-primary">Welcome Back</CardTitle>
          <CardDescription className="text-base text-secondary pt-2">
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 pb-6">
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold text-primary text-base">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                className="border-2 rounded-none !py-6 text-lg"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-bold text-primary text-base">Password</Label>
                <Link href="/auth/forgot" className="text-sm font-bold text-cta hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="border-2 rounded-none !py-6 text-lg"
              />
            </div>

            <Button type="button" size="lg" className="w-full text-lg !py-6 rounded-none mt-4">
              Log In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t-2 border-border pt-6 pb-8">
          <p className="text-secondary font-medium">
            Don't have an account?{" "}
            <Link href="/auth/register" className="font-bold text-cta hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
