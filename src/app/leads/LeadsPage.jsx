import React, { useState } from 'react';
import Axios from '../../lib/axios';
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Building2,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  Archive,
  Tag,
  Calendar,
  Loader2,
  Eye,
  TrendingUp,
  Search,
  X,
  Users,
  Plus,
  Download,
} from "lucide-react";
import LeadDetailsModal from './components/LeadsDialog';
import { useDebounce } from '../../hooks/useDebounce';
import UploadExcel from './components/UploadExcel';
import ImportLeadsDialog from './components/UploadExcel';

const fetchLeads = async (params) => {
  try {
    const response = await Axios.get("/leads", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const StatCard = ({ icon: Icon, label, value, accent }) => (
  <div className="relative flex flex-col gap-1 rounded-xl border bg-white px-4 py-3.5 shadow-sm overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
    <div className="absolute inset-0 opacity-[0.04]" style={{ background: accent }} />
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">{label}</span>
      <span className="flex items-center justify-center w-7 h-7 rounded-lg" style={{ background: `${accent}18` }}>
        <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
      </span>
    </div>
    <span className="text-2xl font-bold text-slate-800 leading-none mt-0.5">{value}</span>
  </div>
);

export default function LeadsPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    page: 1, limit: 50,
    industry: "", city: "", country: "", source: "", status: "", isArchived: false,
  });
  const [searchInput, setSearchInput] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch = useDebounce(searchInput, 300);

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["leads-data", filters, debouncedSearch],
    queryFn: () => fetchLeads({ ...filters, search: debouncedSearch }),
    keepPreviousData: true,
  });

  const handleViewLead = (lead) => { setSelectedLead(lead); setIsModalOpen(true); };
  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  const clearFilters = () => { setFilters({ page: 1, limit: 50, industry: "", city: "", country: "", source: "", status: "", isArchived: false }); setSearchInput(""); };
  const nextPage = () => { if (data?.pages > filters.page) setFilters(prev => ({ ...prev, page: prev.page + 1 })); };
  const prevPage = () => { if (filters.page > 1) setFilters(prev => ({ ...prev, page: prev.page - 1 })); };

  const getStatusStyle = (status) => {
    const map = {
      'new': { bg: '#eff6ff', color: '#2563eb', label: 'New' },
      'contacted': { bg: '#fffbeb', color: '#d97706', label: 'Contacted' },
      'qualified': { bg: '#f0fdf4', color: '#16a34a', label: 'Qualified' },
      'proposal-sent': { bg: '#f5f3ff', color: '#7c3aed', label: 'Proposal Sent' },
      'negotiation': { bg: '#fff1f2', color: '#e11d48', label: 'Negotiation' },
      'won': { bg: '#f0fdf4', color: '#15803d', label: 'Won' },
      'lost': { bg: '#fef2f2', color: '#dc2626', label: 'Lost' },
      'not-interested': { bg: '#f8fafc', color: '#64748b', label: 'Not Interested' },
    };
    return map[status] || { bg: '#f8fafc', color: '#64748b', label: status };
  };

  const leads = data?.leads || [];
  const totalCount = data?.leadsCount || 0;
  const totalPages = data?.pages || 1;
  const industry = data?.industry || [];
  const source = data?.source || [];
  const status = data?.status || [];
  const city = data?.city || [];

  const statCards = [
    { icon: Building2, label: 'Total Leads', value: totalCount, accent: '#3b82f6' },
    { icon: Mail, label: 'With Email', value: leads.filter(l => l.contacts?.some(c => c.email)).length, accent: '#8b5cf6' },
    { icon: Phone, label: 'With Phone', value: leads.filter(l => l.contacts?.some(c => c.phone)).length, accent: '#06b6d4' },
    { icon: Users, label: 'HR Contacts', value: leads.filter(l => l.contacts?.some(c => c.role?.toLowerCase().includes('hr'))).length, accent: '#f59e0b' },
    { icon: TrendingUp, label: 'Qualified', value: leads.filter(l => ['qualified', 'won'].includes(l.status)).length, accent: '#10b981' },
    { icon: MapPin, label: 'Locations', value: [...new Set(leads.map(l => l.city).filter(Boolean))].length, accent: '#f43f5e' },
  ];

  const hasActiveFilters = !!(filters.industry || filters.city || filters.country || filters.source || filters.status);
  const activeFilterCount = [filters.industry, filters.city, filters.country, filters.source, filters.status].filter(Boolean).length;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-red-500 font-medium">Error loading leads</p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#f8fafc', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
        .leads-root * { font-family: 'DM Sans', sans-serif !important; }
        .leads-scroll::-webkit-scrollbar { height: 4px; width: 4px; }
        .leads-scroll::-webkit-scrollbar-track { background: transparent; }
        .leads-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        .tr-hover:hover td { background: #f8fafc; }
        .status-pip {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 999px;
          font-size: 11px; font-weight: 600; white-space: nowrap;
        }
        .status-pip::before {
          content: ''; width: 5px; height: 5px; border-radius: 50%;
          background: currentColor; display: block; opacity: 0.7;
        }
        .icon-btn {
          display: flex; align-items: center; justify-content: center;
          width: 28px; height: 28px; border-radius: 8px;
          color: #94a3b8; transition: all 0.15s;
          cursor: pointer; border: none; background: transparent;
        }
        .icon-btn:hover { background: #eff6ff; color: #2563eb; }
      `}</style>

      <div className="leads-root flex flex-col h-full">

        {/* ── HEADER ── */}
        <div className="flex-none bg-white border-b border-slate-100 px-6 pt-5 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Lead Management</h1>
              <p className="text-slate-400 text-xs mt-0.5">Manage and track your leads across all sources</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isFetching}
                className="h-8 text-xs gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50">
                <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={() => navigate("/leads/add-lead")} variant="outline" size="sm" disabled={isFetching}
                className="h-8 text-xs gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50">
                <Download className="h-3.5 w-3.5" />
                Import
              </Button>
              <ImportLeadsDialog />
              <Button onClick={() => navigate("/leads/add-lead")} variant="outline" size="sm" disabled={isFetching}
                className="h-8 text-xs gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50">
                <Plus className="h-3.5 w-3.5" />
                Add Lead
              </Button>


            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-6 gap-3">
            {statCards.map((s, i) => <StatCard key={i} {...s} />)}
          </div>
        </div>

        {/* ── TOOLBAR ── */}
        <div className="flex-none bg-white border-b border-slate-100 px-6 py-2.5 flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative min-w-50 flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <Input placeholder="Search companies, emails, phones…" value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="pl-8 h-8 text-xs border-slate-200 bg-slate-50 focus:bg-white focus-visible:ring-1 focus-visible:ring-blue-400" />
            {searchInput && (
              <button onClick={() => setSearchInput("")} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <X className="h-3.5 w-3.5 text-slate-400 hover:text-slate-700" />
              </button>
            )}
          </div>

          {/* Filter btn */}
          <Button variant="outline" size="sm" onClick={() => setShowFilters(v => !v)}
            className={`h-8 px-3 text-xs gap-1.5 transition-colors ${showFilters
              ? 'bg-slate-800 text-white border-slate-800 hover:bg-slate-700 hover:border-slate-700'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            <Filter className="h-3.5 w-3.5" />
            Filters
            {hasActiveFilters && (
              <span className={`ml-0.5 rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold ${showFilters ? 'bg-white text-slate-800' : 'bg-blue-500 text-white'}`}>
                {activeFilterCount}
              </span>
            )}
          </Button>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors px-1">
              <X className="h-3 w-3" /> Clear
            </button>
          )}

          {/* Archive */}
          <Select value={filters.status} onValueChange={v => handleFilterChange("status", v)}>
            <SelectTrigger className="w-48 h-8 text-xs border-slate-200 bg-white"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              {[{ v: "new", l: "New" }, { v: "contacted", l: "Contacted" }, { v: "qualified", l: "Qualified" }, { v: "proposal-sent", l: "Proposal Sent" }, { v: "negotiation", l: "Negotiation" }, { v: "won", l: "Won" }, { v: "lost", l: "Lost" }, { v: "not-interested", l: "Not Interested" }]
                .map(s => <SelectItem key={s.v} value={s.v}>{s.l}</SelectItem>)}
            </SelectContent>
          </Select>


          <div className="flex-1" />

          {/* Pagination */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 select-none">
            <span className="hidden sm:inline">
              {leads.length > 0
                ? `${(filters.page - 1) * filters.limit + 1}–${Math.min(filters.page * filters.limit, totalCount)} of ${totalCount}`
                : `0 of ${totalCount}`}
              {isFetching && <Loader2 className="inline ml-1.5 h-3 w-3 animate-spin text-slate-400" />}
            </span>
            <Button variant="outline" size="icon" className="h-7 w-7 border-slate-200" onClick={prevPage} disabled={filters.page === 1 || isFetching}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold min-w-15 text-center">
              {filters.page} / {totalPages}
            </span>
            <Button variant="outline" size="icon" className="h-7 w-7 border-slate-200" onClick={nextPage} disabled={filters.page === totalPages || isFetching}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* ── EXPANDED FILTERS ── */}
        {showFilters && (
          <div className="flex-none bg-slate-50 border-b border-slate-100 px-6 py-3">
            <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
              {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2"> */}
              <Select value={filters.industry} onValueChange={v => handleFilterChange("industry", v)}>
                <SelectTrigger className="w-full h-8 text-xs border-slate-200 bg-white"><SelectValue placeholder="Industry" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Industries</SelectItem>
                  {industry.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.source} onValueChange={v => handleFilterChange("source", v)}>
                <SelectTrigger className="w-full h-8 text-xs border-slate-200 bg-white"><SelectValue placeholder="Source" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Sources</SelectItem>
                  {source.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.status} onValueChange={v => handleFilterChange("status", v)}>
                <SelectTrigger className="w-full h-8 text-xs border-slate-200 bg-white"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  {[{ v: "new", l: "New" }, { v: "contacted", l: "Contacted" }, { v: "qualified", l: "Qualified" }, { v: "proposal-sent", l: "Proposal Sent" }, { v: "negotiation", l: "Negotiation" }, { v: "won", l: "Won" }, { v: "lost", l: "Lost" }, { v: "not-interested", l: "Not Interested" }]
                    .map(s => <SelectItem key={s.v} value={s.v}>{s.l}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filters.city} onValueChange={v => handleFilterChange("city", v)}>
                <SelectTrigger className="w-full h-8 text-xs border-slate-200 bg-white"><SelectValue placeholder="City" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All City</SelectItem>
                  {city.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* ── TABLE AREA ── */}
        <div className="flex-1 overflow-hidden px-6 py-4">
          <div className="h-full rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
            <div className="leads-scroll flex-1 overflow-auto">
              <Table className="min-w-240">
                <TableHeader>
                  <TableRow className="bg-slate-50/80 border-b border-slate-100 hover:bg-slate-50/80">
                    {["Lead / Company", "Industry", "Location", "Source", "Status", "Primary Contact", ""].map((h, i) => (
                      <TableHead key={i} className={`text-[10px] uppercase tracking-widest text-slate-400 font-semibold py-2.5 ${i === 8 ? 'text-right' : ''}`}>
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isFetching && !leads.length ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-20">
                        <Loader2 className="h-7 w-7 animate-spin mx-auto mb-2 text-slate-300" />
                        <p className="text-slate-400 text-sm">Loading leads…</p>
                      </TableCell>
                    </TableRow>
                  ) : leads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-20">
                        <Building2 className="h-10 w-10 mx-auto mb-2 text-slate-200" />
                        <p className="text-slate-400 text-sm font-medium">No leads found</p>
                        <button onClick={clearFilters} className="text-blue-500 text-xs mt-1 hover:underline">Clear filters</button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    leads.map((lead) => {
                      const primary = lead.contacts?.find(c => c.isPrimary);
                      const st = getStatusStyle(lead.status);
                      const initials = lead.name?.charAt(0).toUpperCase();
                      return (
                        <TableRow key={lead._id} className="tr-hover border-b border-slate-50 last:border-0">
                          {/* Company */}
                          <TableCell className="py-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold"
                                style={{ background: '#eff6ff', color: '#2563eb' }}>
                                {initials}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-800 text-sm leading-tight">{lead.company}</div>
                                {lead.website && (
                                  <a href={lead.website} target="_blank" rel="noopener noreferrer"
                                    className="text-[11px] text-blue-500 hover:underline truncate block max-w-35">
                                    {lead.website.replace(/^https?:\/\//, '')}
                                  </a>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          {/* Industry */}
                          <TableCell className="px-4 py-2.5">
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md font-medium">
                              <Briefcase className="h-3 w-3 text-slate-400 shrink-0" />
                              {lead.industry}
                            </span>
                          </TableCell>

                          {/* Location */}
                          <TableCell className="px-4 py-2.5">
                            <div className="flex items-center gap-1 text-xs text-slate-700">
                              <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                              {lead.city}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 pl-4">{lead.country}</div>
                          </TableCell>

                          {/* Source */}
                          <TableCell className="px-4 py-2.5">
                            <span className="text-[11px] text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md font-medium whitespace-nowrap">
                              {lead.source}
                            </span>
                          </TableCell>

                          {/* Status */}
                          <TableCell className="px-4 py-2.5">
                            <span className="status-pip" style={{ background: st.bg, color: st.color }}>
                              {st.label}
                            </span>
                          </TableCell>

                          {/* Contact */}
                          <TableCell className="px-4 py-2.5">
                            {primary ? (
                              <div>
                                <div className="text-xs font-semibold text-slate-700 leading-tight">{primary.name}</div>
                                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                                  <Mail className="h-3 w-3 shrink-0" />
                                  <span className="truncate max-w-30">{primary.email}</span>
                                </div>
                                {primary.phone && (
                                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                    <Phone className="h-3 w-3 shrink-0" />
                                    {primary.phone}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-300 italic">—</span>
                            )}
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="px-4 py-2.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button className="icon-btn" onClick={() => handleViewLead(lead)}>
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                              {lead.isArchived && <Archive className="h-3.5 w-3.5 text-slate-300" />}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      <LeadDetailsModal lead={selectedLead} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}