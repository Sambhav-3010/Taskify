'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Project } from '@/lib/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';

export default function EventsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // State for the new event form (always visible now)
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [creatingProject, setCreatingProject] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
    }
    setLoading(false);
  }, [user, authLoading, router]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingProject(true);
    setError(null);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects`,
        { name, description, createdAt: date },
        { withCredentials: true }
      );
      alert('Project created successfully!');
      setName('');
      setDescription('');
      setDate('');
      router.push('/dashboard'); // Redirect to dashboard after creation
    } catch (err: any) {
      console.error('Failed to create project:', err);
      setError(err.response?.data?.message || 'Failed to create project.');
    } finally {
      setCreatingProject(false);
    }
  };

  if (loading || authLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Project</h1>
      <div className="max-w-md mx-auto">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
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
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={creatingProject}
            />
          </div>
          <div>
            <Label htmlFor="date">Creation Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={creatingProject}
            />
          </div>
          <Button type="submit" disabled={creatingProject}>
            {creatingProject ? 'Creating...' : 'Create Project'}
          </Button>
        </form>
      </div>
    </div>
  );
}
