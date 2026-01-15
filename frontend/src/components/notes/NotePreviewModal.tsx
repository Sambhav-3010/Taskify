import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Edit, FileText, Code } from 'lucide-react';

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

interface NotePreviewModalProps {
    note: Note | null;
    isOpen: boolean;
    onClose: (open: boolean) => void;
    onEdit: (note: Note) => void;
    onDelete: (note: Note) => void;
    deleting?: boolean;
}

export function NotePreviewModal({ note, isOpen, onClose, onEdit, onDelete, deleting = false }: NotePreviewModalProps) {
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

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'code': return 'Code';
            case 'drawing': return 'Drawing';
            default: return 'Text';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        {note?.title || 'Untitled Note'}
                    </DialogTitle>
                    {note?.description && (
                        <DialogDescription>{note.description}</DialogDescription>
                    )}
                </DialogHeader>

                <div className="py-4">
                    <div className="flex gap-2 mb-4 flex-wrap">
                        <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-1 rounded">
                            {note && getTypeLabel(note.type)}
                        </span>
                        {note?.projectId && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Project Note</span>
                        )}
                        {note?.taskId && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Task Note</span>
                        )}
                    </div>

                    {(note?.textContent || (!note?.codeBlocks?.length && !note?.drawingData)) && (
                        <div className="prose dark:prose-invert max-w-none mb-4">
                            <pre className="whitespace-pre-wrap bg-slate-50 dark:bg-slate-900 p-4 rounded-lg text-sm">
                                {note?.textContent || 'No content'}
                            </pre>
                        </div>
                    )}

                    {note?.codeBlocks && note.codeBlocks.length > 0 && (
                        <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto mb-4">
                            <pre className="text-sm font-mono">
                                {note.codeBlocks[0].code}
                            </pre>
                        </div>
                    )}

                    {note?.drawingData && (
                        <div className="text-center text-muted-foreground p-8 bg-slate-50 dark:bg-slate-900 rounded-lg">
                            <Pencil className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>Drawing preview not available. Click Edit to view the drawing.</p>
                        </div>
                    )}

                    <div className="text-xs text-muted-foreground mt-4">
                        Created: {note && formatDate(note.createdAt)} |
                        Updated: {note && formatDate(note.updatedAt)}
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="destructive"
                        onClick={() => note && onDelete(note)}
                        disabled={deleting}
                        className="gap-1"
                    >
                        <Trash2 className="h-4 w-4" />
                        {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                    <Button
                        onClick={() => note && onEdit(note)}
                        className="gap-1"
                    >
                        <Edit className="h-4 w-4" />
                        Edit Note
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
