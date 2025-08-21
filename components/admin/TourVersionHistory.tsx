"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  History, 
  RotateCcw, 
  Save, 
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface Version {
  id: string;
  version_number: number;
  created_at: string;
  created_by?: string;
  change_notes?: string;
  is_restore_point?: boolean;
  version_data: any;
}

interface TourVersionHistoryProps {
  tourId: string;
  tourTitle?: string;
  onRestore?: (version: Version) => void;
}

export function TourVersionHistory({ tourId, tourTitle, onRestore }: TourVersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch version history
  useEffect(() => {
    fetchVersions();
  }, [tourId]);

  const fetchVersions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/admin/tours/${tourId}/versions`);
      const data = await response.json();
      
      if (response.ok) {
        setVersions(data.versions || []);
      } else {
        setError(data.error || 'Failed to fetch version history');
      }
    } catch (err) {
      setError('Failed to fetch version history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (version: Version) => {
    if (!confirm(`Are you sure you want to restore to version ${version.version_number}? This will create a restore point of the current state.`)) {
      return;
    }

    setIsRestoring(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/admin/tours/${tourId}/versions/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ versionNumber: version.version_number }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        // Refresh version list
        fetchVersions();
        // Call parent callback if provided
        if (onRestore) {
          onRestore(version);
        }
      } else {
        setError(data.error || 'Failed to restore version');
      }
    } catch (err) {
      setError('Failed to restore version');
    } finally {
      setIsRestoring(false);
    }
  };

  const toggleExpanded = (versionId: string) => {
    setExpandedVersion(expandedVersion === versionId ? null : versionId);
  };

  const getChangeSummary = (version: Version, previousVersion?: Version) => {
    if (!previousVersion) return 'Initial version';
    
    const changes: string[] = [];
    const current = version.version_data;
    const previous = previousVersion.version_data;
    
    // Check for major field changes
    if (current.title !== previous.title) changes.push('Title');
    if (current.description !== previous.description) changes.push('Description');
    if (current.price !== previous.price) changes.push('Price');
    if (current.category !== previous.category) changes.push('Category');
    if (JSON.stringify(current.structured_itinerary) !== JSON.stringify(previous.structured_itinerary)) changes.push('Itinerary');
    if (JSON.stringify(current.structured_faqs) !== JSON.stringify(previous.structured_faqs)) changes.push('FAQs');
    
    return changes.length > 0 ? `Changed: ${changes.join(', ')}` : 'Minor updates';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Loading version history...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5" />
            <CardTitle>Version History</CardTitle>
          </div>
          <Badge variant="outline">
            {versions.length} version{versions.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        <CardDescription>
          View and restore previous versions of {tourTitle || 'this tour'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {successMessage && (
          <Alert className="mb-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {versions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No version history available yet.</p>
            <p className="text-sm mt-2">Versions will be created automatically when you save changes.</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {versions.map((version, index) => {
                const isExpanded = expandedVersion === version.id;
                const previousVersion = versions[index + 1];
                const changeSummary = getChangeSummary(version, previousVersion);
                
                return (
                  <div
                    key={version.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={version.is_restore_point ? "destructive" : "default"}>
                            Version {version.version_number}
                          </Badge>
                          {version.is_restore_point && (
                            <Badge variant="outline" className="bg-orange-50">
                              Restore Point
                            </Badge>
                          )}
                          {index === 0 && (
                            <Badge variant="outline" className="bg-green-50">
                              Current
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                          </div>
                          {version.created_by && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <User className="h-3 w-3" />
                              {version.created_by}
                            </div>
                          )}
                          <div className="font-medium text-sm">
                            {version.change_notes || changeSummary}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {index !== 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRestore(version)}
                            disabled={isRestoring}
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Restore
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleExpanded(version.id)}
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="text-sm space-y-2">
                          <div>
                            <span className="font-semibold">Title:</span> {version.version_data.title}
                          </div>
                          <div>
                            <span className="font-semibold">Category:</span> {version.version_data.category}
                          </div>
                          <div>
                            <span className="font-semibold">Price:</span> R{version.version_data.price}
                          </div>
                          <div>
                            <span className="font-semibold">Status:</span> {version.version_data.status || 'published'}
                          </div>
                          <details className="cursor-pointer">
                            <summary className="font-semibold">Full Data (JSON)</summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                              {JSON.stringify(version.version_data, null, 2)}
                            </pre>
                          </details>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Save className="h-3 w-3" />
              <span>Versions are created automatically on save</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={fetchVersions}
            >
              Refresh
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
