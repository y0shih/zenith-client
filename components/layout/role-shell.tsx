"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
};

interface RoleShellProps {
  roleLabel: string;
  orgLabel?: string;
  title: string;
  subtitle: string;
  navItems: NavItem[];
  children: React.ReactNode;
}

export function RoleShell({
  roleLabel,
  orgLabel,
  title,
  subtitle,
  navItems,
  children,
}: RoleShellProps) {
  return (
    <div className="flex flex-col bg-background text-foreground h-full min-h-0">
      <main className="flex-1 w-full flex flex-col">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-2 font-semibold">
            {roleLabel} {orgLabel ? `— ${orgLabel}` : ""}
          </p>
          <h1 className="font-heading text-4xl font-bold text-primary">{title}</h1>
          <p className="text-secondary text-lg mt-2 max-w-3xl">{subtitle}</p>
        </header>

        <div className="flex-1 min-h-0">
          {children}
        </div>
      </main>
    </div>
  );
}

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-none border-2 border-primary bg-card shadow-[6px_6px_0_0_#0F172A]">
      <div className="border-b-2 border-border px-6 py-5">
        <h2 className="font-heading text-2xl font-bold text-primary">{title}</h2>
        {description ? <p className="text-secondary mt-1">{description}</p> : null}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

export function MetricCard({
  label,
  value,
  tone = "primary",
}: {
  label: string;
  value: string;
  tone?: "primary" | "cta" | "success" | "warning";
}) {
  const toneClass = {
    primary: "border-primary text-primary",
    cta: "border-cta text-cta",
    success: "border-chart-2 text-chart-2",
    warning: "border-chart-3 text-chart-3",
  }[tone];

  return (
    <div className={`border-2 ${toneClass} bg-card px-5 py-4`}>
      <p className="text-xs uppercase tracking-[0.2em] text-secondary">{label}</p>
      <p className="font-heading text-3xl font-bold mt-3">{value}</p>
    </div>
  );
}
