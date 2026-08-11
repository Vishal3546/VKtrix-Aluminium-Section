"use client";

import React, { useState, useEffect } from 'react';
import AutoDesignForm, { DesignQueueItem } from '@/components/AutoDesignForm';
import DesignQueueTable from '@/components/DesignQueueTable';
import DesignCanvasModal from '@/components/DesignCanvasModal';
import { DesignData } from '@/components/DesignCanvasCore';

export default function AutoDesignPage() {
  const [queue, setQueue] = useState<DesignQueueItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<DesignQueueItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('autoDesignQueue');
    if (saved) {
      try {
        setQueue(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse queue from local storage');
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('autoDesignQueue', JSON.stringify(queue));
    }
  }, [queue, isLoaded]);

  const handleAddToQueue = (item: DesignQueueItem) => {
    setQueue([...queue, item]);
  };

  const handleRemoveFromQueue = (id: string) => {
    setQueue(queue.filter(q => q.id !== id));
  };

  const handleRowClick = (item: DesignQueueItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleUpdateLayout = (itemId: string, newLayout: DesignData) => {
    setQueue(queue.map(q => q.id === itemId ? { ...q, layoutData: newLayout } : q));
    if (selectedItem?.id === itemId) {
      setSelectedItem({ ...selectedItem, layoutData: newLayout });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Auto Design</h1>
        <p className="text-muted-foreground mt-1">Automatically generate design layouts based on predefined profile systems and types.</p>
      </div>

      <AutoDesignForm 
        onAddToQueue={handleAddToQueue}
        nextSrNumber={queue.length + 1}
      />

      {queue.length > 0 && (
        <div className="mt-8">
          <p className="text-sm text-muted-foreground mb-2">Click on a row to view and fine-tune its design drawing.</p>
          <DesignQueueTable 
            queue={queue}
            onRemove={handleRemoveFromQueue}
            onRowClick={handleRowClick}
          />
        </div>
      )}

      <DesignCanvasModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        queueItem={selectedItem}
        onUpdateLayout={handleUpdateLayout}
      />
    </div>
  );
}
