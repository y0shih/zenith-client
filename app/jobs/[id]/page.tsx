"use client";

import Link from "next/link";
import { ArrowLeft, Building, MapPin, Clock, DollarSign, Send, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function JobDetailsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      {/* Header / Breadcrumb */}
      <div className="bg-primary text-white pt-24 pb-8 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/jobs" className="inline-flex items-center gap-2 text-cta hover:text-white transition-colors mb-6 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Senior Golang Native Engineer</h1>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-white/80 font-medium">
                <span className="flex items-center gap-2"><Building className="w-5 h-5" /> FluxTech</span>
                <span className="flex items-center gap-2"><MapPin className="w-5 h-5" /> Remote</span>
                <span className="flex items-center gap-2"><Clock className="w-5 h-5" /> Full-Time</span>
                <span className="flex items-center gap-2 text-chart-2 font-bold"><DollarSign className="w-5 h-5" /> $120k - $160k</span>
              </div>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full md:w-auto px-8 !py-6 text-lg border-2 border-transparent hover:border-white">
                  Apply Now
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] border-2 border-primary rounded-none shadow-xl">
                <DialogHeader>
                  <DialogTitle className="font-heading text-2xl font-bold text-primary">Apply for this role</DialogTitle>
                  <DialogDescription className="text-base text-secondary">
                    Submit your application for Senior Golang Native Engineer at FluxTech.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="resume" className="font-bold text-primary">Resume Link</Label>
                    <Input id="resume" placeholder="https://your-portfolio.com/resume.pdf" className="border-2 focus-visible:ring-0 focus-visible:border-primary rounded-none" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cover-letter" className="font-bold text-primary">Cover Letter (Optional)</Label>
                    <textarea 
                      id="cover-letter" 
                      rows={4} 
                      className="border-2 border-border p-3 focus:border-primary focus:outline-none transition-colors rounded-none placeholder:text-muted-foreground w-full"
                      placeholder="Why are you a great fit for this role?"
                    ></textarea>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full text-lg rounded-none !py-6">Submit Application</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          {/* Job Description */}
          <section>
            <h2 className="font-heading text-2xl font-bold text-primary mb-4 border-b-2 border-border pb-2">About the Role</h2>
            <div className="prose prose-slate max-w-none text-secondary">
              <p className="text-lg">
                We are looking for a highly skilled Go developer to join our core infrastructure team. You will be responsible for building high-throughput, low-latency microservices that handle millions of requests per minute.
              </p>
              <br/>
              <strong className="text-primary block mb-2">Key Responsibilities:</strong>
              <ul className="list-none space-y-2 pl-0">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-chart-2 shrink-0 mt-0.5" /> Design and implement scalable backend services using Go.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-chart-2 shrink-0 mt-0.5" /> Optimize query performance in PostgreSQL and Redis.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-chart-2 shrink-0 mt-0.5" /> Participate in system architecture design and code reviews.</li>
              </ul>
              <br/>
              <strong className="text-primary block mb-2">Requirements:</strong>
              <ul className="list-none space-y-2 pl-0">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-chart-1 shrink-0 mt-0.5" /> 5+ years of software engineering experience.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-chart-1 shrink-0 mt-0.5" /> Minimum 3 years of production experience with Go.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-chart-1 shrink-0 mt-0.5" /> Deep understanding of concurrency in Go (goroutines, channels).</li>
              </ul>
            </div>
          </section>

          {/* Comments Section */}
          <section className="mt-16 pt-8 border-t-4 border-primary">
            <h2 className="font-heading text-2xl font-bold text-primary mb-6">Discussion & Q&A</h2>
            
            <Card className="border-2 border-border rounded-none shadow-none mb-8">
              <CardContent className="p-4 flex gap-4">
                <div className="w-10 h-10 bg-accent flex items-center justify-center font-bold text-primary shrink-0 rounded-none border border-border">You</div>
                <div className="flex-1 flex flex-col items-end gap-3">
                  <textarea 
                    className="w-full border-2 border-border p-3 focus:border-primary focus:outline-none transition-colors rounded-none placeholder:text-muted-foreground"
                    rows={2}
                    placeholder="Ask a question about this role..."
                  ></textarea>
                  <Button className="rounded-none gap-2 px-6"><Send className="w-4 h-4"/> Post Comment</Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {/* Thread 1 */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-secondary flex items-center justify-center font-bold text-white shrink-0 rounded-none">JD</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-bold text-primary text-lg">Jane Doe</span>
                      <span className="text-sm text-muted-foreground">2 days ago</span>
                    </div>
                    <p className="text-secondary text-lg">Does this role require international travel, or is it strictly 100% remote?</p>
                    <button className="text-sm font-bold text-cta hover:underline mt-2">Reply</button>
                  </div>
                </div>
                
                {/* Reply */}
                <div className="flex gap-4 pl-14">
                  <div className="w-8 h-8 bg-chart-1 flex items-center justify-center font-bold text-white shrink-0 rounded-none border-2 border-primary">HR</div>
                  <div className="bg-accent/30 p-4 border border-border flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-bold text-primary">Hiring Manager <span className="text-xs bg-primary text-white px-2 py-0.5 ml-2 uppercase">Author</span></span>
                      <span className="text-sm text-muted-foreground">1 day ago</span>
                    </div>
                    <p className="text-secondary">It is 100% remote. We have one optional team offsite per year, but all daily work is fully distributed.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-2 border-primary rounded-none shadow-[4px_4px_0_0_#0F172A]">
            <CardContent className="p-6">
              <h3 className="font-heading text-xl font-bold text-primary mb-4">Company Overview</h3>
              <p className="text-secondary mb-4">FluxTech is building the next generation of cloud infrastructure for AI workloads.</p>
              <div className="space-y-2 text-sm text-secondary font-medium">
                <p><strong>Founded:</strong> 2021</p>
                <p><strong>Size:</strong> 50-200 employees</p>
                <p><strong>Funding:</strong> Series B</p>
              </div>
              <Button variant="outline" className="w-full mt-6 rounded-none">View Company Profile</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
