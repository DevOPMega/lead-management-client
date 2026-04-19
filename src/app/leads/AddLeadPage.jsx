import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";

import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Building2, Globe, Briefcase, MapPin, ChevronRight,
  Plus, Trash2, User, Phone, Mail, Link2, Users,
  Thermometer, Star, Tag, FileText, CheckCircle2,
  AlertCircle, Loader2, ArrowLeft, X, Hash,
  UserCheck, Shield,
} from "lucide-react";
import Axios from "../../lib/axios";

// ─── Constants ───────────────────────────────────────────────────────────────
const Industry = [
  "IT","Finance","HealthCare","Construction","Hospitality & Tourism",
  "Logistic","Transport","Real Estate","Bank & Finance","Retail",
  "E-Commerce","Consulting","Oil & Gas","Cleaning","Security",
  "Manufacturing","Education","Restaurants & Cafe","Clinics","Others",
];
const Source = ["LinkedIn","Website","Facebook","X","Instagram","Ads","Others"];
const Temperature = { cold: "Cold", warm: "Warm", hot: "Hot" };

// ─── Joi Schema ───────────────────────────────────────────────────────────────
const CreateLeadSchema = Joi.object({
  company: Joi.string().min(2).required().messages({
    "string.base": "Company must be a string",
    "string.min": "Company must be at least 2 characters",
    "any.required": "Company is required",
    "string.empty": "Company is required",
  }),
  website: Joi.string().uri({ allowRelative: true }).allow("").optional(),
  industry: Joi.string().valid(...Industry).optional().allow(""),
  address: Joi.string().allow("").optional(),
  city: Joi.string().allow("").optional(),
  emirate: Joi.string().allow("").optional(),
  country: Joi.string().allow("").optional(),
  source: Joi.string().valid(...Source).optional().allow(""),
  sourceDetails: Joi.string().allow("").optional(),
  contacts: Joi.array().items(Joi.object({
    name: Joi.string().allow("").optional(),
    designation: Joi.string().allow("").optional(),
    phone: Joi.string().allow("").optional(),
    email: Joi.string().email({ tlds: { allow: false } }).allow("").optional(),
    isPrimary: Joi.bool().default(false),
  })).optional(),
  hrContacts: Joi.array().items(Joi.object({
    name: Joi.string().allow("").optional(),
    phone: Joi.string().allow("").optional(),
    email: Joi.string().email({ tlds: { allow: false } }).allow("").optional(),
  })).optional(),
  temperature: Joi.string().valid(...Object.values(Temperature)).default("Warm"),
  score: Joi.number().min(0).max(100).optional().default(0),
  tags: Joi.array().items(Joi.string()).optional(),
  remarks: Joi.string().allow("").optional(),
  linkedinURL: Joi.string().allow("").optional(),
  companySize: Joi.string().allow("").optional(),
});

// ─── API ──────────────────────────────────────────────────────────────────────
const fetchCreateLead = async (formData) => {
  const response = await Axios.post("/leads/create-lead", formData);
  return response.data;
};

// ─── Small helpers ────────────────────────────────────────────────────────────
const FieldError = ({ msg }) =>
  msg ? (
    <p className="flex items-center gap-1 text-[11px] text-red-500 mt-1 font-medium">
      <AlertCircle className="h-3 w-3 shrink-0" />
      {msg}
    </p>
  ) : null;

