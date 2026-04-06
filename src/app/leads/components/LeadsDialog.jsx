import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  Tag,
  Calendar,
  Globe,
  Users,
  UserCircle,
  Clock,
  TrendingUp,
  Archive,
  Link2,
  FileText,
  Activity,
  DollarSign,
  Thermometer,
  Star,
  X,
  Copy,
  Check
} from "lucide-react";

const LeadDetailsModal = ({ lead, isOpen, onClose }) => {
  const [copiedField, setCopiedField] = React.useState(null);

  if (!lead) return null;

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getStatusColor = (status) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800',
      'contacted': 'bg-yellow-100 text-yellow-800',
      'qualified': 'bg-green-100 text-green-800',
      'proposal-sent': 'bg-purple-100 text-purple-800',
      'negotiation': 'bg-orange-100 text-orange-800',
      'won': 'bg-emerald-100 text-emerald-800',
      'lost': 'bg-red-100 text-red-800',
      'not-interested': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTemperatureColor = (temperature) => {
    const colors = {
      'hot': 'text-red-600',
      'warm': 'text-orange-600',
      'cold': 'text-blue-600'
    };
    return colors[temperature] || 'text-gray-600';
  };

  const getTemperatureIcon = (temperature) => {
    switch(temperature) {
      case 'hot': return <TrendingUp className="h-4 w-4" />;
      case 'warm': return <Activity className="h-4 w-4" />;
      case 'cold': return <Thermometer className="h-4 w-4" />;
      default: return <Thermometer className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start pr-6">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                {lead.name}
                {lead.isArchived && (
                  <Badge variant="secondary" className="ml-2">
                    <Archive className="h-3 w-3 mr-1" />
                    Archived
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription className="mt-1">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4" />
                  {lead.company}
                  {lead.website && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <a 
                        href={lead.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Globe className="h-3 w-3" />
                        Visit Website
                      </a>
                    </>
                  )}
                </div>
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 absolute right-4 top-4"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="hr-contacts">HR Contacts</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Status and Score Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Activity className="h-4 w-4" />
                  Status
                </div>
                <Badge className={`${getStatusColor(lead.status)} text-sm px-3 py-1`}>
                  {lead.status?.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  {getTemperatureIcon(lead.temperature)}
                  Temperature
                </div>
                <div className={`font-semibold capitalize ${getTemperatureColor(lead.temperature)}`}>
                  {lead.temperature}
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Star className="h-4 w-4" />
                  Score
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{lead.score || 0}</span>
                  <span className="text-sm text-muted-foreground">/ 100</span>
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Company Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Industry</div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    {lead.industry}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Company Size</div>
                  <div>{lead.companySize || 'Not specified'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Location</div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {lead.city}, {lead.country}
                  </div>
                  {lead.address && (
                    <div className="text-sm text-muted-foreground mt-1 ml-6">
                      {lead.address}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Currency</div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    {lead.currency}
                  </div>
                </div>
              </div>
            </div>

            {/* Source Information */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                Source Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Source</div>
                  <Badge variant="secondary">{lead.source}</Badge>
                </div>
                {lead.sourceDetails && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Source Details</div>
                    <div>{lead.sourceDetails}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {lead.tags?.length > 0 ? (
                      lead.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No tags</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">LinkedIn URL</div>
                  {lead.linkedinUrl ? (
                    <a 
                      href={lead.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                    >
                      <Link2 className="h-3 w-3" />
                      View LinkedIn Profile
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">Not provided</span>
                  )}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Remarks</div>
                  <div className="text-sm">{lead.remarks || 'No remarks'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Converted to Customer</div>
                  <Badge variant={lead.isConverted ? "success" : "secondary"}>
                    {lead.isConverted ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Timeline
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">{formatDate(lead.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="text-sm">{formatDate(lead.updatedAt)}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-4 mt-4">
            {lead.contacts?.length > 0 ? (
              lead.contacts.map((contact, idx) => (
                <div key={contact._id || idx} className="bg-muted/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-5 w-5" />
                      <h3 className="font-semibold">{contact.name}</h3>
                      {contact.isPrimary && (
                        <Badge variant="default" className="ml-2">Primary</Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {contact.email && (
                      <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{contact.email}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(contact.email, `email-${idx}`)}
                        >
                          {copiedField === `email-${idx}` ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{contact.phone}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(contact.phone, `phone-${idx}`)}
                        >
                          {copiedField === `phone-${idx}` ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No contacts available</p>
              </div>
            )}
          </TabsContent>

          {/* HR Contacts Tab */}
          <TabsContent value="hr-contacts" className="space-y-4 mt-4">
            {lead.hrContacts?.length > 0 ? (
              lead.hrContacts.map((contact, idx) => (
                <div key={contact._id || idx} className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    HR Contact {idx + 1}
                  </h3>
                  <div className="space-y-2">
                    {contact.email && (
                      <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{contact.email}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(contact.email, `hr-email-${idx}`)}
                        >
                          {copiedField === `hr-email-${idx}` ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{contact.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No HR contacts available</p>
              </div>
            )}
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-4 mt-4">
            {lead.activities?.length > 0 ? (
              lead.activities.map((activity, idx) => (
                <div key={idx} className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{activity.type || 'Activity'}</h4>
                        {activity.date && (
                          <span className="text-xs text-muted-foreground">
                            {formatDate(activity.date)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm">{activity.description || 'No description'}</p>
                      {activity.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{activity.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No activities recorded</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailsModal;