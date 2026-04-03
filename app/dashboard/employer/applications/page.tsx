import { BarChart3, Briefcase, Bell, MessageSquare, Users } from "lucide-react";
import { MetricCard, RoleShell, SectionCard } from "@/components/layout/role-shell";

const navItems = [
  { href: "/dashboard/employer", label: "Overview", icon: Briefcase },
  { href: "/dashboard/employer/applications", label: "Applications", icon: Users, active: true },
  { href: "/dashboard/employer/comments", label: "Comment Moderation", icon: MessageSquare },
  { href: "/dashboard/employer/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/employer/analytics", label: "Analytics", icon: BarChart3 },
];

const applicants = [
  ["Alice Chen", "Senior Golang Developer", "Shortlisted", "Resume score 92", "Needs hiring manager review"],
  ["David Nguyen", "Senior Golang Developer", "Interview", "Panel booked Apr 1", "Move to final round if feedback stays positive"],
  ["Linh Tran", "Frontend Platform Engineer", "Under review", "Strong React + infra background", "Waiting on recruiter screen"],
];

export default function EmployerApplicationsPage() {
  return (
    <RoleShell
      roleLabel="Employer Tenant"
      orgLabel="FluxTech"
      title="Tenant Application Queue"
      subtitle="Mockup for `/applications/tenant` and employer status management. This page is scoped to the employer tenant and exposes the documented workflow states."
      navItems={navItems}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <MetricCard label="Submitted" value="18" />
        <MetricCard label="Under review" value="9" tone="warning" />
        <MetricCard label="Interview" value="4" tone="cta" />
        <MetricCard label="Offers" value="1" tone="success" />
      </div>

      <SectionCard
        title="Candidate Pipeline"
        description="Each card stands in for a tenant-isolated application record with inline status actions."
      >
        <div className="space-y-4">
          {applicants.map(([name, role, status, signal, nextStep]) => (
            <div key={`${name}-${role}`} className="border-2 border-border p-5 grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-4">
              <div>
                <h3 className="font-heading text-xl font-bold text-primary">{name}</h3>
                <p className="text-secondary mt-1">{role}</p>
                <p className="text-foreground mt-4">{signal}</p>
                <p className="text-sm text-muted-foreground mt-2">{nextStep}</p>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-xs uppercase tracking-[0.2em] border-2 border-primary px-3 py-2 text-primary font-bold text-center">
                  {status}
                </span>
                <select className="border-2 border-border bg-white px-3 py-3 text-primary font-medium">
                  <option>submitted</option>
                  <option>under_review</option>
                  <option>shortlisted</option>
                  <option>interview</option>
                  <option>offered</option>
                  <option>rejected</option>
                </select>
                <button className="border-2 border-primary px-3 py-3 font-bold text-primary hover:bg-primary hover:text-white transition-colors">
                  View candidate packet
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </RoleShell>
  );
}
