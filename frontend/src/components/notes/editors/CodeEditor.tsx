import { Editor } from '@monaco-editor/react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

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
        <div className="space-y-4 h-full flex flex-col">
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

            <div className="flex-1 border rounded-md overflow-hidden shadow-sm bg-[#1e1e1e]">
                <Editor
                    height="100%"
                    language={language}
                    value={code}
                    theme="vs-dark"
                    onChange={(value) => onChange(value || '', language)}
                    loading={<div className="flex items-center justify-center h-full text-slate-400"><Loader2 className="w-6 h-6 animate-spin mr-2" />Loading Editor...</div>}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: 'on',
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        padding: { top: 16, bottom: 16 },
                    }}
                />
            </div>
        </div>
    );
}
