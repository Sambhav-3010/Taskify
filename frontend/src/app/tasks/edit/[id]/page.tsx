'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Project } from '@/lib/models';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomSelect, CustomSelectItem } from '@/components/CustomSelect';
import { ArrowLeft, FileText, Code, Pencil, Eye, Edit } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { GET_TASK, GET_PROJECTS, UPDATE_TASK } from '@/graphql';
import { toast } from 'sonner';
import { NotePreviewModal } from '@/components/notes/NotePreviewModal';

const GET_NOTES_BY_TASK = gql`
  query GetNotesByTask($taskId: ID!) {
    notesByTask(taskId: $taskId) {
      id
      title
      description
      textContent
      codeBlocks {
        language
        code
      }
      drawingData
      type
      createdAt
      updatedAt
    }
  }
`;

interface GraphQLProject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  userId: string;
}

export default function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [projectId, setProjectId] = useState('no-project-selected');
  const [error, setError] = useState<string | null>(null);

  const { data: taskData, loading: taskLoading } = useQuery(GET_TASK, {
    variables: { id },
    skip: !user,
    onCompleted: (data) => {
      if (data?.task) {
        setTitle(data.task.title);
        setDeadline(data.task.deadline ? new Date(data.task.deadline).toISOString().slice(0, 16) : '');
        setPriority(data.task.priority || 'medium');
        setStatus(data.task.status || 'todo');
        setProjectId(data.task.projectId || 'no-project-selected');
      }
    },
  });

  const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS, {
    skip: !user,
  });

  const { data: notesData, loading: notesLoading } = useQuery(GET_NOTES_BY_TASK, {
    variables: { taskId: id },
    skip: !user || !id,
  });

  const [updateTaskMutation, { loading: updating }] = useMutation(UPDATE_TASK);

  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const projects: Project[] = projectsData?.projects?.map((p: GraphQLProject) => ({
    _id: p.id,
    name: p.name,
    description: p.description,
    createdAt: p.createdAt,
    userId: p.userId,
  })) || [];

  const loading = taskLoading || projectsLoading;

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const { data } = await updateTaskMutation({
        variables: {
          id,
          input: {
            title,
            deadline: deadline ? new Date(deadline).toISOString() : undefined,
            priority,
            status,
            projectId: projectId === 'no-project-selected' ? null : projectId,
          },
        },
      });
      if (data?.updateTask) {
        toast.success('Task updated successfully!');
        router.push('/tasks');
      }
    } catch (err) {
      console.error('Failed to update task:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update task.');
      }
    }
  };

  const handleViewNote = (note: any) => {
    setSelectedNote(note);
    setIsPreviewOpen(true);
  };

  const handleEditNote = (note: any) => {
    let effectiveType = note.type;
    if (note.type === 'text' && note.codeBlocks && note.codeBlocks.length > 0 && !note.textContent) {
      effectiveType = 'code';
    } else if (note.type === 'text' && note.drawingData && !note.textContent) {
      effectiveType = 'drawing';
    }
    router.push(`/notes/new?type=${effectiveType}&noteId=${note.id}`);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-start justify-center pt-8">
        <Card className="w-full max-w-2xl mx-auto glass-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" className="mr-2" disabled>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Skeleton className="h-8 w-1/2" />
              <div className="w-10"></div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!taskData?.task) {
    return <div className="container mx-auto p-4">Task not found.</div>;
  }

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
    <div className="min-h-screen bg-background p-4 pt-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="glass-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <Link href="/tasks">
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <CardTitle className="text-2xl font-bold text-center flex-grow">Edit Task</CardTitle>
              <div className="w-10"></div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={updating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  disabled={updating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <CustomSelect
                  value={priority}
                  onValueChange={setPriority}
                  placeholder="Select priority"
                  disabled={updating}
                >
                  {priorityOptions.map((option) => (
                    <CustomSelectItem key={option.value} value={option.value}>
                      {option.label}
                    </CustomSelectItem>
                  ))}
                </CustomSelect>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <CustomSelect
                  value={status}
                  onValueChange={setStatus}
                  placeholder="Select status"
                  disabled={updating}
                >
                  {statusOptions.map((option) => (
                    <CustomSelectItem key={option.value} value={option.value}>
                      {option.label}
                    </CustomSelectItem>
                  ))}
                </CustomSelect>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <CustomSelect
                  value={projectId}
                  onValueChange={setProjectId}
                  placeholder="Select project (optional)"
                  disabled={updating}
                >
                  <CustomSelectItem value="no-project-selected">No Project</CustomSelectItem>
                  {projects.map((project) => (
                    <CustomSelectItem key={project._id} value={project._id}>
                      {project.name}
                    </CustomSelectItem>
                  ))}
                </CustomSelect>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={updating}>
                {updating ? 'Updating...' : 'Update Task'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Linked Notes Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold px-1">Linked Notes</h3>
          {notesLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : notesData?.notesByTask?.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {notesData.notesByTask.map((note: any) => (
                <Card key={note.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {note.type === 'code' ? <Code className="h-4 w-4 text-muted-foreground" /> :
                          note.type === 'drawing' ? <Pencil className="h-4 w-4 text-muted-foreground" /> :
                            <FileText className="h-4 w-4 text-muted-foreground" />}
                        <CardTitle className="text-base font-medium truncate w-32 md:w-48">
                          {note.title || 'Untitled Note'}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {note.description || 'No description'}
                    </p>
                  </CardContent>
                  <div className="p-4 pt-0 flex gap-2 mt-auto">
                    <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleViewNote(note)}>
                      <Eye className="h-3 w-3" /> View
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1 gap-1" onClick={() => handleEditNote(note)}>
                      <Edit className="h-3 w-3" /> Edit
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded-lg bg-slate-50 dark:bg-slate-900 text-muted-foreground">
              No notes linked to this task.
            </div>
          )}
        </div>

        <NotePreviewModal
          note={selectedNote}
          isOpen={isPreviewOpen}
          onClose={setIsPreviewOpen}
          onEdit={handleEditNote}
          onDelete={() => { }}
          deleting={false}
        />
      </div>
    </div>
  );
}
