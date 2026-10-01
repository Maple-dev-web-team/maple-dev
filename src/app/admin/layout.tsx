"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MapleLogo } from "@/components/ui/MapleLogo";
import {
  LayoutDashboard,
  Home,
  Briefcase,
  Users,
  Award,
  FolderKanban,
  Tags,
  MapPin,
  Settings,
  Mail,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Loader2,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    async function checkAuth() {
      if (isLoginPage) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/admin/auth/session");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          router.replace("/admin/login");
        }
      } catch (err) {
        console.error("Auth check error:", err);
        router.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-white/50" />
          <span className="text-xs font-mono uppercase tracking-widest text-white/60">
            Checking Admin Session...
          </span>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Homepage Editor", href: "/admin/homepage", icon: Home },
    { label: "Services", href: "/admin/services", icon: Briefcase },
    { label: "Team Members", href: "/admin/team", icon: Users },
    { label: "Clients & Logos", href: "/admin/clients", icon: Award },
    { label: "Projects", href: "/admin/projects", icon: FolderKanban },
    { label: "Categories", href: "/admin/categories", icon: Tags },
    { label: "Branches", href: "/admin/branches", icon: MapPin },
    { label: "Site Settings", href: "/admin/settings", icon: Settings },
    { label: "Enquiries", href: "/admin/enquiries", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[#f3f2ee] text-[#121418] flex flex-col lg:flex-row font-sans">
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-[#0a0b0d] text-white p-4 flex items-center justify-between border-b border-white/10">
        <MapleLogo variant="light" size="sm" isLink={false} />
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-1.5 text-white/80 hover:text-white"
        >
          {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0a0b0d] text-white flex flex-col justify-between p-6 transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8">
          {/* Logo / Header */}
          <div className="pb-6 border-b border-white/10">
            <MapleLogo variant="light" size="sm" isLink={false} />
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/40 mt-3">
              Content Management System
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-mono tracking-wider uppercase transition-colors ${
                    isActive
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Account & Live Site */}
        <div className="pt-6 border-t border-white/10 space-y-4">
          <div className="text-[10px] font-mono text-white/50 truncate">
            Logged in: <span className="text-white/80">{user?.email || "Admin"}</span>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-mono uppercase tracking-wider"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center justify-between w-full px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-colors font-mono uppercase tracking-wider"
            >
              <span>Sign Out</span>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <main className="p-6 sm:p-10 max-w-6xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
