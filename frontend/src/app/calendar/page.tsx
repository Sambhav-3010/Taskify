'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { useAuth } from '@/context/AuthContext';
import { Task, Project } from '@/lib/models';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Download } from 'lucide-react';
import { SlotInfo } from 'react-big-calendar';
import dynamic from 'next/dynamic';
import { GET_TASKS } from '@/graphql';
import { generateICSBatch, downloadICS, CalendarTask } from '@/lib/calendar-utils';
import { toast } from 'sonner';
import QuickAddTask from '@/components/Calendar/QuickAddTask';

// Dynamic import to avoid SSR issues with react-big-calendar
const TaskCalendar = dynamic(() => import('@/components/Calendar/TaskCalendar'), {
    ssr: false,
    loading: () => (
        <div className="h-[700px] bg-card rounded-xl border border-border p-8">
            <Skeleton className="h-16 w-full mb-4" />
            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                ))}
            </div>
        </div>
    ),
});

interface GraphQLTask {
    id: string;
    title: string;
    status: string;
    priority: string;
    deadline: string;
    projectId: string | null;
    project?: { id: string; name: string } | null;
    userId: string;
}

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resource: Task;
}

export default function CalendarPage() {
    const [quickAddOpen, setQuickAddOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const { data, loading, refetch } = useQuery(GET_TASKS, {
        skip: !user,
    });

    const tasks: Task[] = data?.tasks?.tasks?.map((t: GraphQLTask) => ({
        _id: t.id,
        title: t.title,
        status: t.status as Task['status'],
        priority: t.priority as Task['priority'],
        deadline: t.deadline,
        projectId: t.project ? { _id: t.project.id, name: t.project.name } as unknown as Project : t.projectId,
        projectName: t.project?.name,
        userId: t.userId,
    })) || [];

    const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
        setSelectedDate(slotInfo.start);
        setQuickAddOpen(true);
    }, []);

    const handleSelectEvent = useCallback((event: CalendarEvent) => {
        // Navigate to edit page
        router.push(`/tasks/edit/${event.resource._id}`);
    }, [router]);

    const handleExportAll = useCallback(() => {
        if (tasks.length === 0) {
            toast.error('No tasks to export');
            return;
        }

        const calendarTasks: CalendarTask[] = tasks
            .filter(task => task.deadline)
            .map(task => ({
                id: task._id,
                title: task.title,
                deadline: new Date(task.deadline),
                status: task.status,
                priority: task.priority,
                projectName: typeof task.projectId === 'object' && task.projectId
                    ? (task.projectId as { name: string }).name
                    : undefined,
            }));

        const icsContent = generateICSBatch(calendarTasks);
        downloadICS(icsContent, 'taskify-tasks.ics');
        toast.success(`Exported ${calendarTasks.length} tasks to calendar file`);
    }, [tasks]);

    const handleTaskSuccess = useCallback(() => {
        refetch();
    }, [refetch]);

    if (authLoading) {
        return (
            <div className="min-h-screen bg-background p-4">
                <div className="max-w-7xl mx-auto">
                    <Skeleton className="h-10 w-48 mb-8" />
                    <Skeleton className="h-[700px] w-full rounded-xl" />
                </div>
            </div>
        );
    }

    if (!user) {
        router.push('/auth/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Calendar</h1>
                        <p className="text-muted-foreground">
                            View and manage your tasks on the calendar. Click any date to add a task.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleExportAll}>
                            <Download className="h-4 w-4 mr-2" />
                            Export All
                        </Button>
                        <Button onClick={() => { setSelectedDate(new Date()); setQuickAddOpen(true); }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Task
                        </Button>
                    </div>
                </div>

                {/* Legend */}
                <Card className="mb-6">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Legend</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-gray-500"></div>
                            <span className="text-sm text-muted-foreground">To Do</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-blue-500"></div>
                            <span className="text-sm text-muted-foreground">In Progress</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-green-500"></div>
                            <span className="text-sm text-muted-foreground">Done</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-red-600"></div>
                            <span className="text-sm text-muted-foreground">Overdue</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Calendar */}
                {loading ? (
                    <div className="h-[700px] bg-card rounded-xl border border-border p-8">
                        <Skeleton className="h-16 w-full mb-4" />
                        <div className="grid grid-cols-7 gap-2">
                            {Array.from({ length: 35 }).map((_, i) => (
                                <Skeleton key={i} className="h-20 w-full" />
                            ))}
                        </div>
                    </div>
                ) : (
                    <TaskCalendar
                        tasks={tasks}
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={handleSelectEvent}
                    />
                )}

                {/* Quick Add Task Dialog */}
                <QuickAddTask
                    open={quickAddOpen}
                    onOpenChange={setQuickAddOpen}
                    defaultDate={selectedDate}
                    onSuccess={handleTaskSuccess}
                />
            </div>
        </div>
    );
}
