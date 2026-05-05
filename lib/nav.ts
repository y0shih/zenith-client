import { BarChart3, Bell, Briefcase, MessageSquare, Users, Users as TeamIcon, MessageCircle, UserCircle2, Bookmark } from "lucide-react";
import type { NavItem } from "@/components/layout/role-shell";

/**
 * Generates navigation items for the candidate dashboard based on current path.
 */
export const getCandidateNavItems = (currentPath: string): NavItem[] => {
  const items: NavItem[] = [
    { href: "/dashboard/candidate", label: "My Profile", icon: UserCircle2 },
    { href: "/dashboard/candidate/applications", label: "My Applications", icon: Briefcase },
    { href: "/profile/conversations", label: "Conversation", icon: MessageCircle },
    { href: "/dashboard/candidate/saved", label: "Saved Jobs", icon: Bookmark },
  ];

  return items.map((item) => ({
    ...item,
    active: item.href === currentPath,
  }));
};

/**
 * Generates navigation items for the employer dashboard based on user role and current path.
 */
export const getEmployerNavItems = (currentPath: string, role?: string): NavItem[] => {
  const items: NavItem[] = [
    { href: "/dashboard/employer", label: "Overview", icon: Briefcase },
    { href: "/dashboard/employer/applications", label: "Applications", icon: Users },
    { href: "/dashboard/employer/conversations", label: "Conversation", icon: MessageCircle },
  ];

  if (role === "tenant_admin") {
    items.push({ href: "/dashboard/employer/team", label: "Team", icon: TeamIcon });
  }

  items.push(
    { href: "/dashboard/employer/moderation", label: "Job Moderation", icon: MessageSquare },
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
