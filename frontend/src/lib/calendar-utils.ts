import { format } from 'date-fns';

export interface CalendarTask {
    id: string;
    title: string;
    deadline: Date;
    status: string;
    priority: string;
    projectName?: string;
}

/**
 * Generate ICS file content for a single task
 */
export function generateICS(task: CalendarTask): string {
    const now = new Date();
    const uid = `task-${task.id}@taskify`;
    const dtstamp = formatICSDate(now);
    const dtstart = formatICSDate(task.deadline);
    const dtend = formatICSDate(new Date(task.deadline.getTime() + 60 * 60 * 1000)); // 1 hour duration

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Taskify//Task Manager//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART:${dtstart}
DTEND:${dtend}
SUMMARY:${escapeICSText(task.title)}
DESCRIPTION:Priority: ${task.priority}\\nStatus: ${task.status}${task.projectName ? `\\nProject: ${task.projectName}` : ''}
STATUS:${task.status === 'done' ? 'COMPLETED' : 'CONFIRMED'}
END:VEVENT
END:VCALENDAR`;
}

/**
 * Generate ICS file content for multiple tasks
 */
export function generateICSBatch(tasks: CalendarTask[]): string {
    const now = new Date();
    const dtstamp = formatICSDate(now);

    const events = tasks.map(task => {
        const uid = `task-${task.id}@taskify`;
        const dtstart = formatICSDate(task.deadline);
        const dtend = formatICSDate(new Date(task.deadline.getTime() + 60 * 60 * 1000));

        return `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
DTSTART:${dtstart}
DTEND:${dtend}
SUMMARY:${escapeICSText(task.title)}
DESCRIPTION:Priority: ${task.priority}\\nStatus: ${task.status}${task.projectName ? `\\nProject: ${task.projectName}` : ''}
STATUS:${task.status === 'done' ? 'COMPLETED' : 'CONFIRMED'}
END:VEVENT`;
    }).join('\n');

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Taskify//Task Manager//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
${events}
END:VCALENDAR`;
}

/**
 * Download ICS file
 */
export function downloadICS(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.ics') ? filename : `${filename}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Generate Google Calendar URL for a task
 */
export function generateGoogleCalendarURL(task: CalendarTask): string {
    const startDate = format(task.deadline, "yyyyMMdd'T'HHmmss");
    const endDate = format(new Date(task.deadline.getTime() + 60 * 60 * 1000), "yyyyMMdd'T'HHmmss");

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: task.title,
        dates: `${startDate}/${endDate}`,
        details: `Priority: ${task.priority}\nStatus: ${task.status}${task.projectName ? `\nProject: ${task.projectName}` : ''}`,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Format date for ICS format (YYYYMMDDTHHmmssZ)
 */
function formatICSDate(date: Date): string {
    return format(date, "yyyyMMdd'T'HHmmss'Z'");
}

/**
 * Escape text for ICS format
 */
function escapeICSText(text: string): string {
    return text
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n');
}

/**
 * Get status color for calendar events
 */
export function getStatusColor(status: string): string {
    switch (status) {
        case 'done':
            return '#22c55e'; // green
        case 'in-progress':
            return '#3b82f6'; // blue
        case 'todo':
        default:
            return '#6b7280'; // gray
    }
}

/**
 * Get priority color for calendar events
 */
export function getPriorityColor(priority: string): string {
    switch (priority) {
        case 'high':
            return '#ef4444'; // red
        case 'medium':
            return '#f59e0b'; // amber
        case 'low':
        default:
            return '#22c55e'; // green
    }
}