const SectionHeading = ({ icon: Icon, title, description, accent = "#3b82f6" }) => (
  <div className="flex items-start gap-3 mb-5">
    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
      style={{ background: `${accent}14` }}>
      <Icon className="w-4 h-4" style={{ color: accent }} />
    </div>
    <div>
      <h3 className="text-sm font-semibold text-slate-800 leading-tight">{title}</h3>
      {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
    </div>
  </div>
);

const FormField = ({ label, required, error, children, hint }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </Label>
    {children}
    {hint && !error && <p className="text-[11px] text-slate-400">{hint}</p>}
    <FieldError msg={error} />
  </div>
);

const inputCls = (hasError) =>
  `h-9 text-sm border-slate-200 bg-white focus-visible:ring-1 focus-visible:ring-blue-400 focus-visible:border-blue-400 placeholder:text-slate-300 transition-colors ${
    hasError ? "border-red-300 focus-visible:ring-red-300 bg-red-50/30" : ""
  }`;

// ─── Temperature selector ─────────────────────────────────────────────────────
const tempConfig = {
  Cold: { color: "#0ea5e9", bg: "#f0f9ff", icon: "❄️" },
  Warm: { color: "#f59e0b", bg: "#fffbeb", icon: "☀️" },
  Hot:  { color: "#ef4444", bg: "#fff1f2", icon: "🔥" },
};

// ─── Tag input ────────────────────────────────────────────────────────────────
const TagInput = ({ value = [], onChange }) => {
  const [input, setInput] = useState("");
  const add = () => {
    const t = input.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setInput("");
  };
  const remove = (tag) => onChange(value.filter((v) => v !== tag));
  return (
    <div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Type a tag and press Enter…"
          className={inputCls(false) + " flex-1"}
        />
        <Button type="button" variant="outline" size="sm" onClick={add}
          className="h-9 px-3 border-slate-200 text-slate-600 hover:bg-slate-50">
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {value.map((tag) => (
            <span key={tag}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-medium">
              {tag}
              <button type="button" onClick={() => remove(tag)}
                className="text-blue-400 hover:text-blue-700 transition-colors">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Score Slider ─────────────────────────────────────────────────────────────
const ScoreInput = ({ value = 0, onChange }) => {
  const pct = value;
  const color = pct < 33 ? "#ef4444" : pct < 66 ? "#f59e0b" : "#10b981";
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">Lead Score</span>
        <span className="text-sm font-bold" style={{ color }}>{value}/100</span>
      </div>
      <input type="range" min={0} max={100} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} ${pct}%, #e2e8f0 ${pct}%)`,
          accentColor: color,
        }}
      />
      <div className="flex justify-between text-[10px] text-slate-300 font-medium">
        <span>Cold</span><span>Warm</span><span>Hot</span>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AddLeadPage() {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm({
    mode: "all",
    resolver: joiResolver(CreateLeadSchema),
    defaultValues: {
      company: "",
      website: "",
      industry: "",
      address: "",
      city: "",
      emirate: "",
      country: "",
      source: "",
      sourceDetails: "",
      contacts: [{ name: "", designation: "", phone: "", email: "", isPrimary: true }],
      hrContacts: [{ name: "", phone: "", email: "" }],
      temperature: "Warm",
      score: 0,
      tags: [],
      remarks: "",
      linkedinURL: "",
      companySize: "",
    },
  });

  const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({ control, name: "contacts" });
  const { fields: hrFields, append: appendHr, remove: removeHr } = useFieldArray({ control, name: "hrContacts" });

  const temperature = watch("temperature");
  const tags = watch("tags");
  const score = watch("score");

  const createLeadMutation = useMutation({
    mutationFn: fetchCreateLead,
    onSuccess: () => {
      setSubmitSuccess(true);
      setSubmitError("");
      reset();
    },
    onError: (error) => {
      setSubmitError(error?.response?.data?.message || "Something went wrong. Please try again.");
    },
  });

  const onSubmit = (formData) => {
    setSubmitError("");
    setSubmitSuccess(false);
    // Clean empty strings from optional fields
    const cleaned = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
    );
    createLeadMutation.mutate(cleaned);
  };

  const isPending = isSubmitting || createLeadMutation.isPending;

  return (
    <div className="flex flex-col items-center" style={{ background: "#f8fafc", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        .add-lead * { font-family: 'Plus Jakarta Sans', sans-serif !important; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: currentColor; cursor: pointer; border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.15); }
        .field-animate { animation: fieldIn 0.2s ease; }
        @keyframes fieldIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .section-card { transition: box-shadow 0.2s; }
        .section-card:focus-within { box-shadow: 0 0 0 2px #3b82f620, 0 4px 20px rgba(0,0,0,0.06); }
        .temp-btn { transition: all 0.15s; }
        .temp-btn:hover { transform: translateY(-1px); }
        .contact-row { animation: fieldIn 0.18s ease; }
      `}</style>

      <div className="add-lead px-4 sm:px-6 py-6 space-y-5">

        {/* ── Page Header ── */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-tight">Add New Lead</h1>
              <p className="text-xs text-slate-400 mt-0.5">Fill in the details to create a new lead in the system</p>
            </div>
          </div>
          <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <span>Leads</span><ChevronRight className="h-3 w-3" /><span className="text-blue-600 font-semibold">Add Lead</span>
          </nav>
        </div>

        {/* ── Success / Error banners ── */}
        {submitSuccess && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Lead created successfully!
          </div>
        )}
        {submitError && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

          {/* ── SECTION 1: Company Info ── */}
          <Card className="section-card border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="px-5 py-4 bg-white border-b border-slate-100">
              <SectionHeading icon={Building2} title="Company Information" description="Core details about the lead company" accent="#3b82f6" />
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Company */}
                <div className="lg:col-span-2">
                  <FormField label="Company Name" required error={errors.company?.message}>
                    <Input {...register("company")} placeholder="e.g. Acme Corporation"
                      className={inputCls(!!errors.company)} />
                  </FormField>
                </div>

                {/* Company Size */}
                <FormField label="Company Size" error={errors.companySize?.message}>
                  <Input {...register("companySize")} placeholder="e.g. 50–200 employees"
                    className={inputCls(!!errors.companySize)} />
                </FormField>

                {/* Website */}
                <FormField label="Website" error={errors.website?.message}>
                  <div className="relative">
                    <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                    <Input {...register("website")} placeholder="https://example.com"
                      className={inputCls(!!errors.website) + " pl-8"} />
                  </div>
                </FormField>

                {/* LinkedIn */}
                <FormField label="LinkedIn URL" error={errors.linkedinURL?.message}>
                  <div className="relative">
                    <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                    <Input {...register("linkedinURL")} placeholder="linkedin.com/company/…"
                      className={inputCls(!!errors.linkedinURL) + " pl-8"} />
                  </div>
                </FormField>

                {/* Industry */}
                <FormField label="Industry" error={errors.industry?.message}>
                  <Controller name="industry" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={inputCls(!!errors.industry)}>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent className="max-h-56">
                        {Industry.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )} />
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* ── SECTION 2: Location ── */}
          <Card className="section-card border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="px-5 py-4 bg-white border-b border-slate-100">
              <SectionHeading icon={MapPin} title="Location" description="Where is this company based?" accent="#10b981" />
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="sm:col-span-2 lg:col-span-4">
                  <FormField label="Address" error={errors.address?.message}>
                    <Input {...register("address")} placeholder="Street address or PO Box"
                      className={inputCls(!!errors.address)} />
                  </FormField>
                </div>
                <FormField label="City" error={errors.city?.message}>
                  <Input {...register("city")} placeholder="Dubai" className={inputCls(!!errors.city)} />
                </FormField>
                <FormField label="Emirate" error={errors.emirate?.message}>
                  <Input {...register("emirate")} placeholder="Dubai" className={inputCls(!!errors.emirate)} />
                </FormField>
                <FormField label="Country" error={errors.country?.message}>
                  <Input {...register("country")} placeholder="UAE" className={inputCls(!!errors.country)} />
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* ── SECTION 3: Source ── */}
          <Card className="section-card border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="px-5 py-4 bg-white border-b border-slate-100">
              <SectionHeading icon={Hash} title="Lead Source" description="How was this lead acquired?" accent="#8b5cf6" />
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Source" error={errors.source?.message}>
                  <Controller name="source" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={inputCls(!!errors.source)}>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        {Source.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )} />
                </FormField>
                <FormField label="Source Details" error={errors.sourceDetails?.message}
                  hint="e.g. Campaign name, referrer name">
                  <Input {...register("sourceDetails")} placeholder="Additional source info"
                    className={inputCls(!!errors.sourceDetails)} />
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* ── SECTION 4: Contacts ── */}
          <Card className="section-card border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="px-5 py-4 bg-white border-b border-slate-100">
              <div className="flex items-center justify-between">
                <SectionHeading icon={User} title="Contacts" description="Key people at this company" accent="#f59e0b" />
                <Button type="button" variant="outline" size="sm"
                  onClick={() => appendContact({ name: "", designation: "", phone: "", email: "", isPrimary: false })}
                  className="h-8 text-xs gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50 shrink-0">
                  <Plus className="h-3.5 w-3.5" /> Add Contact
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {contactFields.map((field, index) => (
                <div key={field.id} className="contact-row relative rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                        <span className="text-[11px] font-bold text-amber-600">{index + 1}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-600">
                        {index === 0 ? "Primary Contact" : `Contact ${index + 1}`}
                      </span>
                      {index === 0 && (
                        <Badge variant="outline" className="text-[10px] px-2 py-0 border-amber-200 text-amber-600 bg-amber-50">
                          Primary
                        </Badge>
                      )}
                    </div>
                    {contactFields.length > 1 && (
                      <button type="button" onClick={() => removeContact(index)}
                        className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <FormField label="Name" error={errors.contacts?.[index]?.name?.message}>
                      <Input {...register(`contacts.${index}.name`)} placeholder="Full name"
                        className={inputCls(!!errors.contacts?.[index]?.name)} />
                    </FormField>
                    <FormField label="Designation" error={errors.contacts?.[index]?.designation?.message}>
                      <Input {...register(`contacts.${index}.designation`)} placeholder="e.g. CEO"
                        className={inputCls(!!errors.contacts?.[index]?.designation)} />
                    </FormField>
                    <FormField label="Phone" error={errors.contacts?.[index]?.phone?.message}>
                      <div className="relative">
                        <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                        <Input {...register(`contacts.${index}.phone`)} placeholder="+971 50 000 0000"
                          className={inputCls(!!errors.contacts?.[index]?.phone) + " pl-8"} />
                      </div>
                    </FormField>
                    <FormField label="Email" error={errors.contacts?.[index]?.email?.message}>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                        <Input {...register(`contacts.${index}.email`)} placeholder="email@company.com" type="email"
                          className={inputCls(!!errors.contacts?.[index]?.email) + " pl-8"} />
                      </div>
                    </FormField>
                  </div>
                  <input type="hidden" {...register(`contacts.${index}.isPrimary`)} value={index === 0} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ── SECTION 5: HR Contacts ── */}
          <Card className="section-card border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="px-5 py-4 bg-white border-b border-slate-100">
              <div className="flex items-center justify-between">
                <SectionHeading icon={UserCheck} title="HR Contacts" description="Human resources team members" accent="#06b6d4" />
                <Button type="button" variant="outline" size="sm"
                  onClick={() => appendHr({ name: "", phone: "", email: "" })}
                  className="h-8 text-xs gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50 shrink-0">
                  <Plus className="h-3.5 w-3.5" /> Add HR
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {hrFields.map((field, index) => (
                <div key={field.id} className="contact-row relative rounded-xl border border-slate-100 bg-cyan-50/30 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center">
                        <span className="text-[11px] font-bold text-cyan-600">{index + 1}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-600">HR Contact {index + 1}</span>
                    </div>
                    {hrFields.length > 1 && (
                      <button type="button" onClick={() => removeHr(index)}
                        className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <FormField label="Name" error={errors.hrContacts?.[index]?.name?.message}>
                      <Input {...register(`hrContacts.${index}.name`)} placeholder="HR manager name"
                        className={inputCls(!!errors.hrContacts?.[index]?.name)} />
                    </FormField>
                    <FormField label="Phone" error={errors.hrContacts?.[index]?.phone?.message}>
                      <div className="relative">
                        <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                        <Input {...register(`hrContacts.${index}.phone`)} placeholder="+971 50 000 0000"
                          className={inputCls(!!errors.hrContacts?.[index]?.phone) + " pl-8"} />
                      </div>
                    </FormField>
                    <FormField label="Email" error={errors.hrContacts?.[index]?.email?.message}>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                        <Input {...register(`hrContacts.${index}.email`)} placeholder="hr@company.com" type="email"
                          className={inputCls(!!errors.hrContacts?.[index]?.email) + " pl-8"} />
                      </div>
                    </FormField>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* ── SECTION 6: Lead Intelligence ── */}
          <Card className="section-card border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="px-5 py-4 bg-white border-b border-slate-100">
              <SectionHeading icon={Thermometer} title="Lead Intelligence" description="Qualification signals and scoring" accent="#ef4444" />
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Temperature */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Temperature</Label>
                  <div className="flex gap-2">
                    {Object.entries(tempConfig).map(([key, cfg]) => {
                      const active = temperature === key;
                      return (
                        <button key={key} type="button"
                          onClick={() => setValue("temperature", key, { shouldValidate: true })}
                          className="temp-btn flex-1 flex flex-col items-center gap-1 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all"
                          style={{
                            borderColor: active ? cfg.color : "#e2e8f0",
                            background: active ? cfg.bg : "white",
                            color: active ? cfg.color : "#94a3b8",
                            boxShadow: active ? `0 0 0 2px ${cfg.color}30` : "none",
                          }}>
                          <span className="text-base">{cfg.icon}</span>
                          {key}
                        </button>
                      );
                    })}
                  </div>
                  {errors.temperature && <FieldError msg={errors.temperature.message} />}
                </div>

                {/* Score */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Lead Score</Label>
                  <div className="bg-slate-50 rounded-xl border border-slate-100 px-4 py-3">
                    <Controller name="score" control={control} render={({ field }) => (
                      <ScoreInput value={field.value} onChange={field.onChange} />
                    )} />
                  </div>
                </div>

                {/* Tags */}
                <div className="lg:col-span-2 space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Tags</Label>
                  <Controller name="tags" control={control} render={({ field }) => (
                    <TagInput value={field.value || []} onChange={field.onChange} />
                  )} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── SECTION 7: Remarks ── */}
          <Card className="section-card border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="px-5 py-4 bg-white border-b border-slate-100">
              <SectionHeading icon={FileText} title="Remarks" description="Internal notes about this lead" accent="#64748b" />
            </CardHeader>
            <CardContent className="p-5">
              <Textarea {...register("remarks")} placeholder="Add any internal notes, observations, or context about this lead…"
                rows={4}
                className="resize-none text-sm border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-400 focus-visible:border-blue-400 placeholder:text-slate-300" />
              {errors.remarks && <FieldError msg={errors.remarks.message} />}
            </CardContent>
          </Card>

          {/* ── FOOTER ACTIONS ── */}
          <div className="flex items-center justify-between pt-1 pb-6">
            <Button type="button" variant="ghost" onClick={() => reset()}
              disabled={isPending}
              className="text-slate-500 hover:text-slate-800 text-sm gap-1.5">
              <X className="h-4 w-4" />
              Reset Form
            </Button>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline"
                className="text-sm border-slate-200 text-slate-600 hover:bg-slate-50 h-10 px-5">
                Save Draft
              </Button>
              <Button type="submit" disabled={isPending}
                className="h-10 px-6 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 gap-2 rounded-xl">
                {isPending ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</>
                ) : (
                  <><CheckCircle2 className="h-4 w-4" /> Create Lead</>
                )}
              </Button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}