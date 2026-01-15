'use client';

import { useSearchParams } from 'next/navigation';
import NoteEditor from '@/components/notes/NoteEditor';
import { ProtectedRoute } from '@/components/ProtectedRoute';

import { Suspense } from 'react';

function NewNoteContent() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type') as 'text' | 'code' | 'drawing' || 'text';

    return <NoteEditor type={type} />;
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
