import Link from "next/link";
import { Search, MapPin, Building, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function JobsPage() {
  const jobs = [
    { id: 1, title: "Senior Golang Native", company: "FluxTech", location: "Remote", type: "Full-Time", salary: "$120k - $160k", posted: "2d ago" },
    { id: 2, title: "Frontend Platform Engineer", company: "Vercel", location: "San Francisco, CA", type: "Hybrid", salary: "$140k - $190k", posted: "5h ago" },
    { id: 3, title: "Staff Database Architect", company: "Neon", location: "Remote", type: "Full-Time", salary: "$180k - $220k", posted: "1w ago" },
    { id: 4, title: "Lead Product Designer", company: "Linear", location: "Remote", type: "Contract", salary: "$80 - $120/hr", posted: "3d ago" },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white pb-24">
      
      {/* Search Hero */}
      <section className="bg-primary text-white pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          <h1 className="font-heading text-4xl md:text-6xl font-bold">
            OPEN POSITIONS
          </h1>
          
          <div className="bg-white p-2 flex flex-col md:flex-row gap-2 shadow-xl border-4 border-primary">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Job title, keywords, or company..." 
                className="w-full pl-12 pr-4 py-3 bg-transparent text-primary outline-none font-medium placeholder:text-muted-foreground"
              />
            </div>
            <div className="hidden md:block w-px bg-border my-2"></div>
            <div className="relative flex-1 flex items-center">
              <MapPin className="absolute left-4 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="City, state, zip code, or Remote" 
                className="w-full pl-12 pr-4 py-3 bg-transparent text-primary outline-none font-medium placeholder:text-muted-foreground"
              />
            </div>
            <Button size="lg" className="rounded-none rounded-r-none w-full md:w-auto px-8 !py-6 text-lg">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Jobs Listing */}
      <section className="px-6 mt-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-end mb-8 border-b-4 border-primary pb-4">
            <h2 className="text-2xl font-bold font-heading text-primary">4 Available Roles</h2>
            <div className="flex gap-4">
              <select className="bg-transparent font-medium text-primary outline-none border-b-2 border-border pb-1 focus:border-primary cursor-pointer w-[120px]">
                <option>Newest</option>
                <option>Salary: High to Low</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {jobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <Card className="group flex flex-col md:flex-row justify-between items-start md:items-center border-2 hover:border-primary transition-all rounded-none cursor-pointer">
                  <CardHeader className="flex-1 w-full md:w-auto pb-4 md:pb-6">
                    <CardTitle className="text-2xl group-hover:text-cta tracking-tight">
                      {job.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-secondary font-medium mt-4">
                      <span className="flex items-center gap-1.5 bg-accent px-2 py-1 text-sm border border-border">
                        <Building className="w-4 h-4" /> {job.company}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" /> {job.type}
                      </span>
                      <span className="flex items-center gap-1.5 font-bold text-chart-2 text-sm md:ml-2">
                        {job.salary}
                      </span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center w-full md:w-auto gap-4 md:gap-2 pb-6 md:pt-6">
                    <span className="text-sm font-medium text-muted-foreground block">{job.posted}</span>
                    <Button variant="outline" className="group-hover:bg-primary group-hover:text-white group-hover:-translate-y-1">
                      View Role
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
