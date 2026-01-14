'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, FolderOpen, ListTodo } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { GET_TASKS, GET_PROJECTS } from '@/graphql';
import { Task, Project } from '@/lib/models';
import TaskStats from '@/components/Dashboard/TaskStats';
import UpcomingTasks from '@/components/Dashboard/UpcomingTasks';

interface GraphQLTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  deadline: string;
  projectId: string | null;
  project?: { id: string; name: string } | null;
  userId: string;
}

interface GraphQLProject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  userId: string;
}

function DashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const { data: tasksData, loading: tasksLoading } = useQuery(GET_TASKS, {
    skip: !user,
  });

  const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS, {
    skip: !user,
  });

  const tasks: Task[] = tasksData?.tasks?.tasks?.map((t: GraphQLTask) => ({
    _id: t.id,
    title: t.title,
    status: t.status as Task['status'],
    priority: t.priority as Task['priority'],
    deadline: t.deadline,
    projectId: t.project ? { _id: t.project.id, name: t.project.name } as unknown as Project : t.projectId,
    userId: t.userId,
  })) || [];

  const projects: Project[] = projectsData?.projects?.map((p: GraphQLProject) => ({
    _id: p.id,
    name: p.name,
    description: p.description,
    createdAt: p.createdAt,
    userId: p.userId,
  })) || [];

  const loading = tasksLoading || projectsLoading;

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }
  }, [user, authLoading, router]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

          {/* Stats skeleton */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Quick actions skeleton */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back{user?.name ? `, ${user.name}` : ''}!
            </p>
          </div>
        </div>

        {/* Task Statistics */}
        <div className="mb-8">
          <TaskStats tasks={tasks} />
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link href="/projects/new">
            <Card className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50 group">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <span>New Project</span>
                </CardTitle>
                <CardDescription>Create a new project to organize your tasks</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/tasks/new">
            <Card className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50 group">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <span>New Task</span>
                </CardTitle>
                <CardDescription>Add a task to an existing project</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/calendar">
            <Card className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50 group">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <span>Calendar View</span>
                </CardTitle>
                <CardDescription>View and manage tasks on calendar</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Upcoming Tasks */}
        <div className="mb-8">
          <UpcomingTasks tasks={tasks} />
        </div>

        {/* View All Links */}
        <h2 className="text-xl font-semibold mb-4">Browse</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/projects">
            <Card className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50 group">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FolderOpen className="h-5 w-5 text-muted-foreground" />
                    <span>Projects</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">{projects.length}</span>
                </CardTitle>
                <CardDescription>View and manage all your projects</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/tasks">
            <Card className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50 group">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ListTodo className="h-5 w-5 text-muted-foreground" />
                    <span>Tasks</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">{tasks.length}</span>
                </CardTitle>
                <CardDescription>View and manage all your tasks</CardDescription>
              </CardHeader>
            </Card>
          </Link>
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
