"use client";

import React from 'react';
import DesignCanvas from './DesignCanvas';
import { Button } from './ui/button';
import { DesignData, DesignPanel } from './DesignCanvasCore';
import { DesignQueueItem } from './AutoDesignForm';
import { X } from 'lucide-react';

interface DesignCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  queueItem: DesignQueueItem | null;
  onUpdateLayout: (itemId: string, newLayout: DesignData) => void;
}

export default function DesignCanvasModal({ isOpen, onClose, queueItem, onUpdateLayout }: DesignCanvasModalProps) {
  if (!isOpen || !queueItem) return null;

  const design: DesignData = queueItem.layoutData;

  const handleUpdatePanel = (panelId: string, updates: Partial<DesignPanel>) => {
    const newDesign = {
      ...design,
      panels: design.panels.map(p => p.id === panelId ? { ...p, ...updates } : p)
    };
    onUpdateLayout(queueItem.id, newDesign);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between border-b px-6 bg-background shadow-sm">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Fine-tuning Design: <span className="font-mono text-muted-foreground ml-2">{queueItem.designCode}</span>
          </h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto bg-muted/20 p-6">
        <div className="mx-auto max-w-5xl bg-background rounded-xl shadow-sm border p-4">
          <DesignCanvas design={design} onUpdatePanel={handleUpdatePanel} />
        </div>
      </div>
    </div>
  );
}
