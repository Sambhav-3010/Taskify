'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Code, PenTool } from 'lucide-react';

interface NoteTypeSelectionProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectType: (type: 'text' | 'code' | 'drawing') => void;
}

export function NoteTypeSelection({ open, onOpenChange, onSelectType }: NoteTypeSelectionProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>What kind of note do you want to create?</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 py-4">
                    <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center gap-2 transition-all opacity-50 cursor-not-allowed"
                        disabled={true}
                    >
                        <PenTool className="h-6 w-6" />
                        <span className="font-semibold">Freehand Drawing</span>
                        <span className="text-xs font-bold text-primary">Coming soon</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary transition-all"
                        onClick={() => onSelectType('code')}
                    >
                        <Code className="h-6 w-6" />
                        <span className="font-semibold">Code Snippet</span>
                        <span className="text-xs text-muted-foreground font-normal">Save code blocks</span>
                    </Button>

                    <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary transition-all"
                        onClick={() => onSelectType('text')}
                    >
                        <FileText className="h-6 w-6" />
                        <span className="font-semibold">Text Note</span>
                        <span className="text-xs text-muted-foreground font-normal">Simple rich text</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
