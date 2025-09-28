'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Event } from '@/lib/models';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { CalendarDays, Plus, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/events`, { withCredentials: true });
      setEvents(response.data.events.map((e: Event) => JSON.parse(JSON.stringify(e))));
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    setEventToDelete(eventId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteEvent = async () => {
    if (eventToDelete) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${eventToDelete}`, { withCredentials: true });
        toast.success('Event deleted successfully!');
        fetchEvents(); // Refresh the list
      } catch (err) {
        console.error('Failed to delete event:', err);
        toast.error('Failed to delete event.');
      } finally {
        setIsDeleteDialogOpen(false);
        setEventToDelete(null);
      }
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchEvents();
  }, [user, authLoading, router]);

  if (loading || authLoading) {
    return <div className="container mx-auto p-4">Loading events...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex justify-between items-center mb-8">
        <Link href="/events/new">
          <Button className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add New Event</span>
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.length === 0 ? (
          <p className="text-muted-foreground">
            No events found. <Link href="/events/new" className="text-primary hover:underline">Create one!</Link>
          </p>
        ) : (
          events.map((event) => (
            <Card key={event._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => router.push(`/events/edit/${event._id}`)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit Event</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteEvent(event._id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Event</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{event.description || 'No description provided.'}</p>
                <p className="text-sm text-muted-foreground flex items-center space-x-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>Date: {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}</span>
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteEvent}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
