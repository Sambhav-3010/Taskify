'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Project } from '@/lib/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomSelect, CustomSelectItem } from '@/components/CustomSelect';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

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
      toast.success('Task created successfully!');
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
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Link href="/tasks">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <CardTitle className="text-2xl font-bold text-center flex-grow">Create New Task</CardTitle>
            <div className="w-10"></div> {/* Spacer to balance the back button */}
          </div>
          <CardDescription className="text-center text-muted-foreground mt-2">Fill in the details below to add a new task.</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleCreateSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={creatingTask}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectId">Project (Optional)</Label>
              <CustomSelect
                value={projectId}
                onValueChange={setProjectId}
                disabled={creatingTask}
                placeholder="Select a project"
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
              <Label htmlFor="status">Status</Label>
              <CustomSelect
                value={status}
                onValueChange={setStatus}
                disabled={creatingTask}
                placeholder="Select a status"
              >
                <CustomSelectItem value="todo">To Do</CustomSelectItem>
                <CustomSelectItem value="in-progress">In Progress</CustomSelectItem>
                <CustomSelectItem value="done">Done</CustomSelectItem>
              </CustomSelect>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <CustomSelect
                value={priority}
                onValueChange={setPriority}
                disabled={creatingTask}
                placeholder="Select a priority"
              >
                <CustomSelectItem value="low">Low</CustomSelectItem>
                <CustomSelectItem value="medium">Medium</CustomSelectItem>
                <CustomSelectItem value="high">High</CustomSelectItem>
              </CustomSelect>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                disabled={creatingTask}
              />
            </div>
            <Button type="submit" disabled={creatingTask} className="w-full">
              {creatingTask ? 'Creating...' : 'Create Task'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
