import { BarChart3, Briefcase, Building2, ShieldCheck } from "lucide-react";
import { MetricCard, RoleShell, SectionCard } from "@/components/layout/role-shell";

const navItems = [
  { href: "/dashboard/admin", label: "Tenants", icon: Building2 },
  { href: "/dashboard/admin/jobs", label: "Job Approval", icon: Briefcase },
  { href: "/dashboard/admin/moderation", label: "Moderation", icon: ShieldCheck, active: true },
  { href: "/dashboard/admin/analytics", label: "Global Stats", icon: BarChart3 },
];

export default function AdminModerationPage() {
  return (
    <RoleShell
      roleLabel="System Administrator"
      title="Global Moderation"
      subtitle="Mockup for the cross-tenant moderation layer in the BRD. Admins can moderate all content while employers moderate only their own jobs."
      navItems={navItems}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <MetricCard label="Reported comments" value="6" tone="warning" />
        <MetricCard label="Soft-deleted today" value="2" />
        <MetricCard label="Escalated cases" value="1" tone="cta" />
      </div>

      <SectionCard title="Cross-Tenant Review Queue" description="Static moderation mockup for comments and official replies.">
        <div className="space-y-4">
          {[
            ["FluxTech / Senior Golang Developer", "Candidate used abusive language in reply thread", "High priority"],
            ["Neon / Database Reliability Engineer", "Employer reply contains unsupported compensation claim", "Needs policy review"],
            ["Argo Labs / Product Designer", "Suspected spam comment from anonymous reader mirror", "Investigate visibility rules"],
          ].map(([scope, issue, priority]) => (
            <div key={`${scope}-${issue}`} className="border-2 border-border p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <h3 className="font-heading text-xl font-bold text-primary">{scope}</h3>
                <span className="text-xs uppercase tracking-[0.2em] border border-border px-3 py-2 text-secondary">
                  {priority}
                </span>
              </div>
              <p className="text-foreground mt-4">{issue}</p>
              <div className="flex flex-wrap gap-3 mt-5">
                <button className="border-2 border-primary px-4 py-2 text-primary font-bold hover:bg-primary hover:text-white transition-colors">
                  Soft-delete
                </button>
                <button className="border-2 border-border px-4 py-2 text-secondary font-bold hover:border-primary hover:text-primary transition-colors">
                  Leave visible
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </RoleShell>
  );
}
