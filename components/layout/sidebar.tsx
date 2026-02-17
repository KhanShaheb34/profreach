"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { LayoutDashboard, User, Download, Settings, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/export", label: "Export", icon: Download },
  { href: "/settings", label: "Settings", icon: Settings },
];

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} className="h-8 w-8">
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => {
        const isActive = item.href === "/dashboard"
          ? pathname === "/dashboard"
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile trigger */}
      <div className="fixed top-0 left-0 z-40 flex h-14 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur-sm md:hidden">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-14 items-center gap-2 border-b px-4">
                <Image
                  src="/profreach-icon.svg"
                  alt="Profreach logo"
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
                <span className="text-lg font-bold">Profreach</span>
              </div>
              <div className="py-4">
                <NavLinks onNavigate={() => setOpen(false)} />
              </div>
              <div className="border-t p-3">
                <UserButton />
              </div>
            </SheetContent>
          </Sheet>
          <Image
            src="/profreach-icon.svg"
            alt="Profreach logo"
            width={20}
            height={20}
            className="h-5 w-5"
          />
          <span className="font-bold">Profreach</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 md:border-r md:bg-background">
        <div className="flex h-14 items-center justify-between border-b px-6">
          <div className="flex items-center gap-2">
            <Image
              src="/profreach-icon.svg"
              alt="Profreach logo"
              width={24}
              height={24}
              className="h-6 w-6"
            />
            <span className="text-lg font-bold">Profreach</span>
          </div>
          <ThemeToggle />
        </div>
        <div className="flex-1 py-4">
          <NavLinks />
        </div>
        <div className="border-t p-3">
          <UserButton />
        </div>
      </aside>
    </>
  );
}
