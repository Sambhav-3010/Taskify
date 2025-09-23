"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // Import Card components
import { useAuth } from "@/context/AuthContext";

export default function EventsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // State for the new event form (always visible now)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/auth/login");
    }
    setLoading(false);
  }, [user, authLoading, router]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingProject(true);
    setError(null);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects`,
        { name, description, createdAt: date },
        { withCredentials: true }
      );
      alert("Project created successfully!");
      setName("");
      setDescription("");
      setDate("");
      router.push("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to create project.");
      } else {
        setError("Failed to create project.");
      }
    } finally {
      setCreatingProject(false);
    }
  };

  if (loading || authLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg transform transition-all duration-300 hover:scale-105">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-2">
            Create New Project
          </CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-400">
            Fill in the details below to add a new project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-gray-700 dark:text-gray-300"
              >
                Project Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={creatingProject}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-gray-700 dark:text-gray-300"
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={creatingProject}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="date"
                className="text-gray-700 dark:text-gray-300"
              >
                Creation Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={creatingProject}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <Button
              type="submit"
              disabled={creatingProject}
              className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-md hover:bg-gray-700 transition-colors duration-200 ease-in-out transform hover:scale-105"
            >
              {creatingProject ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
