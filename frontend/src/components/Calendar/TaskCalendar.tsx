'use client';

import { useState, useCallback, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, View, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { Task } from '@/lib/models';
import { getStatusColor, getPriorityColor } from '@/lib/calendar-utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CalendarDays, List, Grid3X3 } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resource: Task;
}

interface TaskCalendarProps {
    tasks: Task[];
    onSelectSlot?: (slotInfo: SlotInfo) => void;
    onSelectEvent?: (event: CalendarEvent) => void;
}

export default function TaskCalendar({ tasks, onSelectSlot, onSelectEvent }: TaskCalendarProps) {
    const [view, setView] = useState<View>('month');
    const [date, setDate] = useState(new Date());

    const events: CalendarEvent[] = useMemo(() => {
        return tasks
            .filter(task => task.deadline)
            .map(task => ({
                id: task._id,
                title: task.title,
                start: new Date(task.deadline),
                end: new Date(new Date(task.deadline).getTime() + 60 * 60 * 1000), // 1 hour
                resource: task,
            }));
    }, [tasks]);

    const handleNavigate = useCallback((newDate: Date) => {
        setDate(newDate);
    }, []);

    const handleViewChange = useCallback((newView: View) => {
        setView(newView);
    }, []);

    const eventStyleGetter = useCallback((event: CalendarEvent) => {
        const task = event.resource;
        const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'done';

        let backgroundColor = getStatusColor(task.status);
        let borderColor = getPriorityColor(task.priority);

        if (isOverdue) {
            backgroundColor = '#dc2626'; // red for overdue
            borderColor = '#991b1b';
        }

        return {
            style: {
                backgroundColor,
                borderLeft: `4px solid ${borderColor}`,
                borderRadius: '6px',
                color: 'white',
                padding: '2px 6px',
                fontSize: '0.85rem',
                fontWeight: 500,
            },
        };
    }, []);

    const CustomToolbar = useCallback(({ label }: { label: string }) => {
        const goToBack = () => {
            const newDate = new Date(date);
            if (view === 'month') {
                newDate.setMonth(date.getMonth() - 1);
            } else if (view === 'week') {
                newDate.setDate(date.getDate() - 7);
            } else {
                newDate.setDate(date.getDate() - 1);
            }
            setDate(newDate);
        };

        const goToNext = () => {
            const newDate = new Date(date);
            if (view === 'month') {
                newDate.setMonth(date.getMonth() + 1);
            } else if (view === 'week') {
                newDate.setDate(date.getDate() + 7);
            } else {
                newDate.setDate(date.getDate() + 1);
            }
            setDate(newDate);
        };

        const goToToday = () => {
            setDate(new Date());
        };

        return (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 p-4 bg-card rounded-lg border border-border">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={goToBack}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={goToToday}>
                        Today
                    </Button>
                    <Button variant="outline" size="icon" onClick={goToNext}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <h2 className="text-xl font-bold text-foreground">{label}</h2>

                <div className="flex items-center gap-2">
                    <Button
                        variant={view === 'month' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setView('month')}
                    >
                        <Grid3X3 className="h-4 w-4 mr-1" />
                        Month
                    </Button>
                    <Button
                        variant={view === 'week' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setView('week')}
                    >
                        <CalendarDays className="h-4 w-4 mr-1" />
                        Week
                    </Button>
                    <Button
                        variant={view === 'agenda' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setView('agenda')}
                    >
                        <List className="h-4 w-4 mr-1" />
                        Agenda
                    </Button>
                </div>
            </div>
        );
    }, [date, view]);

    return (
        <div className="h-[700px] bg-card rounded-xl border border-border overflow-hidden">
            <style jsx global>{`
        .rbc-calendar {
          font-family: inherit;
        }
        .rbc-header {
          padding: 12px 8px;
          font-weight: 600;
          background: hsl(var(--muted));
          color: hsl(var(--foreground));
          border-bottom: 1px solid hsl(var(--border));
        }
        .rbc-month-view, .rbc-time-view {
          border: none;
        }
        .rbc-month-row {
          border-color: hsl(var(--border));
        }
        .rbc-day-bg {
          background: hsl(var(--card));
        }
        .rbc-day-bg.rbc-today {
          background: hsl(var(--primary) / 0.1);
        }
        .rbc-off-range-bg {
          background: hsl(var(--muted) / 0.5);
        }
        .rbc-date-cell {
          padding: 8px;
          color: hsl(var(--foreground));
        }
        .rbc-date-cell.rbc-now {
          font-weight: bold;
          color: hsl(var(--primary));
        }
        .rbc-event {
          border: none !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .rbc-event:hover {
          opacity: 0.9;
          transform: scale(1.02);
          transition: all 0.15s ease;
        }
        .rbc-show-more {
          color: hsl(var(--primary));
          font-weight: 600;
        }
        .rbc-agenda-view table.rbc-agenda-table {
          border: none;
        }
        .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
          border-color: hsl(var(--border));
          padding: 12px 8px;
        }
        .rbc-agenda-date-cell, .rbc-agenda-time-cell {
          color: hsl(var(--muted-foreground));
        }
        .rbc-agenda-event-cell {
          color: hsl(var(--foreground));
        }
        .rbc-time-header-content {
          border-color: hsl(var(--border));
        }
        .rbc-timeslot-group {
          border-color: hsl(var(--border));
        }
        .rbc-time-content {
          border-color: hsl(var(--border));
        }
        .rbc-time-slot {
          color: hsl(var(--muted-foreground));
        }
        .rbc-current-time-indicator {
          background-color: hsl(var(--primary));
        }
      `}</style>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                view={view}
                date={date}
                onNavigate={handleNavigate}
                onView={handleViewChange}
                onSelectSlot={onSelectSlot}
                onSelectEvent={onSelectEvent}
                selectable
                popup
                eventPropGetter={eventStyleGetter}
                components={{
                    toolbar: CustomToolbar,
                }}
                style={{ height: '100%' }}
            />
        </div>
    );
}
