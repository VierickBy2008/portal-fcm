"use client";

import React from "react";
import { TicketSoporte } from "../../types/portal";

interface AdminTicketsTabProps {
  tickets: TicketSoporte[];
}

export function AdminTicketsTab({ tickets }: AdminTicketsTabProps) {
  return (
    <div className="space-y-3 view-transition-gpu">
      {tickets.map((t) => (
        <div
          key={t.id}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center justify-between"
        >
          <div>
            <p className="font-bold text-sm text-[#002855] dark:text-white">{t.asunto}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300">{t.mensaje}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/60">
            {t.estado_atencion}
          </span>
        </div>
      ))}
    </div>
  );
}
