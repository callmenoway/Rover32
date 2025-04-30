"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Vehicle } from "@/types";

//? Schema di validazione Zod per il form
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(100, { message: "Name is too long" }),
  ipAddress: z.string().min(1, { message: "IP address is required" }),
});

//? Interfaccia delle props del componente
interface VehicleFormProps {
  vehicle?: Vehicle;
  isEdit?: boolean;
}

//? Componente per il form di creazione/modifica veicolo
export function VehicleForm({ vehicle, isEdit = false }: VehicleFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  //? Inizializzazione del form con react-hook-form e validazione Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: vehicle?.name || "",
      ipAddress: vehicle?.ipAddress || "",
    },
  });

  //? Funzione per gestire l'invio del form
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      let response;

      if (isEdit && vehicle) {
        //? Aggiornamento di un veicolo esistente
        response = await fetch(`/api/vehicles/${vehicle.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
      } else {
        //? Creazione di un nuovo veicolo
        response = await fetch("/api/vehicles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
      }

      const data = await response.json();

      //! Gestione degli errori nella risposta
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      //? Notifica di successo
      alert(isEdit ? "Vehicle updated successfully" : "Vehicle created successfully");
      
      //? Reindirizzamento alla lista dei veicoli e aggiornamento dei dati
      router.push("/vehicles");
      router.refresh();
    } catch (error) {
      //! Gestione errori
      console.error(error);
      alert((error as Error).message || "Failed to save vehicle");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Vehicle" : "Add New Vehicle"}</CardTitle>
        <CardDescription>
          {isEdit
            ? "Update your vehicle's information below."
            : "Enter the details of your ESP32 vehicle below."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My ESP32 Rover" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ipAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Address</FormLabel>
                  <FormControl>
                    <Input placeholder="192.168.1.100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : isEdit ? "Update Vehicle" : "Add Vehicle"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

//TODO Aggiungere validazione del formato IP
//TODO Aggiungere campi avanzati (porta, credenziali, modello dispositivo)
