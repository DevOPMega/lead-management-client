import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Axios from '../../lib/axios';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Building2,
    Globe,
    MapPin,
    Phone,
    Mail,
    Tag,
    Calendar,
    ArrowRight,
    Plus,
    Send,
    Users,
    Briefcase,
    CheckCircle2,
    Circle,
    AlertCircle,
    TrendingUp,
    ChevronRight,
    ExternalLink,
    MoreHorizontal,
    FileText,
    Clock,
    Thermometer,
    MessageCircle,
    Pencil,
    Trash2,
} from 'lucide-react';
import AddRemark from './components/AddRemark';
import { toast } from 'sonner';
import AddFollowUp from './components/AddFollowUp';

const fetchLeadById = async (id) => {
    try {
        const response = await Axios.get(`/leads/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const fetchUpdateRemarks = async ({ id, action, remarkData }) => {
    try {
        const response = await Axios.patch(`/leads/remarks/${id}`, { action, ...remarkData });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const fetchUpdateFollowUp = async ({ id, type, followUpData }) => {
    try {
        const response = await Axios.patch(`/leads/follow-up/${id}`, { type, ...followUpData });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const PIPELINE_STAGES = ['New', 'Contacted', 'Interested', 'Quote Sent', 'Won'];

const stageIndex = (status) =>
    PIPELINE_STAGES.findIndex((s) => s.toLowerCase() === status?.toLowerCase());

function PipelineStage({ status }) {
    const current = stageIndex(status);

    return (
        <div className="flex items-center gap-0 w-full">
            {PIPELINE_STAGES.map((stage, idx) => {
                const isCompleted = idx < current;
                const isActive = idx === current;
                const isLast = idx === PIPELINE_STAGES.length - 1;

                return (
                    <React.Fragment key={stage}>
                        <div className="flex flex-col items-center gap-1.5 flex-1">
                            <div className="relative flex items-center justify-center">
                                {isCompleted ? (
                                    <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center shadow-sm">
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                    </div>
                                ) : isActive ? (
                                    <div className="w-7 h-7 rounded-full bg-indigo-600 ring-4 ring-indigo-100 flex items-center justify-center shadow-sm">
                                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                                    </div>
                                ) : (
                                    <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                                    </div>
                                )}
                            </div>
                            <span
                                className={`text-xs font-medium whitespace-nowrap ${isActive
                                    ? 'text-indigo-600'
                                    : isCompleted
                                        ? 'text-gray-700'
                                        : 'text-gray-400'
                                    }`}
                            >
                                {stage}
                            </span>
                        </div>
                        {!isLast && (
                            <div
                                className={`h-0.5 flex-1 mt-[-14px] transition-colors ${idx < current ? 'bg-indigo-500' : 'bg-gray-200'
                                    }`}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

function InfoRow({ label, value, icon: Icon }) {
    return (
        <div className="flex items-start justify-between py-2.5 group">
            <div className="flex items-center gap-2 text-gray-500 text-sm min-w-[130px]">
                {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
                <span>{label}</span>
            </div>
            <div className="text-sm text-gray-800 font-medium text-right max-w-[200px] break-words">
                {value || <span className="text-gray-300">—</span>}
            </div>
        </div>
    );
}

function TemperatureBadge({ temp }) {
    const map = {
        Hot: 'bg-red-100 text-red-700 border border-red-200',
        Warm: 'bg-amber-100 text-amber-700 border border-amber-200',
        Cold: 'bg-blue-100 text-blue-700 border border-blue-200',
    };
    return (
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${map[temp] || 'bg-gray-100 text-gray-600'}`}>
            {temp}
        </span>
    );
}

