'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@apollo/client';
import { GET_MY_NOTES } from '@/graphql';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { NoteTypeSelection } from '@/components/notes/NoteTypeSelection';
import { Plus } from 'lucide-react';

export default function NotesPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { data, loading, error } = useQuery(GET_MY_NOTES);
    const [isTypeSelectionOpen, setIsTypeSelectionOpen] = useState(false);

    const handleCreateClick = () => {
        setIsTypeSelectionOpen(true);
    };

    const handleTypeSelect = (type: string) => {
        setIsTypeSelectionOpen(false);
        router.push(`/notes/new?type=${type}`);
    };

    return (
        <ProtectedRoute route="/auth/login">
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Notes</h1>
                    <Button onClick={handleCreateClick} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Note
                    </Button>
                </div>

                <NoteTypeSelection
                    open={isTypeSelectionOpen}
                    onOpenChange={setIsTypeSelectionOpen}
                    onSelectType={handleTypeSelect}
                />

                {loading && <p>Loading notes...</p>}
                {error && <p className="text-red-500">Error loading notes</p>}

                {!loading && !error && data?.myNotes.length === 0 && (
                    <div className="text-center text-muted-foreground mt-10">
                        <p>No notes found. Create one to get started!</p>
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {data?.myNotes?.map((note: any) => (
                        <Card key={note.id}>
                            <CardHeader>
                                <CardTitle className="text-lg font-medium truncate">
                                    {note.textContent.substring(0, 50) || 'Untitled Note'}
                                </CardTitle>
                                <div className="text-xs text-muted-foreground">
                                    {new Date(Number(note.createdAt)).toLocaleDateString()}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-foreground whitespace-pre-wrap line-clamp-4">
                                    {note.textContent}
                                </p>
                                <div className="mt-4 flex gap-2">
                                    {note.projectId && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Project Note</span>}
                                    {note.taskId && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Task Note</span>}
                                    {/* Event tag if needed */}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </ProtectedRoute>
    );
}
