'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const Excalidraw = dynamic(
    async () => (await import('@excalidraw/excalidraw')).Excalidraw,
    {
        ssr: false,
        loading: () => <Skeleton className="w-full h-[500px]" />,
    }
);

interface ExcalidrawEditorProps {
    initialData?: string;
    onChange: (data: string) => void;
}

export function ExcalidrawEditor({ initialData, onChange }: ExcalidrawEditorProps) {

    const handleChange = (elements: readonly any[], state: any) => {
        const jsonData = JSON.stringify(elements);
        onChange(jsonData);
    };

    return (
        <div className="h-[75vh] w-full border rounded-md overflow-hidden bg-white">
            <Excalidraw
                initialData={initialData ? { elements: JSON.parse(initialData) } : undefined}
                onChange={handleChange}
                UIOptions={{
                    canvasActions: {
                        loadScene: false,
                        saveToActiveFile: false,
                        export: false,
                    }
                }}
            />
        </div>
    );
}
