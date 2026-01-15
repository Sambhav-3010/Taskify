'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UPSERT_NOTE, GET_MY_NOTES, GET_PROJECTS, GET_TASKS } from '@/graphql';
import { CustomSelect, CustomSelectItem } from '@/components/CustomSelect';
import { toast } from 'sonner';

interface CreateNoteModalProps {
    trigger?: React.ReactNode;
}

export function CreateNoteModal({ trigger }: CreateNoteModalProps) {
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('');
    const [targetType, setTargetType] = useState('none'); // none, task, project, event
    const [targetId, setTargetId] = useState('');

    const [upsertNote, { loading: saving }] = useMutation(UPSERT_NOTE, {
        refetchQueries: [{ query: GET_MY_NOTES }],
        awaitRefetchQueries: true,
    });

    const { data: projectsData } = useQuery(GET_PROJECTS);
    const { data: tasksData } = useQuery(GET_TASKS);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const variables: any = {
                input: { textContent: content },
            };

            if (targetType === 'task' && targetId) variables.taskId = targetId;
            if (targetType === 'project' && targetId) variables.projectId = targetId;
            if (targetType === 'event' && targetId) variables.eventId = targetId;

            await upsertNote({ variables });
            toast.success('Note saved successfully');
            setOpen(false);
            setContent('');
            setTargetType('none');
            setTargetId('');
        } catch (err) {
            toast.error('Failed to save note');
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button>Create Note</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Note</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Note Content</Label>
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your note here..."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Associate with...</Label>
                        <CustomSelect
                            value={targetType}
                            onValueChange={(val) => {
                                setTargetType(val);
                                setTargetId('');
                            }}
                        >
                            <CustomSelectItem value="none">None (Personal)</CustomSelectItem>
                            <CustomSelectItem value="project">Project</CustomSelectItem>
                            <CustomSelectItem value="task">Task</CustomSelectItem>
                            {/* Event support can be added later */}
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

                    <DialogFooter>
                        <Button type="submit" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Note'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
