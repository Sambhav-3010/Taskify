"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import { CalendarDays, ArrowLeft, Users, LogOut } from "lucide-react"
import Link from "next/link"
import { Event, Task } from "@/lib/models";
import { initialEvents, activeUsers } from "@/lib/sampleData";

function EventDetailContent() {
  const params = useParams()
  const { logout } = useAuth();
  const [event, setEvent] = useState<Event | null>(null)

  useEffect(() => {
    // TODO: Fetch event from Firestore with real-time updates
    const foundEvent = initialEvents.find((e) => e.id === params.id);
    setEvent(foundEvent || null)
  }, [params.id])

  const updateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    if (!event) return

    const updatedEvent = {
      ...event,
      tasks: event.tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)),
    }
    setEvent(updatedEvent)

    // TODO: Update Firestore
    console.log("Updating task status:", taskId, newStatus)
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
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>

              <div>
                <h1 className="text-2xl font-bold text-foreground">{event.title}</h1>
                <p className="text-sm text-muted-foreground">Event Details</p>
              </div>

              {/* Active Users Indicator */}
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="flex -space-x-2">
                  {activeUsers.map((user) => (
                    <Avatar key={user.id} className="h-8 w-8 border-2 border-background">
                      <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{activeUsers.length} active</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <ThemeToggle/>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Event Info */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl">{event.title}</CardTitle>
                <CardDescription className="flex items-center space-x-2 mt-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>{formatDate(event.date)}</span>
                </CardDescription>
              </div>
              <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks ({event.tasks.length})</CardTitle>
            <CardDescription>Track progress and collaborate in real-time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {event.tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        task.status === "Completed"
                          ? "bg-green-500"
                          : task.status === "In Progress"
                            ? "bg-blue-500"
                            : "bg-gray-300"
                      }`}
                    />
                    <span className="font-medium">{task.title}</span>
                  </div>
                  <Select
                    value={task.status}
                    onValueChange={(value: Task["status"]) => updateTaskStatus(task.id, value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            {event.tasks.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No tasks yet for this event.</p>
                <Link href="/tasks/new" className="mt-2 inline-block">
                  <Button>Add First Task</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function EventDetailPage() {
  return (
    <ProtectedRoute>
      <EventDetailContent />
    </ProtectedRoute>
  )
}
