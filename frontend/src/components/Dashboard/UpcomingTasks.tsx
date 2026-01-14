'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, AlertTriangle, ExternalLink } from 'lucide-react';
import { Task } from '@/lib/models';
import { Button } from '@/components/ui/button';
import { generateGoogleCalendarURL, CalendarTask } from '@/lib/calendar-utils';
import Link from 'next/link';
import { format, isToday, isTomorrow, isPast, addDays } from 'date-fns';

interface UpcomingTasksProps {
    tasks: Task[];
}

export default function UpcomingTasks({ tasks }: UpcomingTasksProps) {
    const now = new Date();
    const nextWeek = addDays(now, 7);

    // Filter upcoming tasks (not done, deadline in next 7 days or overdue)
    const upcomingTasks = tasks
        .filter(task => {
            if (task.status === 'done') return false;
            const deadline = new Date(task.deadline);
            return deadline <= nextWeek;
        })
        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        .slice(0, 5);

    const getDeadlineLabel = (deadline: Date): { label: string; className: string } => {
        if (isPast(deadline) && !isToday(deadline)) {
            return { label: 'Overdue', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' };
        }
        if (isToday(deadline)) {
            return { label: 'Today', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' };
        }
        if (isTomorrow(deadline)) {
            return { label: 'Tomorrow', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' };
        }
        return { label: format(deadline, 'MMM d'), className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' };
    };

    const handleAddToCalendar = (task: Task) => {
        const calendarTask: CalendarTask = {
            id: task._id,
            title: task.title,
            deadline: new Date(task.deadline),
            status: task.status,
            priority: task.priority,
            projectName: typeof task.projectId === 'object' && task.projectId
                ? (task.projectId as { name: string }).name
                : undefined,
        };

        const url = generateGoogleCalendarURL(calendarTask);
        window.open(url, '_blank');
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Upcoming Deadlines</CardTitle>
                <Link href="/calendar">
                    <Button variant="ghost" size="sm">
                        <CalendarDays className="h-4 w-4 mr-1" />
                        View Calendar
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                {upcomingTasks.length === 0 ? (
                    <p className="text-muted-foreground text-sm py-4 text-center">
                        No upcoming tasks in the next 7 days 🎉
                    </p>
                ) : (
                    <div className="space-y-3">
                        {upcomingTasks.map((task) => {
                            const deadline = new Date(task.deadline);
                            const { label, className } = getDeadlineLabel(deadline);
                            const isOverdue = isPast(deadline) && !isToday(deadline);

                            return (
                                <div
                                    key={task._id}
                                    className={`flex items-center justify-between p-3 rounded-lg border ${isOverdue ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/10' : 'border-border'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        {isOverdue && <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />}
                                        <div className="min-w-0">
                                            <p className="font-medium truncate">{task.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {format(deadline, 'MMM d, yyyy • h:mm a')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <Badge className={className}>{label}</Badge>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleAddToCalendar(task)}
                                            title="Add to Google Calendar"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
