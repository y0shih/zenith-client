import { BarChart3, Bell, Briefcase, MessageSquare, Users } from "lucide-react";
import { MetricCard, RoleShell, SectionCard } from "@/components/layout/role-shell";

const navItems = [
  { href: "/dashboard/employer", label: "Overview", icon: Briefcase },
  { href: "/dashboard/employer/applications", label: "Applications", icon: Users },
  { href: "/dashboard/employer/comments", label: "Comment Moderation", icon: MessageSquare, active: true },
  { href: "/dashboard/employer/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/employer/analytics", label: "Analytics", icon: BarChart3 },
];

const threads = [
  ["Senior Golang Developer", "Do you sponsor relocation for staff engineers?", "Candidate question", "Needs official reply"],
  ["Frontend Platform Engineer", "The salary band looks outdated versus the detail page.", "Public feedback", "Needs content review"],
  ["Backend Engineer", "Thanks for clarifying the on-call schedule.", "Employer reply", "Resolved"],
];

export default function EmployerCommentsPage() {
  return (
    <RoleShell
      roleLabel="Employer Tenant"
      orgLabel="FluxTech"
      title="Job Discussion Moderation"
      subtitle="Mockup for the BRD social job discussion layer: public comments, one-level replies, official employer replies, and soft-delete moderation controls."
      navItems={navItems}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <MetricCard label="Open threads" value="14" />
        <MetricCard label="Awaiting employer reply" value="5" tone="cta" />
        <MetricCard label="Moderated today" value="2" tone="warning" />
      </div>

      <SectionCard title="Comment Queue" description="Employer-only moderation view for comments attached to this tenant's approved jobs.">
        <div className="space-y-4">
          {threads.map(([job, content, type, state]) => (
            <div key={`${job}-${content}`} className="border-2 border-border p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-secondary">{type}</p>
                  <h3 className="font-heading text-xl font-bold text-primary mt-2">{job}</h3>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] border border-border px-3 py-2 text-secondary">
                  {state}
                </span>
              </div>
              <p className="text-foreground mt-4">{content}</p>
              <div className="flex flex-wrap gap-3 mt-5">
                <button className="border-2 border-primary px-4 py-2 text-primary font-bold hover:bg-primary hover:text-white transition-colors">
                  Post official reply
                </button>
                <button className="border-2 border-border px-4 py-2 text-secondary font-bold hover:border-primary hover:text-primary transition-colors">
                  Soft-delete comment
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </RoleShell>
  );
}
