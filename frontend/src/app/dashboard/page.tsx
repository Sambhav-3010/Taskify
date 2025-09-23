'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Plus } from 'lucide-react';
import Link from 'next/link';
import { Project, Task, Event } from '@/lib/models';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

function DashboardContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [projectsResponse, tasksResponse, eventsResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects`, { withCredentials: true }),
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks`, { withCredentials: true }),
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/events`, { withCredentials: true }),
        ]);
        setProjects(projectsResponse.data.map((p: Project) => JSON.parse(JSON.stringify(p))));
        setTasks(tasksResponse.data.tasks.map((t: Task) => JSON.parse(JSON.stringify(t))));
        setEvents(eventsResponse.data.events.map((e: Event) => JSON.parse(JSON.stringify(e))));
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'todo':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (loading || authLoading) {
    return <div className="min-h-screen container mx-auto p-4">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="min-h-screen container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link href="/projects">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>New Project</span>
                </CardTitle>
                <CardDescription>Create a new project</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/tasks">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>New Task</span>
                </CardTitle>
                <CardDescription>Add a task to an existing project</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/events">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>New Event</span>
                </CardTitle>
                <CardDescription>Schedule a new event</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>
              {projects.length} total projects, {tasks.length} total tasks, {events.length} total events
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Projects Section */}
        <h2 className="text-2xl font-bold mb-4">Your Projects</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {projects.length === 0 ? (
            <p className="text-muted-foreground">
              No projects found. <Link href="/projects" className="text-primary hover:underline">Create one!</Link>
            </p>
          ) : (
            projects.map((project) => (
              <Card key={project._id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{project.description || 'No description provided.'}</p>
                  <p className="text-sm text-muted-foreground">
                    Created: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Events Section */}
        <h2 className="text-2xl font-bold mb-4">Your Events</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {events.length === 0 ? (
            <p className="text-muted-foreground">
              No events found. <Link href="/events" className="text-primary hover:underline">Create one!</Link>
            </p>
          ) : (
            events.map((event) => (
              <Card key={event._id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{event.description || 'No description provided.'}</p>
                  <p className="text-sm text-muted-foreground">
                    Date: {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Tasks Section */}
        <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.length === 0 ? (
            <p className="text-muted-foreground">
              No tasks found. <Link href="/tasks" className="text-primary hover:underline">Create one!</Link>
            </p>
          ) : (
            tasks.map((task) => (
              <Card key={task._id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                  </div>
                  <CardDescription className="flex items-center space-x-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Priority: {task.priority}</p>
                  <p className="text-sm text-muted-foreground">
                    Project: {task.projectId 
                      ? (typeof task.projectId === 'string' 
                          ? task.projectId 
                          : (typeof task.projectId === 'object' && task.projectId !== null && 'name' in task.projectId
                              ? (task.projectId as { name: string }).name
                              : (task.projectId as { _id: string })._id))
                      : 'N/A'}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute route="/auth/login">
      <DashboardContent />
    </ProtectedRoute>
  );
}
