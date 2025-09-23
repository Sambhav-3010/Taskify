"use client";

import type React from "react";

import { useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Zap } from "lucide-react";
import axios from "axios";

function NewEventContent() {
  const [loading, setLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
  });

  const createEvent = async (data: typeof formData) => {
    setLoading(true);
    console.log("Creating manual event:", data);
    setLoading(false);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEvent(formData);
  };

  const handleAiSubmit = async () => {
    if (!aiPrompt.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(
        (process.env.NEXT_PUBLIC_BACKEND_URL as string).concat("/api"),
        { prompt: aiPrompt },
        { withCredentials: true }
      );

      if (response.statusText === "OK") {
        const newData = {
          title: response.data.title,
          description: response.data.description,
          date: response.data.date,
          time: response.data.time,
        }
        setFormData(newData);
        await createEvent(newData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* AI Creation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Create with AI</span>
            </CardTitle>
            <CardDescription>
              Describe your event and let AI create it with tasks automatically
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="e.g., 'Plan team building event next Friday 2PM with activities: icebreakers, team games, lunch'"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={3}
              />
              <Button
                onClick={handleAiSubmit}
                disabled={!aiPrompt.trim() || loading}
                className="w-full"
              >
                <Zap className="h-4 w-4 mr-2" />
                {loading ? "Creating..." : "Create with AI"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or create manually
              </span>
            </div>
          </div>
        </div>

        {/* Manual Creation */}
        <Card>
          <CardHeader>
            <CardTitle>Manual Event Creation</CardTitle>
            <CardDescription>
              Fill out the details to create your event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe your event"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, time: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating Event..." : "Create Event"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function NewEventPage() {
  return (
    <ProtectedRoute route="/">
      <NewEventContent />
    </ProtectedRoute>
  );
}
