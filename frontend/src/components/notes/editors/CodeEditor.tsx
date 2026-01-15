'use client';

import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface CodeEditorProps {
    code: string;
    language: string;
    onChange: (code: string, language: string) => void;
}

const LANGUAGES = [
    'javascript',
    'typescript',
    'python',
    'java',
    'cpp',
    'html',
    'css',
    'sql',
    'json',
    'markdown',
];

export function CodeEditor({ code, language, onChange }: CodeEditorProps) {
    return (
        <div className="space-y-4 h-[75vh] flex flex-col">
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Language:</span>
                <Select value={language} onValueChange={(val) => onChange(code, val)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                        {LANGUAGES.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                                {lang}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Textarea
                className="flex-1 font-mono text-sm resize-none bg-slate-950 text-slate-50 border-slate-800"
                value={code}
                onChange={(e) => onChange(e.target.value, language)}
                placeholder="// Write your code here..."
                spellCheck={false}
            />
        </div>
    );
}
