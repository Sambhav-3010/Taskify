'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { CustomSelect, CustomSelectItem } from '@/components/CustomSelect';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { CREATE_TASK, GET_PROJECTS, GET_TASKS } from '@/graphql';
import { Project } from '@/lib/models';

interface GraphQLProject {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    userId: string;
}

interface QuickAddTaskProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultDate?: Date;
    onSuccess?: () => void;
}

export default function QuickAddTask({ open, onOpenChange, defaultDate, onSuccess }: QuickAddTaskProps) {
    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState(defaultDate ? format(defaultDate, 'yyyy-MM-dd') : '');
    const [priority, setPriority] = useState('medium');
    const [status, setStatus] = useState('todo');
    const [projectId, setProjectId] = useState('no-project-selected');
    const [error, setError] = useState<string | null>(null);

    const { data: projectsData } = useQuery(GET_PROJECTS);
    const [createTaskMutation, { loading: creating }] = useMutation(CREATE_TASK, {
        refetchQueries: [{ query: GET_TASKS }],
    });

    const projects: Project[] = projectsData?.projects?.map((p: GraphQLProject) => ({
        _id: p.id,
        name: p.name,
        description: p.description,
        createdAt: p.createdAt,
        userId: p.userId,
    })) || [];

    const resetForm = () => {
        setTitle('');
        setDeadline(defaultDate ? format(defaultDate, 'yyyy-MM-dd') : '');
        setPriority('medium');
        setStatus('todo');
        setProjectId('no-project-selected');
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        if (!deadline) {
            setError('Deadline is required');
            return;
        }

        try {
            const { data } = await createTaskMutation({
                variables: {
                    input: {
                        title: title.trim(),
                        deadline,
                        priority,
                        status,
                        projectId: projectId === 'no-project-selected' ? null : projectId,
                    },
                },
            });

            if (data?.createTask) {
                toast.success('Task created successfully!');
                resetForm();
                onOpenChange(false);
                onSuccess?.();
            }
        } catch (err) {
            console.error('Failed to create task:', err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to create task');
            }
        }
    };

    const priorityOptions = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
    ];

    const statusOptions = [
        { value: 'todo', label: 'To Do' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'done', label: 'Done' },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Quick Add Task</DialogTitle>
                    <DialogDescription>
                        Create a new task quickly. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter task title..."
                                disabled={creating}
                                autoFocus
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="deadline">Deadline *</Label>
                            <Input
                                id="deadline"
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                disabled={creating}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Priority</Label>
                                <CustomSelect
                                    value={priority}
                                    onValueChange={setPriority}
                                    placeholder="Priority"
                                    disabled={creating}
                                >
                                    {priorityOptions.map((option) => (
                                        <CustomSelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </CustomSelectItem>
                                    ))}
                                </CustomSelect>
                            </div>
                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <CustomSelect
                                    value={status}
                                    onValueChange={setStatus}
                                    placeholder="Status"
                                    disabled={creating}
                                >
                                    {statusOptions.map((option) => (
                                        <CustomSelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </CustomSelectItem>
                                    ))}
                                </CustomSelect>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Project (Optional)</Label>
                            <CustomSelect
                                value={projectId}
                                onValueChange={setProjectId}
                                placeholder="Select project"
                                disabled={creating}
                            >
                                <CustomSelectItem value="no-project-selected">No Project</CustomSelectItem>
                                {projects.map((project) => (
                                    <CustomSelectItem key={project._id} value={project._id}>
                                        {project.name}
                                    </CustomSelectItem>
                                ))}
                            </CustomSelect>
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={creating}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={creating}>
                            {creating ? 'Creating...' : 'Create Task'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
