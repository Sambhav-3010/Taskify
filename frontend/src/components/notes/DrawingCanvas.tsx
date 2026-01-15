'use client';

import { useCallback, useRef, useEffect, useState } from 'react';

interface DrawingCanvasProps {
    initialData?: string;
    onChange: (data: string) => void;
}

export default function DrawingCanvas({ initialData, onChange }: DrawingCanvasProps) {
    const [Excalidraw, setExcalidraw] = useState<typeof import('@excalidraw/excalidraw').Excalidraw | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const excalidrawRef = useRef<any>(null);
    const isInitialMount = useRef(true);
    useEffect(() => {
        import('@excalidraw/excalidraw').then((module) => {
            setExcalidraw(() => module.Excalidraw);
        });
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = useCallback((elements: readonly any[], appState: any) => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const data = JSON.stringify({
            elements,
            appState: {
                viewBackgroundColor: appState.viewBackgroundColor,
                currentItemStrokeColor: appState.currentItemStrokeColor,
                currentItemFillStyle: appState.currentItemFillStyle,
            },
        });
        onChange(data);
    }, [onChange]);

    // Parse initial data
    const initialElements = initialData ? (() => {
        try {
            const parsed = JSON.parse(initialData);
            return parsed.elements || [];
        } catch {
            return [];
        }
    })() : [];

    const initialAppState = initialData ? (() => {
        try {
            const parsed = JSON.parse(initialData);
            return parsed.appState || {};
        } catch {
            return {};
        }
    })() : {};

    if (!Excalidraw) {
        return (
            <div className="h-[400px] bg-muted/50 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Loading drawing canvas...</p>
            </div>
        );
    }

    return (
        <div className="h-[400px] rounded-lg overflow-hidden border border-border">
            <Excalidraw
                excalidrawAPI={(api) => (excalidrawRef.current = api)}
                initialData={{
                    elements: initialElements,
                    appState: {
                        viewBackgroundColor: '#ffffff',
                        ...initialAppState,
                    },
                }}
                onChange={handleChange}
                theme="light"
                UIOptions={{
                    canvasActions: {
                        loadScene: false,
                        saveAsImage: true,
                        export: false,
                    },
                }}
            />
        </div>
    );
}
