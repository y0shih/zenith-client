import Link from "next/link";
import { Briefcase, Users, Settings, LogOut, Plus, Search, MapPin, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function EmployerDashboard() {
  const jobs = [
    { id: 1, title: "Senior Golang Native Engineer", status: "Active", applicants: 12, posted: "2d ago" },
    { id: 2, title: "Frontend Platform Engineer", status: "Draft", applicants: 0, posted: "-" },
  ];

  const applicants = [
    { id: 101, name: "Alice Chen", role: "Senior Golang Native", status: "submitted", date: "1d ago" },
    { id: 102, name: "Bob Smith", role: "Senior Golang Native", status: "interview", date: "2d ago" },
    { id: 103, name: "Charlie Davis", role: "Frontend Engineer (Closed)", status: "rejected", date: "1w ago" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-primary text-white border-r-4 border-primary md:border-r-0 md:min-h-screen flex flex-col">
        <div className="p-6 border-b-2 border-white/20">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-white">Zenith Base</h2>
          <p className="text-secondary-foreground/80 text-sm mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-chart-1"></span> FluxTech (Employer)
          </p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link href="/dashboard/employer" className="flex items-center gap-3 px-4 py-3 bg-cta/20 text-white font-bold border-l-4 border-cta">
            <Briefcase className="w-5 h-5" /> Jobs
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-white/80 hover:text-white font-medium transition-colors border-l-4 border-transparent">
            <Users className="w-5 h-5" /> Applicants
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

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-heading text-4xl font-bold text-primary">Employer Overview</h1>
            <p className="text-secondary text-lg mt-2">Manage your job postings and review applications.</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-none px-6 !py-6 text-lg gap-2">
                <Plus className="w-5 h-5" /> Post New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] border-2 border-primary rounded-none shadow-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl font-bold text-primary">Create Job Posting</DialogTitle>
                <DialogDescription className="text-base text-secondary">
                  Fill out the details for your new open role at FluxTech.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label className="font-bold text-primary">Job Title</Label>
                  <Input placeholder="e.g. Senior Golang Native Engineer" className="border-2 rounded-none" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label className="font-bold text-primary">Location</Label>
                    <Input placeholder="e.g. Remote, NY, SF" className="border-2 rounded-none" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="font-bold text-primary">Job Type</Label>
                    <select className="border-2 border-border p-2 focus:border-primary focus:outline-none transition-colors rounded-none bg-white font-medium">
                      <option>full_time</option>
                      <option>part_time</option>
                      <option>contract</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label className="font-bold text-primary">Salary Min (USD)</Label>
                    <Input type="number" placeholder="100000" className="border-2 rounded-none" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="font-bold text-primary">Salary Max (USD)</Label>
                    <Input type="number" placeholder="150000" className="border-2 rounded-none" />
                  </div>
                </div>
                <div className="grid gap-2 mt-4">
                  <Label className="font-bold text-primary">Job Description</Label>
                  <textarea rows={6} className="border-2 border-border p-3 focus:border-primary focus:outline-none transition-colors rounded-none placeholder:text-muted-foreground w-full" placeholder="Describe the responsibilities and requirements..."></textarea>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full text-lg rounded-none !py-6">Publish Job</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <Card className="rounded-none border-2 border-primary shadow-[6px_6px_0_0_#0F172A]">
            <CardHeader className="border-b-2 border-border pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-heading text-2xl text-primary">Your Job Postings</CardTitle>
                <CardDescription className="text-base text-secondary mt-1">Manage active and draft roles.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y-2 divide-border">
                {jobs.map(job => (
                  <div key={job.id} className="p-6 hover:bg-accent/20 transition-colors flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-xl font-bold text-primary truncate">{job.title}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`text-xs font-bold uppercase px-2 py-1 border ${job.status === 'Active' ? 'bg-chart-2/10 text-chart-2 border-chart-2' : 'bg-muted text-secondary border-border'}`}>
                          {job.status}
                        </span>
                        <span className="text-sm font-medium text-secondary">{job.applicants} applicants</span>
                        <span className="text-sm font-medium text-muted-foreground">{job.posted}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-none"><MoreHorizontal className="w-5 h-5" /></Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-2 border-primary shadow-[6px_6px_0_0_#0F172A]">
            <CardHeader className="border-b-2 border-border pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-heading text-2xl text-primary">Recent Applications</CardTitle>
                <CardDescription className="text-base text-secondary mt-1">Pipeline of incoming talent.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y-2 divide-border">
                {applicants.map(app => (
                  <div key={app.id} className="p-6 hover:bg-accent/20 transition-colors flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-xl font-bold text-primary truncate">{app.name}</h3>
                      <p className="text-secondary font-medium mt-1">Applied for: {app.role}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <select 
                          className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-white border-2 border-border text-primary outline-none focus:border-primary cursor-pointer"
                          defaultValue={app.status}
                        >
                          <option value="submitted">Submitted</option>
                          <option value="under_review">Under Review</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="interview">Interview</option>
                          <option value="offered">Offered</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <span className="text-sm font-medium text-muted-foreground">{app.date}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="rounded-none border-2">View Profile</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
