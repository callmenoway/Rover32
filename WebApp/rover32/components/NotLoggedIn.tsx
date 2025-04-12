import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NotLoggedIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <Card className="w-full max-w-md shadow-xl border border-gray-200">
        <CardHeader className="flex flex-col items-center text-center space-y-2">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <h2 className="text-2xl font-bold">You're not logged in</h2>
          <p className="text-gray-500">Please sign in to access your dashboard.</p>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Link href="/sign-in">
            <Button className="px-6 py-2">Go to Sign In</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}