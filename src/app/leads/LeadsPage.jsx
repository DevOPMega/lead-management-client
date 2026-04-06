import React, { useState, useEffect } from 'react';
import Axios from '../../lib/axios';
import { useQuery } from "@tanstack/react-query";
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
import { Badge } from "@/components/ui/badge";
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
  Users,
  Tag,
  Calendar,
  Loader2,
  Eye
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Leads from "@/data/lead-management.leads.json" with { type: 'json' };

const fetchLeads = async (params) => {
  try {
    const response = await Axios.get("/leads", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default function LeadsPage() {
  // Filter states
  const [filters, setFilters] = useState({
    page: 1,
    limit: 50,
    industry: "",
    city: "",
    country: "",
    source: "",
    status: "",
    isArchived: false,
  });
  // Leads data
  const [searchInput, setSearchInput] = useState("");
  const [searchInput1, setSearchInput1] = useState("");

  // const {
  //   data,
  //   isFetching,
  //   isError,
  //   refetch
  // } = useQuery({
  //   queryKey: ["leads-data", filters],
  //   queryFn: () => fetchLeads(filters),
  //   keepPreviousData: true,
  // });

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 50,
      industry: "",
      city: "",
      country: "",
      source: "",
      status: "",
      isArchived: false,
    });
    setSearchInput("");
  };

  // Pagination handlers
  const nextPage = () => {
    // if (data?.pages > filters.page) {
    //   setFilters(prev => ({ ...prev, page: prev.page + 1 }));
    // }
    if (3 > filters.page) {
      setFilters(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const prevPage = () => {
    if (filters.page > 1) {
      setFilters(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  // Status badge colors
  const getStatusBadge = (status) => {
    const statusMap = {
      'new': 'default',
      'contacted': 'secondary',
      'qualified': 'success',
      'proposal-sent': 'warning',
      'negotiation': 'info',
      'won': 'success',
      'lost': 'destructive',
      'not-interested': 'destructive'
    };
    return statusMap[status] || 'default';
  };

  // const leads = data?.leads || [];
  const leads = Leads || [];
  // const totalCount = data?.leadsCount || 0;
  const totalCount = 116;
  // const totalPages = data?.pages || 1;
  const totalPages = 3;

  // if (isError) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-96 gap-4">
  //       <p className="text-red-500">Error loading leads</p>
  //       <Button onClick={() => refetch()} variant="outline">
  //         <RefreshCw className="mr-2 h-4 w-4" /> Retry
  //       </Button>
  //     </div>
  // );
  // }
  const isFetching = false;

  return (
    <div className="mx-auto py-6 px-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your leads across all sources
          </p>
        </div>
        {/* <Button onClick={() => refetch()} variant="outline" disabled={isFetching}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button> */}
      </div>

      {/* Filters Card */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>
            Filter leads by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {/* Industry Filter */}
            <Select
              value={filters.industry}
              onValueChange={(value) => handleFilterChange("industry", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Industries</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Real Estate">Real Estate</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            {/* Source Filter */}
            <Select
              value={filters.source}
              onValueChange={(value) => handleFilterChange("source", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Sources</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="Cold Call">Cold Call</SelectItem>
                <SelectItem value="Email Campaign">Email Campaign</SelectItem>
                <SelectItem value="Ads">Ads</SelectItem>
                <SelectItem value="Event">Event</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposal-sent">Proposal Sent</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="not-interested">Not Interested</SelectItem>
              </SelectContent>
            </Select>

            {/* City Filter */}
            <Input
              placeholder="Filter by city..."
              value={filters.city}
              onChange={(e) => handleFilterChange("city", e.target.value)}
              className="w-full"
            />

            {/* Country Filter */}
            <Input
              placeholder="Filter by country..."
              value={filters.country}
              onChange={(e) => handleFilterChange("country", e.target.value)}
              className="w-full"
            />

            {/* Archived Toggle */}
            <Select
              value={filters.isArchived.toString()}
              onValueChange={(value) => handleFilterChange("isArchived", value === "true")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Archived Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Active Only</SelectItem>
                <SelectItem value="true">Archived Only</SelectItem>
                <SelectItem value="All">All (Active + Archived)</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            <Button variant="outline" onClick={clearFilters} className="w-30">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Bar */}
      <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
        <div>
          Showing {leads.length} of {totalCount} leads
          {/* {isFetching && <Loader2 className="inline ml-2 h-3 w-3 animate-spin" />} */}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            // disabled={filters.page === 1 || isFetching}
            disabled={filters.page === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="py-2 px-3 text-sm">
            Page {filters.page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            // disabled={filters.page === totalPages || isFetching}
            disabled={filters.page === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-62.5">Lead / Company</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Primary Contact</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isFetching && !leads.length ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p className="text-muted-foreground">Loading leads...</p>
                    </TableCell>
                  </TableRow>
                ) : leads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <Building2 className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">No leads found</p>
                      <Button variant="link" onClick={clearFilters} className="mt-2">
                        Clear filters
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  leads.map((lead) => (
                    <TableRow key={lead._id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{lead.name}</div>
                          {lead.website && (
                            <a
                              href={lead.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline block truncate max-w-50"
                            >
                              {lead.website.replace(/^https?:\/\//, '')}
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex gap-1 w-fit">
                          <Briefcase className="h-3 w-3" />
                          {lead.industry}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {lead.city}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {lead.country}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {lead.source}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(lead.status)}>
                          {lead.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {lead.contacts?.find(c => c.isPrimary) ? (
                          <div className="text-sm">
                            <div className="font-medium">
                              {lead.contacts.find(c => c.isPrimary).name}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span className="truncate max-w-30">
                                  {lead.contacts.find(c => c.isPrimary).email}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {lead.contacts.find(c => c.isPrimary).phone || 'N/A'}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No primary contact</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {lead.tags?.slice(0, 2).map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              <Tag className="h-2 w-2 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {lead.tags?.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{lead.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {lead.isArchived && (
                            <Archive className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}