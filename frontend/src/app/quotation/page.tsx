"use client";

import React, { useEffect, useState } from 'react';
import QuotationView from '@/components/QuotationView';
import QuotationPDFTemplate from '@/components/QuotationPDFTemplate';
import { DesignQueueItem } from '@/components/AutoDesignForm';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function QuotationPage() {
  const [queue, setQueue] = useState<DesignQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Keep the queue for the PDF Template which hasn't been rewritten yet to use the new mockSavedDesigns.
    const saved = localStorage.getItem('quotation_queue');
    if (saved) {
      try {
        setQueue(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cached quotation_queue', e);
      }
    }
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
        <p className="text-muted-foreground">Loading quotation data...</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto space-y-8 print-simple-view">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Prepare Quotation</h1>
            <p className="text-muted-foreground mt-1">Select saved designs, adjust expenses, and generate final quote.</p>
          </div>
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" asChild>
              <Link href="/design">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Design
              </Link>
            </Button>
          </div>
        </div>

        <QuotationView />
      </div>

      {/* Hidden Print Wrapper for Detailed Design PDF */}
      <div className="hidden print-design-view bg-white text-black min-h-screen w-full">
        {queue.length > 0 ? (
          <QuotationPDFTemplate queue={queue} />
        ) : (
          <div className="p-12 text-center text-xl font-bold">No items in Quotation Queue to Print Design.</div>
        )}
      </div>
    </>
  );
}
