'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function DashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load

    if (!user) {
      router.push('/auth/login'); // Redirect to login if not authenticated
      return;
    }
  }, [user, authLoading, router]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link href="/projects/new">
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

          <Link href="/tasks/new">
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

          <Link href="/events/new">
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

        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/projects">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>View Projects</CardTitle>
                <CardDescription>See all your projects</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/tasks">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>View Tasks</CardTitle>
                <CardDescription>See all your tasks</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/events">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>View Events</CardTitle>
                <CardDescription>See all your events</CardDescription>
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
