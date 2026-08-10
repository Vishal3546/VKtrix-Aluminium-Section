import React from 'react';
import { DesignQueueItem } from './AutoDesignForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface DesignQueueTableProps {
  queue: DesignQueueItem[];
  onRowClick?: (item: DesignQueueItem) => void;
  onRemove?: (id: string) => void;
}

export default function DesignQueueTable({ queue, onRowClick, onRemove }: DesignQueueTableProps) {
  if (queue.length === 0) {
    return (
      <div className="border border-dashed rounded-lg p-8 text-center text-muted-foreground">
        No designs in the queue yet. Fill out the form above to generate one.
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-16">Sr.</TableHead>
            <TableHead>Party Name</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Design Code</TableHead>
            <TableHead className="text-right">Width (mm)</TableHead>
            <TableHead className="text-right">Height (mm)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-16 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queue.map((item) => (
            <TableRow 
              key={item.id} 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onRowClick?.(item)}
            >
              <TableCell className="font-medium">{item.sr}</TableCell>
              <TableCell>{item.partyName}</TableCell>
              <TableCell>{item.projectName}</TableCell>
              <TableCell>
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{item.designCode}</span>
              </TableCell>
              <TableCell className="text-right">{item.widthMm}</TableCell>
              <TableCell className="text-right">{item.heightMm}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-700 border-green-200">
                  {item.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                {onRemove && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(item.id);
                    }}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
