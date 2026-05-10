"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  ArrowLeft,
  LayoutDashboard,
  Settings,
  User,
  Briefcase,
  Users,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useSession } from "./session-provider";

export function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { activeTenantName, activeTenantId } = useSession();

  const isEmployer = pathname.includes("/dashboard/employer");
  const isAdmin = pathname.includes("/dashboard/admin");
  
  const tenantName = activeTenantName || (activeTenantId ? `Org ${activeTenantId.slice(0, 8)}` : undefined);

  const employerLinks = [
    { label: "Overview", href: "/dashboard/employer", icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" /> },
    { label: "Applications", href: "/dashboard/employer/applications", icon: <User className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" /> },
    { label: "Conversations", href: "/dashboard/employer/conversations", icon: <MessageSquare className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" /> },
    { label: "Team", href: "/dashboard/employer/team", icon: <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" /> },
    { label: "Moderation", href: "/dashboard/employer/moderation", icon: <Briefcase className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" /> },
    { label: "Notifications", href: "/dashboard/employer/notifications", icon: <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" /> },
    { label: "Analytics", href: "/dashboard/employer/analytics", icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" /> },
    { label: "Settings", href: "/settings", icon: <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" /> },
    { label: "Back to Home", href: "/", icon: <ArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" /> },
  ];

  const adminLinks = [
    { label: "Overview", href: "/dashboard/admin", icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" /> },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" /> },
    { label: "Settings", href: "/settings", icon: <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" /> },
    { label: "Back to Home", href: "/", icon: <ArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" /> },
  ];

  const links = isAdmin ? adminLinks : employerLinks;

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 overflow-hidden",
        "h-[calc(100vh-64px)]" // Account for the 64px AppHeader
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo tenantName={tenantName} /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Profile",
                href: "/profile",
                icon: (
                  <div className="h-7 w-7 bg-stone-200 rounded-full flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-stone-600" />
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 overflow-hidden">
        <div className="p-2 md:p-8 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

const Logo = ({ tenantName }: { tenantName?: string }) => {
  return (
    <a href="/" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20 overflow-hidden">
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm shrink-0" />
      <span className="font-medium text-black dark:text-white truncate" title={tenantName ? `Zenith - ${tenantName}` : "Zenith"}>
        Zenith{tenantName ? ` - ${tenantName}` : ""}
      </span>
    </a>
  );
};

const LogoIcon = () => {
  return (
    <a href="/" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm shrink-0" />
    </a>
  );
};
