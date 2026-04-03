import { BarChart3, Building2, ShieldCheck, Briefcase } from "lucide-react";
import { MetricCard, RoleShell, SectionCard } from "@/components/layout/role-shell";

const navItems = [
  { href: "/dashboard/admin", label: "Tenants", icon: Building2 },
  { href: "/dashboard/admin/jobs", label: "Job Approval", icon: Briefcase, active: true },
  { href: "/dashboard/admin/moderation", label: "Moderation", icon: ShieldCheck },
  { href: "/dashboard/admin/analytics", label: "Global Stats", icon: BarChart3 },
];

export default function AdminJobsPage() {
  return (
    <RoleShell
      roleLabel="System Administrator"
      title="Job Approval Queue"
      subtitle="Mockup for the admin-only approval gate described in the BRD: employer-created jobs become publicly visible only after review."
      navItems={navItems}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <MetricCard label="Pending approval" value="11" tone="warning" />
        <MetricCard label="Approved today" value="7" tone="success" />
        <MetricCard label="Returned for edits" value="3" tone="cta" />
      </div>

      <SectionCard title="Review List" description="Admin review surface for pending public job posts.">
        <div className="space-y-4">
          {[
            ["FluxTech", "Senior Golang Developer", "Remote", "Pending salary validation"],
            ["Neon", "Database Reliability Engineer", "Remote", "Needs policy check"],
            ["Argo Labs", "Product Designer", "Hybrid", "Ready to approve"],
          ].map(([tenant, role, location, note]) => (
            <div key={`${tenant}-${role}`} className="border-2 border-border p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-secondary">{tenant}</p>
                  <h3 className="font-heading text-xl font-bold text-primary mt-2">{role}</h3>
                </div>
                <span className="text-sm text-secondary">{location}</span>
              </div>
              <p className="text-foreground mt-4">{note}</p>
              <div className="flex flex-wrap gap-3 mt-5">
                <button className="border-2 border-primary px-4 py-2 text-primary font-bold hover:bg-primary hover:text-white transition-colors">
                  Approve job
                </button>
                <button className="border-2 border-border px-4 py-2 text-secondary font-bold hover:border-primary hover:text-primary transition-colors">
                  Request changes
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </RoleShell>
  );
}
