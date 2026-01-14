'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { GET_PROJECT, UPDATE_PROJECT } from '@/graphql';
import { toast } from 'sonner';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data, loading } = useQuery(GET_PROJECT, {
    variables: { id },
    skip: !user,
    onCompleted: (data) => {
      if (data?.project) {
        setName(data.project.name);
        setDescription(data.project.description || '');
      }
    },
  });

  const [updateProjectMutation, { loading: updating }] = useMutation(UPDATE_PROJECT);

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
      const { data: updateData } = await updateProjectMutation({
        variables: {
          id,
          input: { name, description },
        },
      });
      if (updateData?.updateProject) {
        toast.success('Project updated successfully!');
        router.push('/projects');
      }
    } catch (err) {
      console.error('Failed to update project:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update project.');
      }
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
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data?.project) {
    return <div className="container mx-auto p-4">Project not found.</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4 flex items-start justify-center pt-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Link href="/projects">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <CardTitle className="text-2xl font-bold text-center flex-grow">Edit Project</CardTitle>
            <div className="w-10"></div> {/* Spacer to balance the back button */}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={updating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={updating}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={updating}>
              {updating ? 'Updating...' : 'Update Project'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
