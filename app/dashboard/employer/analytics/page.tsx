import { BarChart3, Bell, Briefcase, MessageSquare, Users } from "lucide-react";
import { MetricCard, RoleShell, SectionCard } from "@/components/layout/role-shell";

const navItems = [
  { href: "/dashboard/employer", label: "Overview", icon: Briefcase },
  { href: "/dashboard/employer/applications", label: "Applications", icon: Users },
  { href: "/dashboard/employer/comments", label: "Comment Moderation", icon: MessageSquare },
  { href: "/dashboard/employer/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/employer/analytics", label: "Analytics", icon: BarChart3, active: true },
];

export default function EmployerAnalyticsPage() {
  return (
    <RoleShell
      roleLabel="Employer Tenant"
      orgLabel="FluxTech"
      title="Tenant Reporting"
      subtitle="Mockup for the employer-only reporting surface required by the BRD. This keeps analytics tenant-scoped and focused on jobs, applications, and discussion activity."
      navItems={navItems}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <MetricCard label="Approved jobs" value="8" />
        <MetricCard label="Applications this month" value="47" tone="cta" />
        <MetricCard label="Interview conversion" value="23%" tone="success" />
        <MetricCard label="Response SLA" value="4.2h" tone="warning" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <SectionCard title="Hiring Funnel" description="Visual placeholder for tenant-specific stats.">
          <div className="space-y-4">
            {[
              ["Views", "1,240"],
              ["Applications", "47"],
              ["Shortlisted", "11"],
              ["Interviews", "4"],
              ["Offers", "1"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-secondary">{label}</span>
                <span className="font-heading text-2xl font-bold text-primary">{value}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Discussion Health" description="Tracks engagement on public job threads and employer response speed.">
          <div className="space-y-4 text-secondary">
            <p>Average first reply time: 2.8 hours</p>
            <p>Open comment threads: 14</p>
            <p>Employer official replies this week: 19</p>
            <p>Moderated comments this month: 6</p>
          </div>
        </SectionCard>
      </div>
    </RoleShell>
  );
}
