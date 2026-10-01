"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Mail, Trash2, CheckCircle2, Loader2, Calendar, Phone } from "lucide-react";
import type { ContactSubmission } from "@/types/database";

export default function AdminEnquiriesPage() {
  const supabase = createClient();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Fetch enquiries notice:", error.message);
      } else {
        setSubmissions(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const updateStatus = async (id: string, status: "new" | "read" | "replied" | "archived") => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      fetchSubmissions();
    } catch (err: unknown) {
      const e = err as Error;
      alert(e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
      if (error) throw error;
      fetchSubmissions();
    } catch (err: unknown) {
      const e = err as Error;
      alert(e.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-black/10 gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-black/50 mb-1">
            Section 06 Form Submissions
          </div>
          <h1 className="text-3xl font-serif text-[#121418] font-normal tracking-tight">
            Client Enquiries &amp; Messages
          </h1>
          <p className="text-xs text-black/60 font-mono mt-1">
            Incoming engineering consultation requests from the website
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-black/40" />
        </div>
      ) : submissions.length > 0 ? (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className={`p-6 bg-white border transition-colors ${
                sub.status === "new"
                  ? "border-black/30 shadow-sm"
                  : "border-black/10 opacity-80 hover:opacity-100"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-black/5">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-serif font-bold text-[#121418]">
                      {sub.name}
                    </h3>
                    <span
                      className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 ${
                        sub.status === "new"
                          ? "bg-amber-100 text-amber-800 font-bold"
                          : sub.status === "replied"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-black/10 text-black/60"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-mono text-black/60">
                    <a
                      href={`mailto:${sub.email}`}
                      className="flex items-center gap-1.5 hover:text-black hover:underline"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{sub.email}</span>
                    </a>
                    {sub.phone && (
                      <a
                        href={`tel:${sub.phone}`}
                        className="flex items-center gap-1.5 hover:text-black hover:underline"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{sub.phone}</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-black/40 shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {sub.created_at
                      ? new Date(sub.created_at).toLocaleString()
                      : "Recent"}
                  </span>
                </div>
              </div>

              <div className="pt-4 text-xs sm:text-sm text-[#121418]/80 leading-relaxed font-light whitespace-pre-line">
                {sub.message}
              </div>

              <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {sub.status !== "read" && (
                    <button
                      onClick={() => updateStatus(sub.id, "read")}
                      className="px-2.5 py-1 text-[10px] font-mono uppercase bg-black/5 hover:bg-black/10 text-black/70"
                    >
                      Mark Read
                    </button>
                  )}
                  {sub.status !== "replied" && (
                    <button
                      onClick={() => updateStatus(sub.id, "replied")}
                      className="px-2.5 py-1 text-[10px] font-mono uppercase bg-emerald-50 hover:bg-emerald-100 text-emerald-800"
                    >
                      Mark Replied
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(sub.id)}
                  className="p-1 hover:bg-red-50 text-red-500"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 border border-black/10 bg-white text-center space-y-3">
          <p className="font-serif text-lg text-black/60 italic">
            No client enquiries received yet.
          </p>
          <p className="text-xs font-mono text-black/40">
            Messages submitted through the public website contact form will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
