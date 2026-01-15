'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
import { Task, Project } from '@/lib/models';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Plus, Pencil, Trash2, Download, ExternalLink, AlertTriangle } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { GET_TASKS, DELETE_TASK } from '@/graphql';
import { generateICS, downloadICS, generateGoogleCalendarURL, generateICSBatch, CalendarTask } from '@/lib/calendar-utils';
import { isPast, isToday } from 'date-fns';

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

export default function TasksPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const { data, loading, refetch } = useQuery(GET_TASKS, {
    skip: !user,
  });

  const [deleteTaskMutation] = useMutation(DELETE_TASK);

  const tasks: Task[] = data?.tasks?.tasks?.map((t: GraphQLTask) => ({
    _id: t.id,
    title: t.title,
    status: t.status as Task['status'],
    priority: t.priority as Task['priority'],
    deadline: t.deadline,
    projectId: t.project ? { _id: t.project.id, name: t.project.name } as unknown as Project : t.projectId,
    projectName: t.project?.name,
    userId: t.userId,
  })) || [];

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete) {
      try {
        const { data: deleteData } = await deleteTaskMutation({
          variables: { id: taskToDelete },
        });
        if (deleteData?.deleteTask?.success) {
          toast.success('Task deleted successfully!');
          refetch();
        } else {
          toast.error('Failed to delete task.');
        }
      } catch (err) {
        console.error('Failed to delete task:', err);
        toast.error('Failed to delete task.');
      } finally {
        setIsDeleteDialogOpen(false);
        setTaskToDelete(null);
      }
    }
  };

  const handleAddToGoogleCalendar = (task: Task) => {
    const calendarTask: CalendarTask = {
      id: task._id,
      title: task.title,
      deadline: new Date(task.deadline),
      status: task.status,
      priority: task.priority,
      projectName: typeof task.projectId === 'object' && task.projectId
        ? (task.projectId as { name: string }).name
        : undefined,
    };

    const url = generateGoogleCalendarURL(calendarTask);
    window.open(url, '_blank');
  };

  const handleDownloadICS = (task: Task) => {
    const calendarTask: CalendarTask = {
      id: task._id,
      title: task.title,
      deadline: new Date(task.deadline),
      status: task.status,
      priority: task.priority,
      projectName: typeof task.projectId === 'object' && task.projectId
        ? (task.projectId as { name: string }).name
        : undefined,
    };

    const icsContent = generateICS(calendarTask);
    downloadICS(icsContent, `task-${task._id}.ics`);
    toast.success('Calendar file downloaded!');
  };

  const handleExportAll = () => {
    if (tasks.length === 0) {
      toast.error('No tasks to export');
      return;
    }

    const calendarTasks: CalendarTask[] = tasks
      .filter(task => task.deadline)
      .map(task => ({
        id: task._id,
        title: task.title,
        deadline: new Date(task.deadline),
        status: task.status,
        priority: task.priority,
        projectName: typeof task.projectId === 'object' && task.projectId
          ? (task.projectId as { name: string }).name
          : undefined,
      }));

    const icsContent = generateICSBatch(calendarTasks);
    downloadICS(icsContent, 'taskify-tasks.ics');
    toast.success(`Exported ${calendarTasks.length} tasks to calendar file`);
  };

  // Auth check is handled by ProtectedRoute or middleware, removing manual redirect
  // which causes issues during hydration loading states.

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-amber-600 dark:text-amber-400';
      case 'low':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const isTaskOverdue = (task: Task) => {
    const deadline = new Date(task.deadline);
    return isPast(deadline) && !isToday(deadline) && task.status !== 'done';
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Tasks</h1>
          <Button className="flex items-center space-x-2" disabled>
            <Plus className="h-5 w-5" />
            <span>Add New Task</span>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/3 mt-4" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Tasks</h1>
          <p className="text-muted-foreground">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportAll} disabled={tasks.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Link href="/tasks/new">
            <Button className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add New Task</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.length === 0 ? (
          <p className="text-muted-foreground">
            No tasks found. <Link href="/tasks/new" className="text-primary hover:underline">Create one!</Link>
          </p>
        ) : (
          tasks.map((task) => {
            const overdue = isTaskOverdue(task);
            return (
              <Card
                key={task._id}
                className={`hover:shadow-md transition-shadow ${overdue ? 'border-red-300 dark:border-red-800' : ''
                  }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {overdue && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      <CardTitle className="text-lg mb-2">{task.title}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    </div>
                  </div>
                  <CardDescription className="flex items-center space-x-2 mt-2">
                    <CalendarDays className="h-4 w-4" />
                    <span className={overdue ? 'text-red-500 font-medium' : ''}>
                      Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className={`mt-4 font-medium ${getPriorityColor(task.priority)}`}>
                    Priority: {task.priority}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Project: {task.projectId
                      ? (typeof task.projectId === 'string'
                        ? task.projectId
                        : (typeof task.projectId === 'object' && task.projectId !== null && 'name' in task.projectId
                          ? (task.projectId as { name: string }).name
                          : (task.projectId as { _id: string })._id))
                      : 'N/A'}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 mt-4 pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddToGoogleCalendar(task)}
                      title="Add to Google Calendar"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Add to Calendar
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownloadICS(task)}
                      title="Download ICS file"
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download ICS</span>
                    </Button>
                    <div className="flex-1" />
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/tasks/edit/${task._id}`)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit Task</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task._id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Task</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
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
