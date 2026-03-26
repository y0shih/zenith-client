import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 py-12 selection:bg-primary selection:text-white">
      <div className="w-full max-w-[500px] mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-secondary hover:text-primary font-bold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
      </div>

      <Card className="w-full max-w-[500px] border-4 border-primary rounded-none shadow-[8px_8px_0_0_#0F172A]">
        <CardHeader className="text-center pb-8 pt-8 border-b-2 border-border">
          <CardTitle className="font-heading text-3xl font-bold text-primary">Create an Account</CardTitle>
          <CardDescription className="text-base text-secondary pt-2">
            Join the premier network of modern tech professionals.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-8 pb-6">
          <Tabs defaultValue="candidate" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-none p-1 bg-border/50 mb-8">
              <TabsTrigger value="candidate" className="rounded-none font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Candidate</TabsTrigger>
              <TabsTrigger value="employer" className="rounded-none font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Employer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="candidate">
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="c-name" className="font-bold text-primary text-base">Full Name</Label>
                  <Input id="c-name" placeholder="John Doe" className="border-2 rounded-none !py-6 text-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-email" className="font-bold text-primary text-base">Email Address</Label>
                  <Input id="c-email" type="email" placeholder="you@example.com" className="border-2 rounded-none !py-6 text-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-password" className="font-bold text-primary text-base">Password</Label>
                  <Input id="c-password" type="password" placeholder="••••••••" className="border-2 rounded-none !py-6 text-lg" />
                </div>
                <Button type="button" size="lg" className="w-full text-lg !py-6 rounded-none mt-4">
                  Create Candidate Account
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="employer">
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="e-name" className="font-bold text-primary text-base">Your Full Name</Label>
                  <Input id="e-name" placeholder="Jane Doe" className="border-2 rounded-none !py-6 text-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="e-email" className="font-bold text-primary text-base">Work Email</Label>
                  <Input id="e-email" type="email" placeholder="jane@company.com" className="border-2 rounded-none !py-6 text-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="e-tenant" className="font-bold text-primary text-base">Company Tenant ID</Label>
                  <Input id="e-tenant" placeholder="e.g. acme-corp-123" className="border-2 rounded-none !py-6 text-lg" />
                  <p className="text-sm text-secondary font-medium">Must be assigned by System Admin before registration.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="e-password" className="font-bold text-primary text-base">Password</Label>
                  <Input id="e-password" type="password" placeholder="••••••••" className="border-2 rounded-none !py-6 text-lg" />
                </div>
                <Button type="button" size="lg" className="w-full text-lg !py-6 rounded-none mt-4">
                  Create Employer Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="justify-center border-t-2 border-border pt-6 pb-8">
          <p className="text-secondary font-medium">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-bold text-cta hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
