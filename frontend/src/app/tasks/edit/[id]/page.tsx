'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
import { Project } from '@/lib/models';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomSelect, CustomSelectItem } from '@/components/CustomSelect';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { GET_TASK, GET_PROJECTS, UPDATE_TASK } from '@/graphql';
import { toast } from 'sonner';
import NoteEditor from '@/components/notes/NoteEditor';

interface GraphQLProject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  userId: string;
}

export default function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [projectId, setProjectId] = useState('no-project-selected');
  const [error, setError] = useState<string | null>(null);

  const { data: taskData, loading: taskLoading } = useQuery(GET_TASK, {
    variables: { id },
    skip: !user,
    onCompleted: (data) => {
      if (data?.task) {
        setTitle(data.task.title);
        setDeadline(data.task.deadline ? new Date(data.task.deadline).toISOString().split('T')[0] : '');
        setPriority(data.task.priority || 'medium');
        setStatus(data.task.status || 'todo');
        setProjectId(data.task.projectId || 'no-project-selected');
      }
    },
  });

  const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS, {
    skip: !user,
  });

  const [updateTaskMutation, { loading: updating }] = useMutation(UPDATE_TASK);

  const projects: Project[] = projectsData?.projects?.map((p: GraphQLProject) => ({
    _id: p.id,
    name: p.name,
    description: p.description,
    createdAt: p.createdAt,
    userId: p.userId,
  })) || [];

  const loading = taskLoading || projectsLoading;

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const { data } = await updateTaskMutation({
        variables: {
          id,
          input: {
            title,
            deadline,
            priority,
            status,
            projectId: projectId === 'no-project-selected' ? null : projectId,
          },
        },
      });
      if (data?.updateTask) {
        toast.success('Task updated successfully!');
        router.push('/tasks');
      }
    } catch (err) {
      console.error('Failed to update task:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update task.');
      }
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-start justify-center pt-8">
        <Card className="w-full max-w-2xl mx-auto glass-card">
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
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!taskData?.task) {
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

  return (
    <div className="min-h-screen bg-background p-4 pt-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="glass-card">
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
                  disabled={updating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  disabled={updating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <CustomSelect
                  value={priority}
                  onValueChange={setPriority}
                  placeholder="Select priority"
                  disabled={updating}
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
                  disabled={updating}
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
                  disabled={updating}
                >
                  <CustomSelectItem value="no-project-selected">No Project</CustomSelectItem>
                  {projects.map((project) => (
                    <CustomSelectItem key={project._id} value={project._id}>
                      {project.name}
                    </CustomSelectItem>
                  ))}
                </CustomSelect>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={updating}>
                {updating ? 'Updating...' : 'Update Task'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notes Section */}
        {/* Notes Section - Defaulting to text note for quick add */}
        <NoteEditor type="text" defaultTargetType="task" defaultTargetId={id} />
      </div>
    </div>
  );
}
