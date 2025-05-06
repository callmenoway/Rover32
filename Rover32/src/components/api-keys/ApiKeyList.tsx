"use client";

import { useState, useEffect } from "react";
import { Copy, Key, Plus, Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Skeleton } from "@/src/components/ui/skeleton";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/src/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { EmptyState } from "@/src/components/EmptyState";
import { toast } from "sonner";
// Interface for API key data
interface ApiKey {
  id: string;
  name: string;
  createdAt: string;
  lastUsed?: string;
  key?: string; // Only present after creation
}

export function ApiKeyList() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newApiKey, setNewApiKey] = useState<ApiKey | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load API keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  // Function to fetch API keys
  const fetchApiKeys = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/api-keys");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch API keys");
      }

      setApiKeys(data.apiKeys || []);
    } catch (error) {
      console.error("Error fetching API keys:", error);
      setError((error as Error).message || "Failed to fetch API keys");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to create a new API key
  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      // toast({
      //   title: "Error",
      //   description: "API key name is required",
      //   variant: "destructive",
      // });
      toast.error('API key name is required');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newKeyName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create API key");
      }

      // Store the newly created key to display it
      setNewApiKey(data.apiKey);
      
      // Clear the form and fetch the updated list (without the actual key value)
      setNewKeyName("");
      fetchApiKeys();
      
      // toast({
      //   title: "Success",
      //   description: "API key created successfully",
      // });
      toast.success('API key created successfully');

    } catch (error) {
      console.error("Error creating API key:", error);
      // toast({
      //   title: "Error",
      //   description: (error as Error).message || "Failed to create API key",
      //   variant: "destructive",
      // });
      toast.error('Failed to create API key');

    } finally {
      setIsCreating(false);
    }
  };

  // Function to delete an API key
  const deleteApiKey = async (id: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/api-keys/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete API key");
      }

      // Update the local state by removing the deleted key
      setApiKeys(apiKeys.filter(key => key.id !== id));
      
      // toast({
      //   title: "Success",
      //   description: "API key deleted successfully",
      // });
      toast.success('API key deleted successfully');

    } catch (error) {
      console.error("Error deleting API key:", error);
      // toast({
      //   title: "Error",
      //   description: (error as Error).message || "Failed to delete API key",
      //   variant: "destructive",
      // });
      toast.error('Failed to delete API key');

    } finally {
      setIsDeleting(false);
    }
  };

  // Function to copy API key to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // toast({
    //   title: "Copied",
    //   description: "API key copied to clipboard",
    // });
    toast.info('API key copied to clipboard');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">Your API Keys</h2>
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-[150px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <EmptyState
        title="Error loading API keys"
        description={error}
        action={
          <Button onClick={() => fetchApiKeys()}>Retry</Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your API Keys</h2>
          <p className="text-muted-foreground mt-1">
            Manage API keys to access your Rover32 vehicles
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Give your API key a descriptive name to remember where it&apos;s used.
              </DialogDescription>
            </DialogHeader>
            
            {!newApiKey ? (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">API Key Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., Mobile App, Home Assistant" 
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-md bg-muted p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">API Key</p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(newApiKey.key || "")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="mt-1 break-all text-xs">{newApiKey.key}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Make sure to copy your API key now. You won&apos;t be able to see it again!
                </p>
              </div>
            )}
            
            <DialogFooter>
              <Button 
                onClick={() => {
                  if (newApiKey) {
                    setNewApiKey(null);
                    setIsDialogOpen(false);
                  } else {
                    createApiKey();
                  }
                }}
                disabled={isCreating && !newApiKey}
              >
                {isCreating && !newApiKey ? (
                  "Creating..."
                ) : newApiKey ? (
                  "Done"
                ) : (
                  "Create Key"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {apiKeys.length === 0 ? (
        <EmptyState
          title="No API keys found"
          description="You haven't created any API keys yet. API keys allow your applications to access your Rover32 vehicles."
          action={
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create API Key
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6">
          {apiKeys.map((apiKey) => (
            <Card key={apiKey.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">{apiKey.name}</CardTitle>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the
                          API key and may break applications using it.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteApiKey(apiKey.id)}
                          className="bg-destructive text-destructive-foreground"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <CardDescription>
                  Created on {new Date(apiKey.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <Key className="h-4 w-4 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-muted-foreground">
                      ID: <span className="font-mono">{apiKey.id}</span>
                    </p>
                    {apiKey.lastUsed && (
                      <p className="text-sm text-muted-foreground">
                        Last used: {new Date(apiKey.lastUsed).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
