import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-xl border border-n200 bg-white p-5 shadow-sm", className)}
      {...props}
    />
  );
}

// Icon box + title + short description sitting above a stage's form fields, inside the card
// but visually separated by a border. Used at the top of each wizard stage.
export function CardHeader({
  icon,
  iconBg = "bg-n100",
  title,
  desc,
}: {
  icon: ReactNode;
  iconBg?: string;
  title: ReactNode;
  desc?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start gap-3 border-b border-n200 pb-3">
      <div className={cn("flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-lg", iconBg)}>
        {icon}
      </div>
      <div>
        <div className="text-[15px] font-bold text-navy-900">{title}</div>
        {desc && <div className="mt-0.5 text-[11px] text-n500">{desc}</div>}
      </div>
    </div>
  );
}

const ALERT_TONES = {
  info: "bg-blue-500/10 border-blue-500/30 text-blue-600",
  success: "bg-success-bg border-success/30 text-success-ink",
  warning: "bg-warning-bg border-warning/40 text-warning-ink",
  error: "bg-danger-bg border-danger/30 text-danger-ink",
} as const;

export function Alert({
  tone = "info",
  children,
}: {
  tone?: keyof typeof ALERT_TONES;
  children: ReactNode;
}) {
  return (
    <div className={cn("mb-3 rounded-md border px-3.5 py-2.5 text-[12.5px]", ALERT_TONES[tone])}>
      {children}
    </div>
  );
}

// Consistent page header used across every Connect list page — icon chip + title + subtitle on
// the left, an optional action (button/link) on the right.
export function PageHeader({
  icon: Icon,
  tint = "bg-n100",
  color = "text-blue-500",
  title,
  subtitle,
  action,
}: {
  icon?: LucideIcon;
  tint?: string;
  color?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        {Icon && (
          <span className={cn("flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl", tint, color)}>
            <Icon size={20} strokeWidth={2} />
          </span>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl leading-tight font-extrabold text-navy-900">{title}</h1>
          {subtitle && <div className="mt-0.5 text-sm text-n500">{subtitle}</div>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export interface StatStripItem {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  tint?: string;
  color?: string;
}

// Row of small summary tiles — the bento "stat strip" that heads each list page.
export function StatStrip({ items }: { items: StatStripItem[] }) {
  return (
    <div className={cn("mb-5 grid grid-cols-2 gap-3", items.length >= 4 ? "sm:grid-cols-4" : "sm:grid-cols-3")}>
      {items.map((s) => (
        <div key={s.label} className="flex items-center gap-3 rounded-xl border border-n200 bg-white p-4 shadow-sm">
          {s.icon && (
            <span
              className={cn(
                "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg",
                s.tint || "bg-n100",
                s.color || "text-blue-500",
              )}
            >
              <s.icon size={17} strokeWidth={2} />
            </span>
          )}
          <div className="min-w-0">
            <div className="text-lg leading-none font-extrabold text-navy-900">{s.value}</div>
            <div className="mt-0.5 truncate text-[11px] font-semibold text-n500">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Initial-letter avatar chip, shared by directory / partners / requests rows.
export function InitialAvatar({
  name,
  size = "default",
}: {
  name: string | undefined;
  size?: "sm" | "default" | "lg";
}) {
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  return (
    <Avatar size={size}>
      <AvatarFallback className="bg-blue-500/10 font-bold text-blue-600">{initial}</AvatarFallback>
    </Avatar>
  );
}

export function Field({
  label,
  required,
  children,
}: {
  label: ReactNode;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="mb-3 flex flex-col gap-1">
      <label className="text-[11px] font-bold tracking-wide text-n700 uppercase">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      {children}
    </div>
  );
}
