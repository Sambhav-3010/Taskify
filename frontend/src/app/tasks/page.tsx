'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Project } from '@/lib/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Import Card components
import { useAuth } from '@/context/AuthContext';

export default function TasksPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // State for the new task form (always visible now)
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState('');
  const [projectId, setProjectId] = useState('');
  const [creatingTask, setCreatingTask] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects`, { withCredentials: true });
      setProjects(response.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchProjects();
  }, [user, authLoading, router]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingTask(true);
    setError(null);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks`,
        { title, status, priority, deadline, projectId },
        { withCredentials: true }
      );
      alert('Task created successfully!');
      setTitle('');
      setStatus('todo');
      setPriority('medium');
      setDeadline('');
      setProjectId('');
      router.push('/dashboard');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to create task.");
      } else {
        setError("Failed to create task.");
      }
    } finally {
      setCreatingTask(false);
    }
  };

  if (loading || authLoading) {
    return <div className="container mx-auto p-4">Loading projects for task creation...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg transform transition-all duration-300 hover:scale-105">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-2">Create New Task</CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-400">Fill in the details below to add a new task.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">Task Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={creatingTask}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectId" className="text-gray-700 dark:text-gray-300">Project</Label>
              <Select value={projectId} onValueChange={setProjectId} disabled={creatingTask}>
                <SelectTrigger className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:text-white">
                  {projects.length === 0 ? (
                    <SelectItem value="no-projects" disabled>No projects available</SelectItem>
                  ) : (
                    projects.map((project) => (
                      <SelectItem key={project._id} value={project._id}>
                        {project.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">Status</Label>
              <Select value={status} onValueChange={setStatus} disabled={creatingTask}>
                <SelectTrigger className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:text-white">
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-gray-700 dark:text-gray-300">Priority</Label>
              <Select value={priority} onValueChange={setPriority} disabled={creatingTask}>
                <SelectTrigger className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select a priority" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:text-white">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-gray-700 dark:text-gray-300">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                disabled={creatingTask}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <Button type="submit" disabled={creatingTask}
                    className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-md hover:bg-gray-700 transition-colors duration-200 ease-in-out transform hover:scale-105"
            >
              {creatingTask ? 'Creating...' : 'Create Task'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
