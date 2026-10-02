"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import {
  Briefcase,
  Users,
  Award,
  FolderKanban,
  MapPin,
  Mail,
  Home,
  Settings,
  ArrowRight,
  Database,
  Cloud,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface Stats {
  services: number;
  team: number;
  clients: number;
  projects: number;
  branches: number;
  enquiries: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    services: 0,
    team: 0,
    clients: 0,
    projects: 0,
    branches: 0,
    enquiries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [copiedSql, setCopiedSql] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const supabase = createClient();

  const loadStats = React.useCallback(async () => {
    try {
      const [
        { count: servicesCount },
        { count: teamCount },
        { count: clientsCount },
        { count: projectsCount },
        { count: branchesCount },
        { count: enquiriesCount },
      ] = await Promise.all([
        supabase.from("services").select("*", { count: "exact", head: true }),
        supabase.from("team_members").select("*", { count: "exact", head: true }),
        supabase.from("clients").select("*", { count: "exact", head: true }),
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("branches").select("*", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        services: servicesCount || 0,
        team: teamCount || 0,
        clients: clientsCount || 0,
        projects: projectsCount || 0,
        branches: branchesCount || 0,
        enquiries: enquiriesCount || 0,
      });
    } catch (err) {
      console.warn("Notice checking counts:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleCopySql = async () => {
    try {
      const res = await fetch("/api/admin/sql");
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 3000);
    } catch {
      alert("Please copy from supabase/migrations/20261002_fix_uuid_and_rls.sql");
    }
  };

  const handleSyncData = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/admin/sync", { method: "POST" });
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Sync failed");
      }
      setSyncMessage("Success: All content synced to Supabase database!");
      loadStats();
    } catch (err: unknown) {
      const e = err as Error;
      setSyncMessage(`Sync notice: ${e.message}`);
    } finally {
      setSyncing(false);
    }
  };

  const cards = [
    {
      title: "Services",
      count: stats.services,
      href: "/admin/services",
      icon: Briefcase,
      description: "Manage civil & structural capabilities",
    },
    {
      title: "Team Members",
      count: stats.team,
      href: "/admin/team",
      icon: Users,
      description: "Leadership & engineering specialists",
    },
    {
      title: "Clients & Logos",
      count: stats.clients,
      href: "/admin/clients",
      icon: Award,
      description: "Client brand logos & collaborations",
    },
    {
      title: "Projects",
      count: stats.projects,
      href: "/admin/projects",
      icon: FolderKanban,
      description: "Showcase cases & gallery images",
    },
    {
      title: "Branches",
      count: stats.branches,
      href: "/admin/branches",
      icon: MapPin,
      description: "Offices in Calicut, Kochi, Bangalore",
    },
    {
      title: "Client Enquiries",
      count: stats.enquiries,
      href: "/admin/enquiries",
      icon: Mail,
      description: "Direct contact submissions",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-black/10 pb-6">
        <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-black/50 mb-1">
          Administration
        </div>
        <h1 className="text-3xl font-serif text-[#121418] font-normal tracking-tight">
          System Overview
        </h1>
        <p className="text-xs text-black/60 font-mono mt-1">
          Maple Consulting Engineers Content Management System
        </p>
      </div>

      {/* Integration Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-white border border-black/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-700">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#121418]">
                Supabase PostgreSQL
              </div>
              <div className="text-[11px] font-mono text-black/50">
                Connected: xoxghjnzilytsonuvkih
              </div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-mono uppercase tracking-wider font-medium">
            <CheckCircle2 className="w-3 h-3" />
            Active
          </span>
        </div>

        <div className="p-4 bg-white border border-black/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-50 text-sky-700">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#121418]">
                Cloudinary Asset Storage
              </div>
              <div className="text-[11px] font-mono text-black/50">
                Connected: i76hycoa
              </div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-100 text-sky-800 text-[10px] font-mono uppercase tracking-wider font-medium">
            <CheckCircle2 className="w-3 h-3" />
            Active
          </span>
        </div>
      </div>

      {/* Cloud Database Setup & Sync Helper */}
      <div className="p-6 bg-[#121418] text-white border border-black/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mb-1">
              Production Persistence &amp; Database Sync
            </div>
            <h3 className="text-base font-serif font-normal text-white">
              Cloud Database (Supabase) Setup &amp; Live Sync
            </h3>
            <p className="text-xs text-white/60 font-mono mt-1">
              Enable full end-to-end CMS editing on both localhost and Vercel production
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopySql}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider transition-colors border border-white/20"
              title="Copy SQL migration script to clipboard"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? "Copied SQL!" : "Copy SQL Script"}</span>
            </button>

            <button
              type="button"
              disabled={syncing}
              onClick={handleSyncData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-white/90 text-xs font-mono uppercase tracking-wider font-bold transition-colors disabled:opacity-50"
            >
              {syncing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync All Data to Cloud</span>
                </>
              )}
            </button>
          </div>
        </div>

        {syncMessage && (
          <div
            className={`p-3 text-xs font-mono border ${
              syncMessage.includes("Success")
                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                : "bg-amber-950/60 border-amber-500/40 text-amber-300"
            }`}
          >
            {syncMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-white/70 pt-1">
          <div className="p-3 bg-white/[0.03] border border-white/10 space-y-1.5">
            <div className="text-white font-semibold flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-white/10 text-center text-[10px] leading-4 text-white">1</span>
              <span>Execute SQL Migration in Supabase</span>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Click &quot;Copy SQL Script&quot;, open your{" "}
              <a
                href="https://supabase.com/dashboard/project/xoxghjnzilytsonuvkih/sql/new"
                target="_blank"
                rel="noreferrer"
                className="text-white underline inline-flex items-center gap-1 hover:text-white/80"
              >
                Supabase SQL Editor <ExternalLink className="w-3 h-3 inline" />
              </a>
              , paste and click <strong>Run</strong>. This allows string IDs and enables cloud CMS updates.
            </p>
          </div>

          <div className="p-3 bg-white/[0.03] border border-white/10 space-y-1.5">
            <div className="text-white font-semibold flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-white/10 text-center text-[10px] leading-4 text-white">2</span>
              <span>Click &quot;Sync All Data to Cloud&quot;</span>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Pushes all 10 services, 2 team members, projects, categories, settings, and hero slide images into the cloud database so changes persist on Vercel main.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="p-6 bg-white border border-black/10 hover:border-black/40 transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 bg-black/5 text-[#121418] group-hover:bg-black group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-3xl font-serif text-[#121418]">
                  {loading ? "..." : card.count}
                </span>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-[#121418] group-hover:text-black">
                  {card.title}
                </h3>
                <p className="text-xs text-black/50 mt-1">{card.description}</p>
                <div className="mt-4 flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-black/60 group-hover:text-black font-medium">
                  <span>Manage</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white border border-black/10 p-6 sm:p-8 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-black/50">
          Core Settings &amp; Homepage Configuration
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/homepage"
            className="p-4 border border-black/10 hover:border-black flex items-center justify-between transition-colors bg-black/[0.01]"
          >
            <div className="flex items-center gap-3">
              <Home className="w-4 h-4 text-black/70" />
              <div>
                <div className="text-xs font-semibold text-[#121418]">
                  Edit Homepage Sections
                </div>
                <div className="text-[11px] text-black/50">
                  Update Hero, About, Vision, Quotes, and Image assets
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-black/40" />
          </Link>

          <Link
            href="/admin/settings"
            className="p-4 border border-black/10 hover:border-black flex items-center justify-between transition-colors bg-black/[0.01]"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-black/70" />
              <div>
                <div className="text-xs font-semibold text-[#121418]">
                  Edit Site Settings
                </div>
                <div className="text-[11px] text-black/50">
                  Company info, phones, logo, WhatsApp, and copyright
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-black/40" />
          </Link>
        </div>
      </div>
    </div>
  );
}
