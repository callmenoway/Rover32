"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Activity, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
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
} from "@/src/components/ui/alert";
import { Vehicle, VehicleStatus } from "@/src/types";
import { toast } from "sonner";

interface VehicleCardProps {
  vehicle: Vehicle;
}

//? Componente per visualizzare la card di un singolo veicolo
export function VehicleCard({ vehicle }: VehicleCardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<VehicleStatus>("unknown");
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    checkStatus();
    //? Configura un intervallo per controllare lo stato ogni 30 secondi
    const interval = setInterval(checkStatus, 30000);

    return () => clearInterval(interval);
  }, [vehicle.id]);

  //? Funzione per verificare lo stato online del veicolo
  const checkStatus = async () => {
    if (isCheckingStatus) return;

    setIsCheckingStatus(true);
    try {
      //? Chiamata API per verificare lo stato
      const response = await fetch(`/api/vehicles/${vehicle.id}/status`);
      const data = await response.json();

      setStatus(data.status || "unknown");
    } catch (error) {
      //! Gestione degli errori
      console.error("Error checking vehicle status:", error);
      setStatus("unknown");
    } finally {
      setIsCheckingStatus(false);
    }
  };

  //? Funzione per eliminare il veicolo
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      //? Chiamata API per eliminare il veicolo
      const response = await fetch(`/api/vehicles/${vehicle.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      //! Verifica se la richiesta è andata a buon fine
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete vehicle");
      }

      //? Notifica di successo con toast
      // toast({
      //   title: "Vehicle deleted",
      //   description: "Your vehicle has been deleted successfully",
      // });
      toast.info('Your vehicle has been deleted successfully');
      
      router.refresh();
    } catch (error) {
      //! Gestione degli errori con toast
      console.error("Error deleting vehicle:", error);
      // toast({
      //   title: "Error",
      //   description: (error as Error).message || "Failed to delete vehicle",
      //   variant: "destructive",
      // });
      toast.error('Failed to delete vehicle');

    } finally {
      setIsDeleting(false);
    }
  };

  //? Funzione per connettersi al veicolo e controllarlo
  const handleConnect = () => {
    router.push(`/vehicles/control/${vehicle.id}`);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{vehicle.name}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={checkStatus}
          disabled={isCheckingStatus}
          title="Check status"
        >
          <Activity className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">IP Address:</span>
            <span className="font-medium">{vehicle.ipAddress}</span>
          </div>
          {vehicle.macAddress && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">MAC Address:</span>
              <span className="font-medium">{vehicle.macAddress}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge
              variant={
                status === "online"
                  ? "success"
                  : status === "offline"
                  ? "destructive"
                  : "secondary"
              }
              className="flex items-center gap-1"
            >
              {status === "online" ? (
                <Wifi className="h-3 w-3" />
              ) : (
                <WifiOff className="h-3 w-3" />
              )}
              {status === "unknown" ? "Unknown" : status === "online" ? "Online" : "Offline"}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/vehicles/edit/${vehicle.id}`)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  vehicle and remove it from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <Button
          onClick={handleConnect}
          disabled={status === "offline"}
          variant={status === "online" ? "default" : "secondary"}
        >
          Connect
        </Button>
      </CardFooter>
    </Card>
  );
}
