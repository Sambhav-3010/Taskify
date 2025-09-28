'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Project } from '@/lib/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomSelect, CustomSelectItem } from '@/components/CustomSelect';
import { SelectTrigger, SelectValue } from '@/components/ui/select'; // Keep these for now if CustomSelect doesn't fully replace them
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewTaskPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState('');
  const [projectId, setProjectId] = useState('no-project-selected');
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
        { title, status, priority, deadline, projectId: projectId === "no-project-selected" ? undefined : projectId },
        { withCredentials: true }
      );
      alert('Task created successfully!');
      setTitle('');
      setStatus('todo');
      setPriority('medium');
      setDeadline('');
      setProjectId('no-project-selected');
      router.push('/tasks'); // Redirect to tasks list after creation
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
    <div className="min-h-screen bg-background p-4 flex items-start justify-center pt-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Link href="/tasks">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <CardTitle className="text-3xl font-extrabold text-gray-800 dark:text-white flex-grow text-center">Create New Task</CardTitle>
            <div className="w-10"></div>
          </div>
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
              <Label htmlFor="projectId" className="text-gray-700 dark:text-gray-300">Project (Optional)</Label>
              <CustomSelect
                value={projectId}
                onValueChange={setProjectId}
                disabled={creatingTask}
                placeholder="Select a project"
                triggerClassName="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                contentClassName="dark:bg-gray-800 dark:text-white"
              >
                <CustomSelectItem value="no-project-selected">No Project</CustomSelectItem>
                {projects.length === 0 ? (
                  <CustomSelectItem value="no-projects" disabled>No projects available</CustomSelectItem>
                ) : (
                  projects.map((project) => (
                    <CustomSelectItem key={project._id} value={project._id}>
                      {project.name}
                    </CustomSelectItem>
                  ))
                )}
              </CustomSelect>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-gray-700 dark:text-gray-300">Status</Label>
              <CustomSelect
                value={status}
                onValueChange={setStatus}
                disabled={creatingTask}
                placeholder="Select a status"
                triggerClassName="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                contentClassName="dark:bg-gray-800 dark:text-white"
              >
                <CustomSelectItem value="todo">To Do</CustomSelectItem>
                <CustomSelectItem value="in-progress">In Progress</CustomSelectItem>
                <CustomSelectItem value="done">Done</CustomSelectItem>
              </CustomSelect>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-gray-700 dark:text-gray-300">Priority</Label>
              <CustomSelect
                value={priority}
                onValueChange={setPriority}
                disabled={creatingTask}
                placeholder="Select a priority"
                triggerClassName="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                contentClassName="dark:bg-gray-800 dark:text-white"
              >
                <CustomSelectItem value="low">Low</CustomSelectItem>
                <CustomSelectItem value="medium">Medium</CustomSelectItem>
                <CustomSelectItem value="high">High</CustomSelectItem>
              </CustomSelect>
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
                    className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-md hover:bg-gray-700 transition-colors duration-200 ease-in-out"
            >
              {creatingTask ? 'Creating...' : 'Create Task'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
