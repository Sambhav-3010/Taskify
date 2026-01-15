'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPSERT_NOTE, GET_MY_NOTES, GET_PROJECTS, GET_TASKS } from '@/graphql';
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

export default function NoteEditor({ type, initialData: _initialData, defaultTargetType = 'none', defaultTargetId = '' }: NoteEditorProps) {
    const router = useRouter();
    const [textContent, setTextContent] = useState('');
    const [codeData, setCodeData] = useState({ code: '', language: 'javascript' });
    const [drawingData, setDrawingData] = useState('');

    // Association State
    const [targetType, setTargetType] = useState<'none' | 'project' | 'task'>(defaultTargetType);
    const [targetId, setTargetId] = useState(defaultTargetId);
    const [associateDialogOpen, setAssociateDialogOpen] = useState(false);

    const [upsertNote, { loading: saving }] = useMutation(UPSERT_NOTE, {
        refetchQueries: [{ query: GET_MY_NOTES }],
        awaitRefetchQueries: true,
    });

    const { data: projectsData } = useQuery(GET_PROJECTS);
    const { data: tasksData } = useQuery(GET_TASKS);

    const handleSave = async () => {
        try {
            const variables: any = {
                input: {
                    type,
                    textContent: type === 'text' ? textContent : undefined,
                    codeBlocks: type === 'code' ? [{ language: codeData.language, code: codeData.code }] : undefined,
                    drawingData: type === 'drawing' ? drawingData : undefined,
                },
            };

            // Add associations if selected
            if (targetType === 'project' && targetId) variables.projectId = targetId;
            if (targetType === 'task' && targetId) variables.taskId = targetId;

            // If strictly just creating a note without association, we send nulls?
            // The backend handles optional IDs now.

            await upsertNote({ variables });
            toast.success('Note saved successfully');
            router.push('/notes');
        } catch (err: any) {
            console.error(err);
            toast.error(`Failed to save note: ${err.message}`);
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
                    <h1 className="text-xl font-semibold capitalize">{type} Note</h1>
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
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
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
                {type === 'drawing' && <ExcalidrawEditor onChange={setDrawingData} />}
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
