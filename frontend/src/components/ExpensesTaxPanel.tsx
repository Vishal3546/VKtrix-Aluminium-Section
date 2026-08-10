import React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';

interface ExpensesTaxPanelProps {
  isOpen: boolean;
  onClose: () => void;
  discountPct: number;
  setDiscountPct: (v: number) => void;
  transportCost: number;
  setTransportCost: (v: number) => void;
  loadingCost: number;
  setLoadingCost: (v: number) => void;
  gstPct: number;
  setGstPct: (v: number) => void;
  totals: any;
  formatINR: (v: number) => string;
}

export default function ExpensesTaxPanel({
  isOpen, onClose, discountPct, setDiscountPct, transportCost, setTransportCost,
  loadingCost, setLoadingCost, gstPct, setGstPct, totals, formatINR
}: ExpensesTaxPanelProps) {
  
  if (!isOpen) return null;

  const inputClass = "w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-right";

  return (
    <div className="fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl border-l z-50 flex flex-col transform transition-transform">
      <CardHeader className="flex flex-row items-center justify-between bg-slate-50 border-b py-4">
        <CardTitle className="text-lg">Expenses & Taxes</CardTitle>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
      </CardHeader>
      
      <CardContent className="p-6 flex-1 overflow-y-auto space-y-6">
        
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Adjustments</h3>
          
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Discount (%)</label>
            <div className="flex items-center gap-2">
              <Input type="number" className={inputClass} value={discountPct} onChange={e => setDiscountPct(Number(e.target.value))} min={0} max={100} />
            </div>
          </div>
          
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Transportation Cost (₹)</label>
            <Input type="number" className={inputClass} value={transportCost} onChange={e => setTransportCost(Number(e.target.value))} min={0} />
          </div>
          
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Loading & Unloading (₹)</label>
            <Input type="number" className={inputClass} value={loadingCost} onChange={e => setLoadingCost(Number(e.target.value))} min={0} />
          </div>
          
          <div className="border-t pt-4">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">GST (%)</label>
            <Input type="number" className={inputClass} value={gstPct} onChange={e => setGstPct(Number(e.target.value))} min={0} max={100} />
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-3 mt-6">
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 border-b pb-2">Live Summary</h3>
          
          <div className="flex justify-between text-sm font-medium">
            <span>Basic Value</span>
            <span>{formatINR(totals.basicValue)}</span>
          </div>
          <div className="flex justify-between text-sm text-red-500">
            <span>Discount ({discountPct}%)</span>
            <span>- {formatINR(totals.discountAmount)}</span>
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t">
            <span>Sub Total</span>
            <span>{formatINR(totals.subTotal)}</span>
          </div>
          <div className="flex justify-between text-sm pt-2">
            <span className="text-muted-foreground">Transport + Loading</span>
            <span>{formatINR(totals.totalProjectCost - totals.subTotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">GST ({gstPct}%)</span>
            <span>{formatINR(totals.gstAmount)}</span>
          </div>
          
          <div className="flex justify-between items-center text-lg font-bold text-brand-primary pt-4 border-t mt-4">
            <span>Grand Total</span>
            <span>{formatINR(totals.grandTotal)}</span>
          </div>
        </div>

      </CardContent>
    </div>
  );
}
