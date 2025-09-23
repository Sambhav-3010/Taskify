"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Plus, Send } from "lucide-react"
import Link from "next/link"
import {Event} from "@/lib/models"
import {initialEvents} from "@/lib/sampleData"


function DashboardContent() {

  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [aiPrompt, setAiPrompt] = useState("")

  const handleAiSubmit = async () => {
    if (!aiPrompt.trim()) return
    console.log("Processing AI prompt:", aiPrompt)
    const newEvent: Event = {
      id: Date.now().toString(),
      title: aiPrompt.slice(0, 50) + "...",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "Upcoming",
      tasks: [
        { id: Date.now().toString(), title: "Generated task 1", status: "Pending" },
        { id: (Date.now() + 1).toString(), title: "Generated task 2", status: "Pending" },
      ],
    }

    setEvents((prev) => [newEvent, ...prev])
    setAiPrompt("")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Upcoming":
      case "Pending":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link href="/events/new">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>New Event</span>
                </CardTitle>
                <CardDescription>Create a new event manually</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/tasks/new">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>New Task</span>
                </CardTitle>
                <CardDescription>Add a task to an existing event</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>{events.length} total events</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* AI Event Creation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Create Event with AI</span>
            </CardTitle>
            <CardDescription>
              Describe your event in natural language, e.g., &quot;Plan all-hands next Monday 11AM with tasks: confirm
              agenda, send invites&quot;
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder="Describe your event..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAiSubmit()}
                className="flex-1"
              />
              <Button onClick={handleAiSubmit} disabled={!aiPrompt.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Create
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                  </div>
                  <CardDescription className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>{formatDate(event.date)}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">{event.tasks.length} tasks</div>
                    <div className="flex space-x-1">
                      {event.tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`h-2 w-full rounded-full ${
                            task.status === "Completed"
                              ? "bg-green-500"
                              : task.status === "In Progress"
                                ? "bg-blue-500"
                                : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No events yet</h3>
            <p className="text-muted-foreground">Create your first event using the AI prompt above.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute route="/auth/login">
      <DashboardContent />
    </ProtectedRoute>
  )
}
