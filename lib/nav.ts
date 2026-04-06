import { BarChart3, Bell, Briefcase, MessageSquare, Users, Users as TeamIcon } from "lucide-react";
import type { NavItem } from "@/components/layout/role-shell";

/**
 * Generates navigation items for the employer dashboard based on user role and current path.
 */
export const getEmployerNavItems = (currentPath: string, role?: string): NavItem[] => {
  const items: NavItem[] = [
    { href: "/dashboard/employer", label: "Overview", icon: Briefcase },
    { href: "/dashboard/employer/applications", label: "Applications", icon: Users },
  ];

  if (role === "tenant_admin") {
    items.push({ href: "/dashboard/employer/team", label: "Team", icon: TeamIcon });
  }

  items.push(
    { href: "/dashboard/employer/comments", label: "Comment Moderation", icon: MessageSquare },
    { href: "/dashboard/employer/notifications", label: "Notifications", icon: Bell },
    { href: "/dashboard/employer/analytics", label: "Analytics", icon: BarChart3 },
  );

  return items.map((item) => ({
    ...item,
    active: item.href === currentPath,
  }));
};

/**
 * Returns role-specific labels for the employer dashboard sidebar.
 */
export const getEmployerRoleLabel = (role?: string) => {
  return role === "tenant_admin" ? "Tenant Administrator" : "Employer Workspace";
};
