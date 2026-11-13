"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, FolderKanban, Inbox, MessagesSquare, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/requests", label: "Requests", icon: Inbox, badge: "requests" as const },
  { href: "/matches", label: "Matches", icon: MessagesSquare },
  { href: "/profile", label: "Profile", icon: UserRound },
];

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

function Dot({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="ml-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground tabular-nums">
      {count > 9 ? "9+" : count}
    </span>
  );
}

export function DesktopNav({ pendingRequests }: { pendingRequests: number }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
      {items.slice(0, 4).map(({ href, label, badge }) => (
        <Link
          key={href}
          href={href}
          aria-current={isActive(pathname, href) ? "page" : undefined}
          className={cn(
            "inline-flex h-9 items-center gap-1 rounded-full px-3.5 text-sm font-medium transition-colors",
            isActive(pathname, href) ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
          {badge && <Dot count={pendingRequests} />}
        </Link>
      ))}
    </nav>
  );
}

export function MobileNav({ pendingRequests }: { pendingRequests: number }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main"
      className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-card/90 backdrop-blur-xl md:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {items.map(({ href, label, icon: Icon, badge }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center gap-1 pt-2.5 pb-1 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span className="relative">
                  <Icon className="size-[22px]" strokeWidth={active ? 2.2 : 1.8} />
                  {badge && pendingRequests > 0 && (
                    <span className="absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground ring-2 ring-card">
                      {pendingRequests > 9 ? "9+" : pendingRequests}
                    </span>
                  )}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
