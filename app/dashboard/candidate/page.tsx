import Link from "next/link";
import { User, Briefcase, Settings, LogOut, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CandidateDashboard() {
  const applications = [
    { id: 1, role: "Senior Golang Native", company: "FluxTech", status: "interview", date: "2026-03-20" },
    { id: 2, role: "Backend Engineer", company: "Neon", status: "rejected", date: "2026-03-15" },
    { id: 3, role: "Go Developer", company: "Vercel", status: "under_review", date: "2026-03-24" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-primary text-white border-r-4 border-primary md:border-r-0 md:min-h-screen flex flex-col">
        <div className="p-6 border-b-2 border-white/20">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-white">Zenith Base</h2>
          <p className="text-secondary-foreground/80 text-sm mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-chart-2"></span> Candidate
          </p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link href="/dashboard/candidate" className="flex items-center gap-3 px-4 py-3 bg-cta/20 text-white font-bold border-l-4 border-cta">
            <User className="w-5 h-5" /> Profile
          </Link>
          <Link href="/jobs" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-white/80 hover:text-white font-medium transition-colors border-l-4 border-transparent">
            <Briefcase className="w-5 h-5" /> Job Board
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-white/80 hover:text-white font-medium transition-colors border-l-4 border-transparent">
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </nav>
        <div className="p-4 border-t-2 border-white/20">
          <button className="flex w-full items-center gap-3 px-4 py-3 hover:bg-destructive/20 text-white/80 hover:text-white font-medium transition-colors border-l-4 border-transparent">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="font-heading text-4xl font-bold text-primary">Candidate Profile</h1>
          <p className="text-secondary text-lg mt-2">Manage your professional identity and track applications.</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2 space-y-8">
            <Card className="rounded-none border-2 border-primary shadow-[6px_6px_0_0_#0F172A]">
              <CardHeader className="border-b-2 border-border pb-6">
                <CardTitle className="font-heading text-2xl text-primary">Profile Info</CardTitle>
                <CardDescription className="text-base text-secondary">Visible to employers when you apply.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold text-primary">Headline</Label>
                    <Input defaultValue="Backend Engineer" className="border-2 rounded-none !py-6 text-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-primary">Location</Label>
                    <Input defaultValue="New York" className="border-2 rounded-none !py-6 text-lg" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="font-bold text-primary">Bio</Label>
                  <textarea 
                    rows={4} 
                    defaultValue="5 years of Go experience building high-throughput microservices."
                    className="w-full border-2 border-border p-4 focus:border-primary focus:outline-none transition-colors rounded-none placeholder:text-muted-foreground text-lg"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <Label className="font-bold text-primary">Skills (Comma separated)</Label>
                  <Input defaultValue="Golang, PostgreSQL, Docker, Redis" className="border-2 rounded-none !py-6 text-lg" />
                </div>

                <div className="space-y-2">
                  <Label className="font-bold text-primary">Job Search Status</Label>
                  <select className="w-full border-2 border-border p-4 focus:border-primary focus:outline-none transition-colors rounded-none text-lg cursor-pointer bg-white text-primary appearance-none">
                    <option value="looking_for_work">Looking for work</option>
                    <option value="closed">Not looking</option>
                  </select>
                </div>

                <Button className="w-full md:w-auto text-lg px-8 !py-6 rounded-none">Save Changes</Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="rounded-none border-2 border-border">
              <CardHeader className="border-b-2 border-border pb-4 bg-accent/20">
                <CardTitle className="font-heading text-xl text-primary">Application Track</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {applications.map((app) => (
                  <div key={app.id} className="p-4 border-b-2 border-border last:border-0 hover:bg-accent/40 transition-colors cursor-pointer group flex items-start gap-4">
                    <div className="mt-1">
                      {app.status === 'interview' && <CheckCircle2 className="w-6 h-6 text-chart-2" />}
                      {app.status === 'rejected' && <XCircle className="w-6 h-6 text-destructive" />}
                      {app.status === 'under_review' && <div className="w-6 h-6 rounded-full border-4 border-chart-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-primary text-lg leading-tight group-hover:text-cta truncate">{app.role}</h4>
                      <p className="text-secondary font-medium mt-1">{app.company}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-border/50 text-secondary">
                          {app.status.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-muted-foreground font-medium">{app.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-4 text-center border-t-2 border-border bg-accent/10">
                  <button className="text-sm font-bold text-cta hover:underline inline-flex items-center gap-1">
                    View All Activity <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
