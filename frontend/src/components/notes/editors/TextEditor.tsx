'use client';

import { Textarea } from '@/components/ui/textarea';

interface TextEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export function TextEditor({ content, onChange }: TextEditorProps) {
    return (
        <div className="h-[75vh]">
            <Textarea
                className="h-full resize-none text-lg p-6 leading-relaxed"
                value={content}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Start writing your note..."
            />
        </div>
    );
}
