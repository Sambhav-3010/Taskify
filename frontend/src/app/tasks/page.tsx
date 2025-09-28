'use client';

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Task } from '@/lib/models';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Plus, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks`, { withCredentials: true });
      setTasks(response.data.tasks.map((t: Task) => JSON.parse(JSON.stringify(t))));
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks/${taskToDelete}`, { withCredentials: true });
        toast.success('Task deleted successfully!');
        fetchTasks(); // Refresh the list
      } catch (err) {
        console.error('Failed to delete task:', err);
        toast.error('Failed to delete task.');
      } finally {
        setIsDeleteDialogOpen(false);
        setTaskToDelete(null);
      }
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchTasks();
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
    return <div className="container mx-auto p-4">Loading tasks...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Tasks</h1>
        <Link href="/tasks/new">
          <Button className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add New Task</span>
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.length === 0 ? (
          <p className="text-muted-foreground">
            No tasks found. <Link href="/tasks/new" className="text-primary hover:underline">Create one!</Link>
          </p>
        ) : (
          tasks.map((task) => (
            <Card key={task._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg mb-2">{task.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/tasks/edit/${task._id}`)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit Task</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task._id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Task</span>
                    </Button>
                  </div>
                </div>
                <CardDescription className="flex items-center space-x-2 mt-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mt-4">Priority: {task.priority}</p>
                <p className="text-sm text-muted-foreground mt-2">
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
