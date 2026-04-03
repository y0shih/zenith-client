import { BarChart3, Bell, Briefcase, MessageSquare, Users } from "lucide-react";
import { MetricCard, RoleShell, SectionCard } from "@/components/layout/role-shell";

const navItems = [
  { href: "/dashboard/employer", label: "Overview", icon: Briefcase },
  { href: "/dashboard/employer/applications", label: "Applications", icon: Users },
  { href: "/dashboard/employer/comments", label: "Comment Moderation", icon: MessageSquare },
  { href: "/dashboard/employer/notifications", label: "Notifications", icon: Bell, active: true },
  { href: "/dashboard/employer/analytics", label: "Analytics", icon: BarChart3 },
];

const notifications = [
  ["New application", "Alice Chen applied to Senior Golang Developer", "2 min ago"],
  ["Comment needs reply", "A public question was posted on Frontend Platform Engineer", "18 min ago"],
  ["Message received", "Candidate sent a follow-up after screening", "1 hour ago"],
  ["Status changed", "Interview moved to offered for David Nguyen", "Today"],
];

export default function EmployerNotificationsPage() {
  return (
    <RoleShell
      roleLabel="Employer Tenant"
      orgLabel="FluxTech"
      title="Tenant Notification Center"
      subtitle="Mockup for in-app tenant-isolated notifications covering applications, chat, and job discussion updates."
      navItems={navItems}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <MetricCard label="Unread" value="9" tone="cta" />
        <MetricCard label="Application alerts" value="4" />
        <MetricCard label="Discussion alerts" value="3" tone="warning" />
      </div>

      <SectionCard title="Recent Alerts" description="This matches the BRD notification categories without live backend data yet.">
        <div className="space-y-4">
          {notifications.map(([title, description, timestamp]) => (
            <div key={`${title}-${timestamp}`} className="border-2 border-border p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-heading text-xl font-bold text-primary">{title}</h3>
                <span className="text-sm text-muted-foreground">{timestamp}</span>
              </div>
              <p className="text-foreground mt-3">{description}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </RoleShell>
  );
}
