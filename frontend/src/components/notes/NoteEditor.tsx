'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPSERT_NOTE, GET_MY_NOTES, GET_PROJECTS, GET_TASKS, DELETE_NOTE } from '@/graphql';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { MoreVertical, Save, ArrowLeft, Loader2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { CustomSelect, CustomSelectItem } from '@/components/CustomSelect';

import { ExcalidrawEditor } from './editors/ExcalidrawEditor';
import { CodeEditor } from './editors/CodeEditor';
import { TextEditor } from './editors/TextEditor';
import { useRouter } from 'next/navigation';

interface NoteEditorProps {
    type: 'text' | 'code' | 'drawing';
    initialData?: any; // For editing
    defaultTargetType?: 'none' | 'project' | 'task';
    defaultTargetId?: string;
}

export default function NoteEditor({ type, initialData, defaultTargetType = 'none', defaultTargetId = '' }: NoteEditorProps) {
    const router = useRouter();
    const [noteId, setNoteId] = useState<string | undefined>(initialData?._id || initialData?.id);
    const [title, setTitle] = useState(initialData?.title || ''); // Default empty, let backend handle default if needed, or set 'Untitled'
    const [description, setDescription] = useState(initialData?.description || '');
    const [textContent, setTextContent] = useState(initialData?.textContent || '');
    const [codeData, setCodeData] = useState({
        code: initialData?.codeBlocks?.[0]?.code || '',
        language: initialData?.codeBlocks?.[0]?.language || 'javascript'
    });
    const [drawingData, setDrawingData] = useState(initialData?.drawingData || '');

    // Association State
    const [targetType, setTargetType] = useState<'none' | 'project' | 'task'>(defaultTargetType);
    const [targetId, setTargetId] = useState(defaultTargetId);
    const [associateDialogOpen, setAssociateDialogOpen] = useState(false);

    const [upsertNote, { loading: saving }] = useMutation(UPSERT_NOTE, {
        refetchQueries: [{ query: GET_MY_NOTES }],
        awaitRefetchQueries: true,
    });

    const [deleteNote, { loading: deleting }] = useMutation(DELETE_NOTE, {
        refetchQueries: [{ query: GET_MY_NOTES }],
        awaitRefetchQueries: true,
    });

    const { data: projectsData } = useQuery(GET_PROJECTS);
    const { data: tasksData } = useQuery(GET_TASKS);

    const handleSave = async () => {
        try {
            const variables: any = {
                id: noteId,
                input: {
                    title,
                    description,
                    type,
                    textContent: type === 'text' ? textContent : undefined,
                    codeBlocks: type === 'code' ? [{ language: codeData.language, code: codeData.code }] : undefined,
                    drawingData: type === 'drawing' ? drawingData : undefined,
                },
            };

            // Add associations if selected
            if (targetType === 'project' && targetId) variables.projectId = targetId;
            if (targetType === 'task' && targetId) variables.taskId = targetId;

            const { data } = await upsertNote({ variables });

            if (data?.upsertNote?.id) {
                setNoteId(data.upsertNote.id);
            }

            toast.success('Note saved successfully');
        } catch (err: any) {
            console.error(err);
            toast.error(`Failed to save note: ${err.message}`);
        }
    };

    const handleDelete = async () => {
        if (!noteId) return;
        if (!confirm('Are you sure you want to delete this note?')) return;

        try {
            await deleteNote({ variables: { id: noteId } });
            toast.success('Note deleted');
            router.back();
        } catch (err: any) {
            console.error(err);
            toast.error(`Failed to delete note: ${err.message}`);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header */}
            <div className="border-b p-4 flex items-center justify-between bg-card">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Note Title"
                            className="text-xl font-semibold bg-transparent border-none focus:outline-none placeholder:text-muted-foreground"
                        />
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add a description..."
                            className="text-sm text-muted-foreground bg-transparent border-none focus:outline-none w-full"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button onClick={handleSave} disabled={saving} className="gap-2">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => setAssociateDialogOpen(true)}>
                                Associate with...
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onSelect={handleDelete}
                                disabled={!noteId || deleting}
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-hidden p-6 bg-slate-50 dark:bg-slate-900">
                {type === 'text' && <TextEditor content={textContent} onChange={setTextContent} />}
                {type === 'code' && (
                    <CodeEditor
                        code={codeData.code}
                        language={codeData.language}
                        onChange={(code, language) => setCodeData({ code, language })}
                    />
                )}
                {type === 'drawing' && <ExcalidrawEditor onChange={setDrawingData} initialData={initialData?.drawingData} />}
            </div>

            {/* Association Dialog */}
            <Dialog open={associateDialogOpen} onOpenChange={setAssociateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Associate Note</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Link to...</Label>
                            <CustomSelect value={targetType} onValueChange={(val: any) => setTargetType(val)}>
                                <CustomSelectItem value="none">None</CustomSelectItem>
                                <CustomSelectItem value="project">Project</CustomSelectItem>
                                <CustomSelectItem value="task">Task</CustomSelectItem>
                            </CustomSelect>
                        </div>

                        {targetType === 'project' && (
                            <div className="space-y-2">
                                <Label>Select Project</Label>
                                <CustomSelect value={targetId} onValueChange={setTargetId} placeholder="Select project">
                                    {projectsData?.projects?.map((p: any) => (
                                        <CustomSelectItem key={p.id} value={p.id}>{p.name}</CustomSelectItem>
                                    ))}
                                </CustomSelect>
                            </div>
                        )}

                        {targetType === 'task' && (
                            <div className="space-y-2">
                                <Label>Select Task</Label>
                                <CustomSelect value={targetId} onValueChange={setTargetId} placeholder="Select task">
                                    {tasksData?.tasks?.tasks?.map((t: any) => (
                                        <CustomSelectItem key={t.id} value={t.id}>{t.title}</CustomSelectItem>
                                    ))}
                                </CustomSelect>
                            </div>
                        )}

                        <Button onClick={() => setAssociateDialogOpen(false)} className="w-full">
                            Done
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