function StatusBadge({ status }) {
    const map = {
        'Quote Sent': 'bg-violet-100 text-violet-700 border border-violet-200',
        Won: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
        New: 'bg-gray-100 text-gray-600 border border-gray-200',
        Contacted: 'bg-blue-100 text-blue-700 border border-blue-200',
        Interested: 'bg-amber-100 text-amber-700 border border-amber-200',
    };
    return (
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${map[status] || 'bg-gray-100 text-gray-600'}`}>
            {status}
        </span>
    );
}

function ContactCard({ contact, isHR = false }) {
    return (
        <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-indigo-600">
                            {isHR ? 'HR' : contact.name?.charAt(0) || '?'}
                        </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800 truncate max-w-[160px]">
                        {isHR ? 'HR Contact' : contact.name}
                    </span>
                </div>
                {contact.isPrimary && (
                    <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-200 px-2 py-0.5 rounded-full font-medium">
                        Primary
                    </span>
                )}
            </div>
            <div className="space-y-1 pl-9">
                {contact.phone && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{contact.phone}</span>
                    </div>
                )}
                {contact.email && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="truncate">{contact.email}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="flex h-screen bg-gray-50">
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-9 w-28" />
                </div>
                <div className="flex-1 overflow-auto p-6 flex gap-5">
                    <div className="w-[320px] shrink-0 space-y-4">
                        <Skeleton className="h-48 w-full rounded-xl" />
                        <Skeleton className="h-32 w-full rounded-xl" />
                    </div>
                    <div className="flex-1 space-y-4">
                        <Skeleton className="h-36 w-full rounded-xl" />
                        <Skeleton className="h-48 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DetailLeadPage() {
    const { id } = useParams();
    const [isAddRemarkOpen, setAddRemarkOpen] = useState(false);
    const [isAddFollowUpOpen, setAddFollowUpOpen] = useState(false);
    const [remarkData, setRemarkData] = useState({
        type: "Call",
        remark: "",
        nextFollowUp: new Date()
    });
    const [followUpData, setFollowUpData] = useState({
        action: "",
        scheduledAt: new Date(),
        status: "Upcoming",
    });
    const { data, isFetching, isError, refetch } = useQuery({
        queryKey: ['lead-data-by-id', id],
        queryFn: () => fetchLeadById(id),
        keepPreviousData: true,
    });

    const remarksMutations = useMutation({
        mutationFn: fetchUpdateRemarks,
        onSuccess: (data) => {
            toast(data.message);
            setAddRemarkOpen(false);
            refetch();
        },
        onError: (error) => {
            toast("Failed to update lead remarks!")
        }
    });

    const followUpMutations = useMutation({
        mutationFn: fetchUpdateFollowUp,
        onSuccess: (data) => {
            toast(data.message);
            setAddFollowUpOpen(false);
            refetch();
        },
        onError: (error) => {
            toast("Failed to update lead follow-up!")
        }
    });

    const handleSubmitRemark = () => {
        remarksMutations.mutate({ id, action: "add", remarkData });
    }
    const handleSubmitFollowUp = () => {
        followUpMutations.mutate({ id, type: "add", followUpData });
    }

    const handleRemark = (key, value) => setRemarkData((prev) => ({ ...prev, [key]: value }));
    const handleFollowUp = (key, value) => setFollowUpData((prev) => ({ ...prev, [key]: value }));

    const lead = data?.lead;

    if (isFetching) return <LoadingSkeleton />;

    if (isError) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center space-y-3">
                    <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
                    <p className="text-gray-600 font-medium">Failed to load lead data</p>
                    <Button variant="outline" size="sm" onClick={refetch}>
                        Try again
                    </Button>
                </div>
            </div>
        );
    }

    if (!lead) return null;

    const initials = lead.company
        ?.split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();

    const formattedDate = new Date(lead.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 font-sans">
            {/* Top Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <h1 className="text-lg font-bold text-gray-900 tracking-tight">{lead.company}</h1>
                    <StatusBadge status={lead.status} />
                    {lead.temperature && <TemperatureBadge temp={lead.temperature} />}
                </div>
                <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                    <Send className="w-3.5 h-3.5" />
                    Send Email
                </Button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto p-5 flex gap-5 min-h-0">
                {/* Left Column */}
                <div className="w-[300px] shrink-0 space-y-4">
                    {/* Profile Card */}
                    <Card className="border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 px-5 pt-5 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md">
                                    <span className="text-base font-bold text-white">{initials}</span>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm leading-tight">{lead.company}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{lead.industry}</p>
                                </div>
                            </div>
                        </div>
                        <CardContent className="px-5 py-2 divide-y divide-gray-100">
                            <InfoRow label="Source" value={lead.source} icon={TrendingUp} />
                            <InfoRow label="Source Details" value={lead.sourceDetails} icon={FileText} />
                            <InfoRow label="City" value={lead.city} icon={MapPin} />
                            <InfoRow label="Address" value={lead.address} icon={Building2} />
                            <InfoRow label="Currency" value={lead.currency} icon={Briefcase} />
                            <InfoRow
                                label="Created"
                                value={formattedDate}
                                icon={Calendar}
                            />
                            {lead.website && (
                                <div className="flex items-start justify-between py-2.5">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm min-w-[130px]">
                                        <Globe className="w-3.5 h-3.5 text-gray-400" />
                                        <span>Website</span>
                                    </div>
                                    <a
                                        href={lead.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm text-indigo-600 font-medium flex items-center gap-1 hover:underline"
                                    >
                                        Visit <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    {lead.tags?.length > 0 && (
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="px-5 py-3.5 pb-0">
                                <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Tag className="w-3.5 h-3.5 text-gray-400" /> Tags
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-5 py-3">
                                <div className="flex flex-wrap gap-1.5">
                                    {lead.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-0.5 rounded-full font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column */}
                <div className="flex-1 min-w-0 space-y-4">
                    {/* Pipeline Stage */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="px-6 py-4 pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-semibold text-gray-700">Pipeline Stage</CardTitle>
                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </CardHeader>
                        <CardContent className="px-6 pb-5 pt-4">
                            <PipelineStage status={lead.status} />
                        </CardContent>
                    </Card>

                    {/* Contacts */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="px-6 py-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" /> Contacts
                            </CardTitle>
                            <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5 text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                                <Plus className="w-3 h-3" /> Add
                            </Button>
                        </CardHeader>
                        <CardContent className="px-6 pb-5 pt-0 space-y-2.5">
                            {lead.contacts?.map((contact) => (
                                <ContactCard key={contact._id} contact={contact} />
                            ))}
                            {lead.hrContacts?.map((contact) => (
                                <ContactCard key={contact._id} contact={contact} isHR />
                            ))}
                            {(!lead.contacts?.length && !lead.hrContacts?.length) && (
                                <p className="text-sm text-gray-400 py-2">No contacts added yet.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Remarks */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="px-6 py-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" /> Remarks
                            </CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs gap-1.5 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                onClick={() => setAddRemarkOpen(true)}  // 👈 add this
                            >
                                <Plus className="w-3 h-3" /> Add Remark
                            </Button>
                        </CardHeader>
                        <CardContent className="px-6 pb-5 pt-0">
                            {lead.remarks?.length > 0 ? (
                                <div className="rounded-lg border border-gray-200 overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200">
                                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[140px]">Type</th>
                                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Remark</th>
                                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[200px]">Next Follow-Up</th>
                                                <th className="px-4 py-2.5 w-[80px]" />
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {lead.remarks.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                                    <td className="px-4 py-3 align-top">
                                                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full
                                                            ${item.type === 'Call' ? 'bg-blue-50 text-blue-700' :
                                                                item.type === 'WhatsApp' ? 'bg-green-50 text-green-700' :
                                                                    item.type === 'Email' ? 'bg-violet-50 text-violet-700' :
                                                                        item.type === 'Meeting' ? 'bg-amber-50 text-amber-700' :
                                                                            'bg-gray-100 text-gray-600'}`}>
                                                            {item.type === 'Call' && <Phone className="w-3 h-3" />}
                                                            {item.type === 'WhatsApp' && <MessageCircle className="w-3 h-3" />}
                                                            {item.type === 'Email' && <Mail className="w-3 h-3" />}
                                                            {item.type === 'Meeting' && <Users className="w-3 h-3" />}
                                                            {item.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 align-top text-gray-700 leading-relaxed max-w-[240px]">
                                                        <p className="line-clamp-2">{item.remark || <span className="text-gray-300">—</span>}</p>
                                                    </td>
                                                    <td className="px-4 py-3 align-top">
                                                        {item.nextFollowUp ? (
                                                            <div className="flex items-center gap-1.5 text-gray-600">
                                                                <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                                <span className="text-xs">
                                                                    {new Date(item.nextFollowUp).toLocaleString('en-GB', {
                                                                        day: 'numeric', month: 'short', year: 'numeric',
                                                                        hour: '2-digit', minute: '2-digit'
                                                                    })}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-300 text-xs">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 align-top">
                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button className="p-1.5 rounded-md hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors">
                                                                <Pencil className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-gray-400 py-2">
                                    <Circle className="w-3.5 h-3.5" />
                                    <span className="text-sm">No remarks added yet.</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>


                    {/* Activities */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="px-6 py-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" /> Follow-up
                            </CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs gap-1.5 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                onClick={() => setAddFollowUpOpen(true)}  // 👈 add this
                            >
                                <Plus className="w-3 h-3" /> Add Follow Up
                            </Button>
                        </CardHeader>
                        <CardContent className="px-6 pb-5 pt-0">
                            {lead.followupHistory?.length > 0 ? (
                                <div className="rounded-lg border border-gray-200 overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200">
                                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[140px]">Status</th>
                                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[200px]">Scheduled At</th>
                                                <th className="px-4 py-2.5 w-[80px]" />
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {lead.followupHistory.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                                    <td className="px-4 py-3 align-top">
                                                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full
                                                            ${item.status === 'Upcoming' ? 'bg-blue-50 text-blue-700' :
                                                                item.status === 'No Answer' ? 'bg-green-50 text-green-700' :
                                                                    item.status === 'Responded' ? 'bg-violet-50 text-violet-700' :
                                                                        ''}`}>
                                                            {item.status === 'Upcoming' && <Phone className="w-3 h-3" />}
                                                            {item.status === 'No Answer' && <MessageCircle className="w-3 h-3" />}
                                                            {item.status === 'Responded' && <Mail className="w-3 h-3" />}
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 align-top text-gray-700 leading-relaxed max-w-[240px]">
                                                        <p className="line-clamp-2">{item.action || <span className="text-gray-300">—</span>}</p>
                                                    </td>
                                                    <td className="px-4 py-3 align-top">
                                                        {item.scheduledAt ? (
                                                            <div className="flex items-center gap-1.5 text-gray-600">
                                                                <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                                <span className="text-xs">
                                                                    {new Date(item.scheduledAt).toLocaleString('en-GB', {
                                                                        day: 'numeric', month: 'short', year: 'numeric',
                                                                        hour: '2-digit', minute: '2-digit'
                                                                    })}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-300 text-xs">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 align-top">
                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button className="p-1.5 rounded-md hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors">
                                                                <Pencil className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-gray-400 py-2">
                                    <Circle className="w-3.5 h-3.5" />
                                    <span className="text-sm">No Follow-up added yet.</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            <AddRemark open={isAddRemarkOpen} onOpenChange={setAddRemarkOpen} handleRemark={handleRemark} handleSubmitRemark={handleSubmitRemark} />
            <AddFollowUp open={isAddFollowUpOpen} onOpenChange={setAddFollowUpOpen} handleFollowUp={handleFollowUp} handleSubmitFollowUp={handleSubmitFollowUp} />
        </div>
    );
}