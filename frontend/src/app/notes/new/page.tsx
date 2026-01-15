'use client';

import { useSearchParams } from 'next/navigation';
import NoteEditor from '@/components/notes/NoteEditor';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useQuery, gql } from '@apollo/client';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Query to get a single note by ID
const GET_NOTE_BY_ID = gql`
    query GetNoteById($id: ID!) {
        noteById(id: $id) {
            id
            taskId
            projectId
            eventId
            title
            description
            textContent
            codeBlocks {
                language
                code
            }
            drawingData
            type
            createdAt
            updatedAt
        }
    }
`;

function NewNoteContent() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type') as 'text' | 'code' | 'drawing' || 'text';
    const noteId = searchParams.get('noteId');

    // If noteId is present, we're in edit mode, so fetch the note
    const { data, loading, error } = useQuery(GET_NOTE_BY_ID, {
        variables: { id: noteId },
        skip: !noteId, // Skip the query if no noteId
    });

    if (noteId && loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading note...</span>
            </div>
        );
    }

    if (noteId && error) {
        return (
            <div className="flex items-center justify-center h-screen text-red-500">
                Error loading note. Please try again.
            </div>
        );
    }

    const initialData = noteId && data?.noteById ? data.noteById : undefined;

    return <NoteEditor key={initialData?.id || 'new'} type={type} initialData={initialData} />;
}

export default function NewNotePage() {
    return (
        <ProtectedRoute route="/auth/login">
            <Suspense fallback={<div className="flex bg-slate-50 items-center justify-center h-screen">Loading...</div>}>
                <NewNoteContent />
            </Suspense>
        </ProtectedRoute>
    );
}

