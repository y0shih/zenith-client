import { BarChart3, Briefcase, Building2, ShieldCheck } from "lucide-react";
import { MetricCard, RoleShell, SectionCard } from "@/components/layout/role-shell";

const navItems = [
  { href: "/dashboard/admin", label: "Tenants", icon: Building2 },
  { href: "/dashboard/admin/jobs", label: "Job Approval", icon: Briefcase },
  { href: "/dashboard/admin/moderation", label: "Moderation", icon: ShieldCheck },
  { href: "/dashboard/admin/analytics", label: "Global Stats", icon: BarChart3, active: true },
];

export default function AdminAnalyticsPage() {
  return (
    <RoleShell
      roleLabel="System Administrator"
      title="Global Platform Reporting"
      subtitle="Mockup for the BRD reporting split: employers see tenant-level stats, while admins see platform-wide job, tenant, moderation, and engagement totals."
      navItems={navItems}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <MetricCard label="Active tenants" value="28" />
        <MetricCard label="Approved jobs" value="163" tone="success" />
        <MetricCard label="Pending jobs" value="11" tone="warning" />
        <MetricCard label="Public comments" value="842" tone="cta" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <SectionCard title="Platform Snapshot" description="Global metrics that should not be exposed to tenant users.">
          <div className="space-y-4 text-secondary">
            <p>Applications submitted this month: 1,904</p>
            <p>Chats started after application: 362</p>
            <p>Average admin approval turnaround: 6.1 hours</p>
            <p>Comment moderation rate: 0.7% of public discussion volume</p>
          </div>
        </SectionCard>

        <SectionCard title="Operational Watchlist" description="Static placeholder for alerting and compliance dashboards.">
          <div className="space-y-4 text-secondary">
            <p>3 tenants exceed comment response SLA thresholds.</p>
            <p>2 jobs flagged for inconsistent salary disclosures.</p>
            <p>1 moderation action pending legal review.</p>
            <p>0 system-wide RBAC audit failures in the latest pass.</p>
          </div>
        </SectionCard>
      </div>
    </RoleShell>
  );
}
