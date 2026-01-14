'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { CREATE_PROJECT } from '@/graphql';

export default function NewProjectPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [createProjectMutation, { loading: creatingProject }] = useMutation(CREATE_PROJECT);

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
      const { data } = await createProjectMutation({
        variables: {
          input: { name, description },
        },
      });
      if (data?.createProject) {
        toast.success('Project created successfully!');
        setName('');
        setDescription('');
        router.push('/projects');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create project.");
      }
    }
  };

  if (authLoading) {
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

  return (
    <div className="min-h-screen bg-background p-4 flex items-start justify-center pt-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Link href="/projects">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <CardTitle className="text-2xl font-bold text-center flex-grow">Create New Project</CardTitle>
            <div className="w-10"></div> {/* Spacer to balance the back button */}
          </div>
          <CardDescription className="text-center text-muted-foreground mt-2">Fill in the details below to add a new project.</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleCreateSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={creatingProject}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={creatingProject}
              />
            </div>
            <Button type="submit" disabled={creatingProject} className="w-full">
              {creatingProject ? 'Creating...' : 'Create Project'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
