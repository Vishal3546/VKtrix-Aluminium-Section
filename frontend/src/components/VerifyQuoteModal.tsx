import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { mockSavedDesigns } from '@/lib/mockApi';

interface VerifyQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedRows: any[]) => void;
}

export default function VerifyQuoteModal({ isOpen, onClose, onConfirm }: VerifyQuoteModalProps) {
  const [rows, setRows] = useState(mockSavedDesigns.map(r => ({ ...r, checked: false })));

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    setRows(rows.map(r => r.id === id ? { ...r, checked: !r.checked } : r));
  };

  const updateRow = (id: string, field: string, value: string) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: Number(value) || 0 } : r));
  };

  const handleConfirm = () => {
    onConfirm(rows.filter(r => r.checked));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-6xl shadow-xl flex flex-col max-h-[90vh]">
        <CardHeader className="flex flex-row items-center justify-between bg-slate-50 border-b py-4 px-6 shrink-0">
          <CardTitle className="text-xl">Verify Your Quote Value</CardTitle>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
        </CardHeader>
        
        <CardContent className="p-0 overflow-auto flex-1">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 border-b sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-slate-500 w-12">Select</th>
                <th className="py-3 px-4 text-left font-medium text-slate-500">Sr</th>
                <th className="py-3 px-4 text-left font-medium text-slate-500">Image</th>
                <th className="py-3 px-4 text-left font-medium text-slate-500">Design Name</th>
                <th className="py-3 px-4 text-left font-medium text-slate-500 min-w-[150px]">Dimension</th>
                <th className="py-3 px-4 text-left font-medium text-slate-500">Profile / Glass / Fittings</th>
                <th className="py-3 px-4 text-right font-medium text-slate-500">Sq.Foot</th>
                <th className="py-3 px-4 text-center font-medium text-slate-500 w-24">Qty</th>
                <th className="py-3 px-4 text-center font-medium text-slate-500 w-28">Rate/SqFt</th>
                <th className="py-3 px-4 text-right font-medium text-slate-500">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((row) => {
                const sqFt = ((row.widthMm * row.heightMm) / 92903.04);
                const amount = sqFt * row.qty * row.sqFtRate;
                const inchesW = (row.widthMm / 25.4).toFixed(2);
                const inchesH = (row.heightMm / 25.4).toFixed(2);
                
                return (
                  <tr key={row.id} className={`hover:bg-slate-50 transition-colors ${row.checked ? 'bg-blue-50/30' : ''}`}>
                    <td className="py-3 px-4">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded cursor-pointer"
                        checked={row.checked} 
                        onChange={() => toggleCheck(row.id)} 
                      />
                    </td>
                    <td className="py-3 px-4 font-medium">{row.sr}</td>
                    <td className="py-3 px-4">
                      <img src={row.thumbnail} alt="thumb" className="w-12 h-12 border object-cover rounded bg-white" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{row.designName}</div>
                      <div className="text-xs text-muted-foreground">{row.shortDescription}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      <div>{row.widthMm} x {row.heightMm} mm</div>
                      <div className="text-muted-foreground">{inchesW}" x {inchesH}"</div>
                    </td>
                    <td className="py-3 px-4 text-xs space-y-1 text-slate-600">
                      <div><span className="font-semibold">Sys:</span> {row.profileSystem}</div>
                      <div><span className="font-semibold">Gls:</span> {row.glass}</div>
                      <div className="truncate max-w-[150px]" title={row.fittings}><span className="font-semibold">Fit:</span> {row.fittings}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700">{sqFt.toFixed(2)}</td>
                    <td className="py-3 px-2 text-center">
                      <Input 
                        type="number" 
                        className="h-8 w-16 text-center mx-auto" 
                        value={row.qty} 
                        onChange={e => updateRow(row.id, 'qty', e.target.value)} 
                        min={1} 
                      />
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Input 
                        type="number" 
                        className="h-8 w-20 text-center mx-auto" 
                        value={row.sqFtRate} 
                        onChange={e => updateRow(row.id, 'sqFtRate', e.target.value)} 
                        min={0} 
                      />
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-brand-primary">
                      {amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
        
        <CardFooter className="bg-slate-50 border-t py-4 px-6 flex justify-end gap-3 shrink-0">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} className="bg-brand-primary min-w-[120px]">
            Confirm Selection
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
