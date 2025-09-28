'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Event } from '@/lib/models';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${id}`,
          { withCredentials: true }
        );
        const fetchedEvent = response.data.event;
        setEvent(fetchedEvent);
        setTitle(fetchedEvent.title);
        setDescription(fetchedEvent.description || '');
        setDate(fetchedEvent.date ? new Date(fetchedEvent.date).toISOString().split('T')[0] : '');
        setLocation(fetchedEvent.location || '');
      } catch (err) {
        console.error('Failed to fetch event:', err);
        setError('Failed to load event.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${id}`,
        {
          title,
          description,
          date,
          location,
        },
        { withCredentials: true }
      );
      router.push('/events');
    } catch (err) {
      console.error('Failed to update event:', err);
      setError('Failed to update event.');
    }
  };

  if (loading || authLoading) {
    return <div className="container mx-auto p-4">Loading event...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  if (!event) {
    return <div className="container mx-auto p-4">Event not found.</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex justify-between items-center mb-8">
        <Link href="/events">
          <Button variant="outline">Back to Events</Button>
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Event Details</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">
              Update Event
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
