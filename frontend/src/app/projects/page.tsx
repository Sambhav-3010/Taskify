'use client';

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Project, Task } from '@/lib/models'; // Import Task model
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Plus, CalendarDays, Pencil, Trash2 } from 'lucide-react'; // Import CalendarDays icon
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // Import Badge component
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]); // State for tasks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const fetchProjectsAndTasks = async () => {
    try {
      const [projectsResponse, tasksResponse] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects`, { withCredentials: true }),
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks`, { withCredentials: true }),
      ]);
      setProjects(projectsResponse.data.map((p: Project) => JSON.parse(JSON.stringify(p))));
      setTasks(tasksResponse.data.tasks.map((t: Task) => JSON.parse(JSON.stringify(t))));
    } catch (err) {
      console.error('Failed to fetch projects or tasks:', err);
      setError('Failed to load projects and tasks.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    setProjectToDelete(projectId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProject = async () => {
    if (projectToDelete) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/${projectToDelete}`, { withCredentials: true });
        toast.success('Project and associated tasks deleted successfully!');
        fetchProjectsAndTasks(); // Refresh the list
      } catch (err) {
        console.error('Failed to delete project:', err);
        toast.error('Failed to delete project.');
      } finally {
        setIsDeleteDialogOpen(false);
        setProjectToDelete(null);
      }
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchProjectsAndTasks();
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
    return <div className="container mx-auto p-4">Loading projects and tasks...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Projects</h1>
        <Link href="/projects/new">
          <Button className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add New Project</span>
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <p className="text-muted-foreground">
            No projects found. <Link href="/projects/new" className="text-primary hover:underline">Create one!</Link>
          </p>
        ) : (
          projects.map((project) => (
            <Card key={project._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/projects/edit/${project._id}`)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit Project</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(project._id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Project</span>
                    </Button>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {project.description || 'No description provided.'}
                </CardDescription>
                <p className="text-sm text-muted-foreground mt-2">
                  Created: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </CardHeader>
              <CardContent>
                <h3 className="text-md font-semibold mb-2 mt-4">Tasks:</h3>
                {tasks.filter(task => {
                  let taskId: string | undefined;
                  if (task.projectId) {
                    if (typeof task.projectId === 'object') {
                      taskId = task.projectId._id;
                    } else {
                      taskId = task.projectId;
                    }
                  }
                  return taskId === project._id;
                }).length === 0 ? (
                  <p className="text-muted-foreground text-sm">No tasks for this project.</p>
                ) : (
                  <div className="space-y-2">
                    {tasks.filter(task => {
                      let taskId: string | undefined;
                      if (task.projectId) {
                        if (typeof task.projectId === 'object') {
                          taskId = task.projectId._id;
                        } else {
                          taskId = task.projectId;
                        }
                      }
                      return taskId === project._id;
                    }).map((task) => (
                      <Card key={task._id} className="p-3 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">{task.title}</CardTitle>
                          <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                        </div>
                        <CardDescription className="flex items-center space-x-1 text-sm mt-1">
                          <CalendarDays className="h-3 w-3" />
                          <span>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}</span>
                        </CardDescription>
                        <p className="text-muted-foreground text-sm mt-2">Priority: {task.priority}</p>
                      </Card>
                    ))}
                  </div>
                )}
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
              This action cannot be undone. This will permanently delete your project and all its associated tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProject}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
