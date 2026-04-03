import Link from "next/link";
import { ShieldCheck, Plus, LogOut, Settings, Hash, MoreHorizontal, Briefcase, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AdminDashboard() {
  const tenants = [
    { id: "uuid-flux-123", name: "FluxTech", slug: "fluxtech", users: 4, jobs: 12 },
    { id: "uuid-vercel-456", name: "Vercel", slug: "vercel", users: 15, jobs: 42 },
    { id: "uuid-neon-789", name: "Neon", slug: "neon", users: 8, jobs: 3 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-primary text-white border-r-4 border-primary md:border-r-0 md:min-h-screen flex flex-col">
        <div className="p-6 border-b-2 border-white/20">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-chart-4" /> System Admin
          </h2>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link href="/dashboard/admin" className="flex items-center gap-3 px-4 py-3 bg-cta/20 text-white font-bold border-l-4 border-cta">
            <Hash className="w-5 h-5" /> Tenants
          </Link>
          <Link href="/dashboard/admin/jobs" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-white/80 hover:text-white font-medium transition-colors border-l-4 border-transparent">
            <Briefcase className="w-5 h-5" /> Job Approval
          </Link>
          <Link href="/dashboard/admin/moderation" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-white/80 hover:text-white font-medium transition-colors border-l-4 border-transparent">
            <Settings className="w-5 h-5" /> Moderation
          </Link>
          <Link href="/dashboard/admin/analytics" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-white/80 hover:text-white font-medium transition-colors border-l-4 border-transparent">
            <BarChart3 className="w-5 h-5" /> Global Stats
          </Link>
        </nav>
        <div className="p-4 border-t-2 border-white/20">
          <button className="flex w-full items-center gap-3 px-4 py-3 hover:bg-destructive/20 text-white/80 hover:text-white font-medium transition-colors border-l-4 border-transparent">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-heading text-4xl font-bold text-primary">Tenant Management</h1>
            <p className="text-secondary text-lg mt-2">Create and monitor isolated employer workspaces.</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-none px-6 !py-6 text-lg gap-2">
                <Plus className="w-5 h-5" /> Create Tenant
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-2 border-primary rounded-none shadow-xl">
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl font-bold text-primary">New Employer Tenant</DialogTitle>
                <DialogDescription className="text-base text-secondary">
                  Provision a new sandbox for a company to post jobs.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label className="font-bold text-primary">Company Name</Label>
                  <Input placeholder="e.g. Acme Corp" className="border-2 rounded-none" />
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold text-primary">Tenant Slug</Label>
                  <Input placeholder="e.g. acme-corp" className="border-2 rounded-none" />
                  <p className="text-sm font-medium text-muted-foreground">Used for URL isolation and internal reference.</p>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full text-lg rounded-none !py-6">Provision Tenant</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        <Card className="rounded-none border-2 border-primary shadow-[6px_6px_0_0_#0F172A]">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-accent/20 border-b-2 border-border font-heading font-bold text-primary">
                  <tr>
                    <th className="p-4 pl-6">Tenant Name</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">UUID</th>
                    <th className="p-4">Users</th>
                    <th className="p-4">Jobs</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-border">
                  {tenants.map((t) => (
                    <tr key={t.id} className="hover:bg-accent/10 transition-colors">
                      <td className="p-4 pl-6 font-bold text-primary text-lg">{t.name}</td>
                      <td className="p-4 text-secondary font-medium"><span className="bg-border/50 px-2 py-1 text-sm">{t.slug}</span></td>
                      <td className="p-4 font-mono text-sm text-muted-foreground">{t.id}</td>
                      <td className="p-4 font-medium text-secondary">{t.users}</td>
                      <td className="p-4 font-medium text-secondary">{t.jobs}</td>
                      <td className="p-4 pr-6 text-right">
                        <Button variant="ghost" size="icon" className="rounded-none hover:bg-border"><MoreHorizontal className="w-5 h-5 text-primary"/></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
