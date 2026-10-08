import React from 'react';
import { PROPOSAL_DETAILS } from '../data/proposalData';
import { FileText, CheckCircle2, Clock, Code, DollarSign, ShieldCheck, Cpu, Database, Server, ExternalLink } from 'lucide-react';

export default function ProposalViewer() {
  return (
    <div className="py-8 space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-blue-500/30 relative overflow-hidden bg-gradient-to-r from-slate-950 via-blue-950/20 to-slate-950">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-bold">
              <FileText className="w-4 h-4" /> Confidential Proposal & Technical Architecture
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {PROPOSAL_DETAILS.title}
            </h1>
            <p className="text-slate-300 text-sm">
              Prepared by <span className="font-bold text-white">{PROPOSAL_DETAILS.vendor}</span> for <span className="font-bold text-rose-400">{PROPOSAL_DETAILS.client}</span>
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-700/80 p-5 rounded-2xl text-right flex-shrink-0">
            <span className="text-xs text-slate-400 font-semibold block">Total Project Investment</span>
            <span className="text-3xl font-black text-emerald-400">${PROPOSAL_DETAILS.totalInvestment.toLocaleString()} USD</span>
            <span className="text-[11px] text-slate-400 block mt-1">3 Milestones @ $400 each</span>
          </div>
        </div>
      </div>

      {/* Objectives & Scope */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Key Project Objectives
          </h3>
          <ul className="space-y-3 text-xs text-slate-300">
            {PROPOSAL_DETAILS.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  {i+1}
                </span>
                <span className="leading-relaxed">{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack Matrix */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-400" /> Proposed Technology Stack
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400 font-medium">Frontend & 3D:</span>
              <span className="font-bold text-white">{PROPOSAL_DETAILS.techStack.frontend}</span>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400 font-medium">Backend API:</span>
              <span className="font-bold text-white">{PROPOSAL_DETAILS.techStack.backend}</span>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400 font-medium">Database:</span>
              <span className="font-bold text-white">{PROPOSAL_DETAILS.techStack.database}</span>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400 font-medium">Admin & Security:</span>
              <span className="font-bold text-white">{PROPOSAL_DETAILS.techStack.auth}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment & Delivery Milestones */}
      <div className="space-y-4">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Clock className="w-6 h-6 text-amber-400" /> Delivery Timeline & Payment Stages
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROPOSAL_DETAILS.milestones.map((m) => (
            <div 
              key={m.number}
              className={`glass-card p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                m.status === 'completed'
                  ? 'border-emerald-500/50 bg-emerald-950/10'
                  : m.status === 'in-progress'
                  ? 'border-amber-500/50 bg-amber-950/10 ring-2 ring-amber-500/20'
                  : 'border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                    m.status === 'completed'
                      ? 'bg-emerald-900/80 text-emerald-300'
                      : m.status === 'in-progress'
                      ? 'bg-amber-900/80 text-amber-300 animate-pulse'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {m.status}
                  </span>
                  <span className="text-sm font-black text-white">${m.amount} USD</span>
                </div>

                <h3 className="font-extrabold text-white text-base">
                  {m.name}
                </h3>
                <p className="text-xs text-amber-400 font-medium">Schedule: {m.timeline}</p>

                <ul className="space-y-1.5 pt-2 text-xs text-slate-300">
                  {m.deliverables.map((d, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 text-[11px] text-slate-400">
                Payment due upon review & delivery of stage goals.
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3-Month Post Launch Support Notice */}
      <div className="p-6 rounded-3xl glass-panel border border-emerald-500/40 bg-emerald-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold text-white text-base">3 Months Included Post-Launch Support</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              {PROPOSAL_DETAILS.support}
            </p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-900/60 border border-emerald-700/50 px-3 py-1.5 rounded-full">
            Included in $1,200 Scope
          </span>
        </div>
      </div>
    </div>
  );
}
