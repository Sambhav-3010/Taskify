'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
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
import { Skeleton } from '@/components/ui/skeleton';
import { GET_PROJECTS, CREATE_TASK } from '@/graphql';

interface GraphQLProject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  userId: string;
}

export default function NewTaskPage() {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState('');
  const [projectId, setProjectId] = useState('no-project-selected');
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS, {
    skip: !user,
  });

  const [createTaskMutation, { loading: creatingTask }] = useMutation(CREATE_TASK);

  const projects: Project[] = projectsData?.projects?.map((p: GraphQLProject) => ({
    _id: p.id,
    name: p.name,
    description: p.description,
    createdAt: p.createdAt,
    userId: p.userId,
  })) || [];

  const loading = projectsLoading;

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }
  }, [user, authLoading, router]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const { data } = await createTaskMutation({
        variables: {
          input: {
            title,
            status,
            priority,
            deadline,
            projectId: projectId === "no-project-selected" ? null : projectId,
          },
        },
      });
      if (data?.createTask) {
        toast.success('Task created successfully!');
        setTitle('');
        setStatus('todo');
        setPriority('medium');
        setDeadline('');
        setProjectId('no-project-selected');
        router.push('/tasks');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create task.");
      }
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-start justify-center pt-8">
        <Card className="w-full max-w-md shadow-lg">
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
