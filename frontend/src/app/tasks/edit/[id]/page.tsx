'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Task, Project } from '@/lib/models';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomSelect, CustomSelectItem } from '@/components/CustomSelect';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    const fetchTaskAndProjects = async () => {
      try {
        const [taskResponse, projectsResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks/${id}`, { withCredentials: true }),
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/projects`, { withCredentials: true }),
        ]);
        const fetchedTask = taskResponse.data.task;
        setTask(fetchedTask);
        setTitle(fetchedTask.title);
        setDescription(fetchedTask.description || '');
        setDeadline(fetchedTask.deadline ? new Date(fetchedTask.deadline).toISOString().split('T')[0] : '');
        setPriority(fetchedTask.priority || '');
        setStatus(fetchedTask.status || '');
        setProjectId(fetchedTask.projectId?._id || fetchedTask.projectId || '');

        setProjects(projectsResponse.data || []); // projectsResponse.data is directly an array of projects
      } catch (err) {
        console.error('Failed to fetch task or projects:', err);
        setError('Failed to load task or projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchTaskAndProjects();
  }, [id, user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks/${id}`, {
        title,
        description,
        deadline,
        priority,
        status,
        projectId: projectId || null,
      }, { withCredentials: true });
      router.push('/tasks');
    } catch (err) {
      console.error('Failed to update task:', err);
      setError('Failed to update task.');
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-start justify-center pt-8">
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" className="mr-2" disabled>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Skeleton className="h-8 w-1/2" />
              <div className="w-10"></div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-20 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  if (!task) {
    return <div className="container mx-auto p-4">Task not found.</div>;
  }

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ];

  const projectOptions = projects.map(p => ({ value: p._id, label: p.name }));

  return (
    <div className="min-h-screen bg-background p-4 flex items-start justify-center pt-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Link href="/tasks">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <CardTitle className="text-2xl font-bold text-center flex-grow">Edit Task</CardTitle>
            <div className="w-10"></div> {/* Spacer to balance the back button */}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <CustomSelect
                value={priority}
                onValueChange={setPriority}
                placeholder="Select priority"
              >
                {priorityOptions.map((option) => (
                  <CustomSelectItem key={option.value} value={option.value}>
                    {option.label}
                  </CustomSelectItem>
                ))}
              </CustomSelect>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <CustomSelect
                value={status}
                onValueChange={setStatus}
                placeholder="Select status"
              >
                {statusOptions.map((option) => (
                  <CustomSelectItem key={option.value} value={option.value}>
                    {option.label}
                  </CustomSelectItem>
                ))}
              </CustomSelect>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <CustomSelect
                value={projectId}
                onValueChange={setProjectId}
                placeholder="Select project (optional)"
              >
                {projectOptions.map((option) => (
                  <CustomSelectItem key={option.value} value={option.value}>
                    {option.label}
                  </CustomSelectItem>
                ))}
              </CustomSelect>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Update Task</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
