import Link from "next/link";
import { ArrowRight, Building2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const dashboards = [
  {
    href: "/dashboard/employer",
    title: "Employer Dashboard",
    description: "Jobs, tenant applications, comment moderation, notifications, and analytics.",
    icon: Building2,
  },
  {
    href: "/dashboard/admin",
    title: "Admin Dashboard",
    description: "Tenant management, job approval, moderation, and global reporting.",
    icon: ShieldCheck,
  },
];

export default function DashboardIndexPage() {
  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-secondary">Dashboard Hub</p>
          <h1 className="font-heading text-5xl font-bold text-primary mt-3">Choose a workspace</h1>
          <p className="text-lg text-secondary mt-4 max-w-3xl">
            The app currently exposes role-specific dashboards. Use one of these routes until auth-based dashboard routing is wired.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {dashboards.map(({ href, title, description, icon: Icon }) => (
            <Card key={href} className="rounded-none border-2 border-primary shadow-[6px_6px_0_0_#0F172A]">
              <CardHeader className="border-b-2 border-border">
                <div className="w-12 h-12 border-2 border-primary flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-heading text-2xl text-primary">{title}</CardTitle>
                <CardDescription className="text-base text-secondary">{description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Button asChild className="w-full rounded-none gap-2">
                  <Link href={href}>
                    Open
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-sm text-secondary">
          Candidate workspace now lives directly under `/profile`, while dashboard routes are reserved for employer and admin tools.
        </div>
      </div>
    </main>
  );
}
