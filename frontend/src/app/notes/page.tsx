'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from '@apollo/client';
import { GET_MY_NOTES, DELETE_NOTE } from '@/graphql';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { NoteTypeSelection } from '@/components/notes/NoteTypeSelection';
import { Plus, Edit, Trash2, Eye, FileText, Code, Pencil } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { NotePreviewModal } from '@/components/notes/NotePreviewModal';

interface Note {
    id: string;
    title: string;
    description: string;
    textContent: string;
    codeBlocks?: { language: string; code: string }[];
    drawingData?: string;
    type: 'text' | 'code' | 'drawing';
    taskId?: string;
    projectId?: string;
    createdAt: string;
    updatedAt: string;
}

export default function NotesPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { data, loading, error, refetch } = useQuery(GET_MY_NOTES);
    const [isTypeSelectionOpen, setIsTypeSelectionOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const [deleteNoteMutation, { loading: deleting }] = useMutation(DELETE_NOTE, {
        refetchQueries: [{ query: GET_MY_NOTES }],
        awaitRefetchQueries: true,
    });

    const handleCreateClick = () => {
        setIsTypeSelectionOpen(true);
    };

    const handleTypeSelect = (type: string) => {
        setIsTypeSelectionOpen(false);
        router.push(`/notes/new?type=${type}`);
    };

    const handleCardClick = (note: Note) => {
        setSelectedNote(note);
        setIsPreviewOpen(true);
    };

    const handleEditClick = (note: Note) => {
        // Determine the effective type based on content if the saved type seems wrong
        let effectiveType = note.type;

        // If it's saved as 'text' but has code blocks and empty text, treat as code
        if (note.type === 'text' && note.codeBlocks && note.codeBlocks.length > 0 && !note.textContent) {
            effectiveType = 'code';
        }
        // If it's saved as 'text' but has drawing data and empty text, treat as drawing
        else if (note.type === 'text' && note.drawingData && !note.textContent) {
            effectiveType = 'drawing';
        }

        // Navigate to the editor with note data
        router.push(`/notes/new?type=${effectiveType}&noteId=${note.id}`);
    };

    const handleDeleteClick = async (note: Note) => {
        if (!confirm('Are you sure you want to delete this note?')) return;
        try {
            await deleteNoteMutation({ variables: { id: note.id } });
            toast.success('Note deleted successfully');
            setIsPreviewOpen(false);
            setSelectedNote(null);
        } catch (err: any) {
            toast.error(`Failed to delete note: ${err.message}`);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Unknown date';
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return 'Unknown date';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'code':
                return <Code className="h-4 w-4" />;
            case 'drawing':
                return <Pencil className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'code':
                return 'Code';
            case 'drawing':
                return 'Drawing';
            default:
                return 'Text';
        }
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
                    {data?.myNotes?.map((note: Note) => (
                        <Card
                            key={note.id}
                            className="cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => handleCardClick(note)}
                        >
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-medium truncate">
                                        {note.title || 'Untitled Note'}
                                    </CardTitle>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        {getTypeIcon(note.type)}
                                    </div>
                                </div>
                                {note.description && (
                                    <p className="text-sm text-muted-foreground truncate">{note.description}</p>
                                )}
                                <div className="text-xs text-muted-foreground">
                                    {formatDate(note.createdAt)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className={`text-sm text-foreground whitespace-pre-wrap line-clamp-3 ${(note.type === 'code' || (note.codeBlocks && note.codeBlocks.length > 0)) ? 'font-mono' : ''}`}>
                                    {note.textContent ||
                                        (note.codeBlocks && note.codeBlocks.length > 0 ? note.codeBlocks[0].code.split('\n').slice(0, 5).join('\n') :
                                            (note.drawingData ? '[Drawing]' : '[No content]'))}
                                </p>
                                <div className="mt-4 flex gap-2 flex-wrap">
                                    <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-1 rounded">
                                        {getTypeLabel(note.type)}
                                    </span>
                                    {note.projectId && (
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Project Note</span>
                                    )}
                                    {note.taskId && (
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Task Note</span>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(note);
                                    }}
                                    className="gap-1"
                                >
                                    <Edit className="h-3 w-3" />
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCardClick(note);
                                    }}
                                    className="gap-1"
                                >
                                    <Eye className="h-3 w-3" />
                                    Preview
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <NotePreviewModal
                    note={selectedNote}
                    isOpen={isPreviewOpen}
                    onClose={setIsPreviewOpen}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    deleting={deleting}
                />
            </div>
        </ProtectedRoute>
    );
}

