"use client";

import React, { useState } from 'react';
import AutoDesignForm, { DesignQueueItem } from '@/components/AutoDesignForm';
import DesignQueueTable from '@/components/DesignQueueTable';

export default function AutoDesignPage() {
  const [queue, setQueue] = useState<DesignQueueItem[]>([]);

  const handleAddToQueue = (item: DesignQueueItem) => {
    setQueue([...queue, item]);
  };

  const handleRemoveFromQueue = (id: string) => {
    setQueue(queue.filter(q => q.id !== id));
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
          <DesignQueueTable 
            queue={queue}
            onRemove={handleRemoveFromQueue}
          />
        </div>
      )}
    </div>
  );
}
