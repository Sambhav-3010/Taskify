'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';
import { Task } from '@/lib/models';

interface TaskStatsProps {
    tasks: Task[];
}

export default function TaskStats({ tasks }: TaskStatsProps) {
    const totalTasks = tasks.length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const doneTasks = tasks.filter(t => t.status === 'done').length;
    const overdueTasks = tasks.filter(t => {
        const deadline = new Date(t.deadline);
        return deadline < new Date() && t.status !== 'done';
    }).length;

    const stats = [
        {
            title: 'Total Tasks',
            value: totalTasks,
            icon: ListTodo,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
        },
        {
            title: 'Completed',
            value: doneTasks,
            icon: CheckCircle2,
            color: 'text-green-500',
            bgColor: 'bg-green-500/10',
        },
        {
            title: 'In Progress',
            value: inProgressTasks,
            icon: Clock,
            color: 'text-amber-500',
            bgColor: 'bg-amber-500/10',
        },
        {
            title: 'Overdue',
            value: overdueTasks,
            icon: AlertCircle,
            color: 'text-red-500',
            bgColor: 'bg-red-500/10',
        },
    ];

    const completionRate = totalTasks > 0
        ? Math.round((doneTasks / totalTasks) * 100)
        : 0;

    return (
        <div className="grid gap-4 md:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                        <div className={`p-2 rounded-full ${stat.bgColor}`}>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        {stat.title === 'Total Tasks' && totalTasks > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                                {completionRate}% completion rate
                            </p>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
