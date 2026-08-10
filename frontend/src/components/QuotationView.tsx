"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Save, Printer, Settings2, Calculator } from 'lucide-react';
import VerifyQuoteModal from './VerifyQuoteModal';
import ExpensesTaxPanel from './ExpensesTaxPanel';

export default function QuotationView() {
  const [selectedDesigns, setSelectedDesigns] = useState<any[]>([]);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isTaxPanelOpen, setIsTaxPanelOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [systemId, setSystemId] = useState("11111111-1111-1111-1111-111111111112"); // default system id
  const [savedPdfUrl, setSavedPdfUrl] = useState<string | null>(null);

  const [discountPct, setDiscountPct] = useState<number>(0);
  const [transportCost, setTransportCost] = useState<number>(0);
  const [loadingCost, setLoadingCost] = useState<number>(0);
  const [gstPct, setGstPct] = useState<number>(18);

  const [totals, setTotals] = useState({
    components: 0,
    areaSqFt: 0,
    basicValue: 0,
    discountAmount: 0,
    subTotal: 0,
    totalProjectCost: 0,
    gstAmount: 0,
    grandTotal: 0,
    avgPriceWithGst: 0,
    avgPriceWithoutGst: 0,
  });

  useEffect(() => {
    let components = 0;
    let areaSqFt = 0;
    let basicValue = 0;

    selectedDesigns.forEach(row => {
      components += Number(row.qty);
      const sqFt = ((row.widthMm * row.heightMm) / 92903.04);
      areaSqFt += (sqFt * row.qty);
      basicValue += (sqFt * row.qty * row.sqFtRate);
    });

    const discountAmount = basicValue * (discountPct / 100);
    const subTotal = basicValue - discountAmount;
    const totalProjectCost = subTotal + Number(transportCost) + Number(loadingCost);
    const gstAmount = totalProjectCost * (gstPct / 100);
    const grandTotal = totalProjectCost + gstAmount;
    
    const avgPriceWithoutGst = areaSqFt > 0 ? (totalProjectCost / areaSqFt) : 0;
    const avgPriceWithGst = areaSqFt > 0 ? (grandTotal / areaSqFt) : 0;

    setTotals({
      components,
      areaSqFt,
      basicValue,
      discountAmount,
      subTotal,
      totalProjectCost,
      gstAmount,
      grandTotal,
      avgPriceWithoutGst,
      avgPriceWithGst,
    });
  }, [selectedDesigns, discountPct, transportCost, loadingCost, gstPct]);

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleGenerateConfirm = (rows: any[]) => {
    setSelectedDesigns(rows);
    setIsVerifyModalOpen(false);
  };

  const printSimple = () => {
    document.body.classList.add('print-simple');
    document.body.classList.remove('print-design');
    window.print();
  };

  const printDesign = () => {
    document.body.classList.add('print-design');
    document.body.classList.remove('print-simple');
    window.print();
  };

  const handleSaveQuote = async () => {
    if (selectedDesigns.length === 0) return;
    setIsSaving(true);
    try {
      const payload = {
        projectId: "11111111-1111-1111-1111-111111111111", // Default project ID
        designIds: selectedDesigns.map((d: any) => d.id),
        systemId: systemId,
        ratePerSqFt: selectedDesigns[0]?.sqFtRate || 450,
        discountPercent: discountPct,
        transportationCost: transportCost,
        loadingUnloadingCost: loadingCost,
        gstPercent: gstPct
      };

      const res = await fetch("http://localhost:8080/api/quotations/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to save quotation");
      }

      const data = await res.json();
      setSavedPdfUrl(data.pdfUrl);
      alert(`Quotation ${data.quotationNumber} saved successfully!`);
    } catch (error) {
      console.error(error);
      alert("Error saving quotation. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = "w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

  return (
    <div className="space-y-6 print:hidden">
      
      {/* Header Config */}
      <Card className="bg-slate-50 border-slate-200 shadow-sm">
        <CardContent className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Date</label>
            <Input type="date" className={inputClass} defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Quotation No.</label>
            <Input className={`${inputClass} bg-slate-100 font-mono`} defaultValue="QT-2026-001" readOnly />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Party Name</label>
            <select className={inputClass}>
              <option>Acme Corp</option>
              <option>BuildWell Builders</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Project Name</label>
            <select className={inputClass}>
              <option>Acme HQ Renovation</option>
              <option>Acme Warehouse</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Profile System</label>
            <select className={inputClass} value={systemId} onChange={(e) => setSystemId(e.target.value)}>
              <option value="11111111-1111-1111-1111-111111111112">Jindal R40 Casement</option>
              <option value="11111111-1111-1111-1111-111111111113">Domus 2-Track Sliding</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Pricing Tier</label>
            <select className={inputClass}>
              <option>Standard</option>
              <option>Premium</option>
            </select>
          </div>
          <div>
            <Button variant="outline" className="w-full bg-white">
              <Calculator className="w-4 h-4 mr-2" /> Costing Rate
            </Button>
          </div>
          <div className="lg:col-span-2 flex justify-end">
            <Button size="lg" className="bg-brand-primary w-full md:w-auto" onClick={() => setIsVerifyModalOpen(true)}>
              <Settings2 className="w-5 h-5 mr-2" /> Click To Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Quotation Table */}
      <Card className="shadow-sm">
        <CardHeader className="bg-white border-b py-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Generated Quotation Items</CardTitle>
            <div className="text-sm text-slate-500 font-medium">Total Value: <span className="text-brand-primary font-bold">{formatINR(totals.grandTotal)}</span></div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {selectedDesigns.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No designs generated yet. Click "Click To Generate" to select designs.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="py-3 px-4 text-left font-medium text-slate-500">Sr</th>
                  <th className="py-3 px-4 text-left font-medium text-slate-500">Design</th>
                  <th className="py-3 px-4 text-left font-medium text-slate-500">Dimension</th>
                  <th className="py-3 px-4 text-left font-medium text-slate-500">Glass / Others</th>
                  <th className="py-3 px-4 text-right font-medium text-slate-500">Sq.Foot</th>
                  <th className="py-3 px-4 text-center font-medium text-slate-500">Qty</th>
                  <th className="py-3 px-4 text-right font-medium text-slate-500">Rate/SqFt</th>
                  <th className="py-3 px-4 text-right font-medium text-slate-500">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {selectedDesigns.map((row) => {
                  const sqFt = ((row.widthMm * row.heightMm) / 92903.04);
                  const amount = sqFt * row.qty * row.sqFtRate;
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-medium">{row.sr}</td>
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img src={row.thumbnail} className="w-10 h-10 border rounded bg-white" alt="thumb" />
                        <div>
                          <div className="font-semibold">{row.designName}</div>
                          <div className="text-xs text-muted-foreground">{row.shortDescription}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <div>{row.widthMm} x {row.heightMm} mm</div>
                        <div className="text-muted-foreground">{(row.widthMm/25.4).toFixed(1)}" x {(row.heightMm/25.4).toFixed(1)}"</div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        <div>{row.glass}</div>
                        <div className="text-muted-foreground truncate max-w-[120px]" title={row.fittings}>{row.fittings}</div>
                      </td>
                      <td className="py-3 px-4 text-right">{sqFt.toFixed(2)}</td>
                      <td className="py-3 px-4 text-center">{row.qty}</td>
                      <td className="py-3 px-4 text-right">{formatINR(row.sqFtRate)}</td>
                      <td className="py-3 px-4 text-right font-semibold text-brand-primary">{formatINR(amount)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button variant="outline" className="flex-1 border-slate-300" size="lg" onClick={() => setIsTaxPanelOpen(true)}>
          <Calculator className="mr-2 h-5 w-5" /> Expenses & Tax Adjustments
        </Button>
        <div className="flex-1 flex gap-3">
          <Button variant="secondary" className="flex-1" size="lg" onClick={handleSaveQuote} disabled={isSaving || selectedDesigns.length === 0}>
            {isSaving ? <span className="animate-spin mr-2">...</span> : <Save className="mr-2 h-5 w-5" />} 
            {isSaving ? "Saving..." : "Save Quote"}
          </Button>
          <Button variant="outline" className="flex-1" size="lg" onClick={printSimple} disabled={selectedDesigns.length === 0}>
            <Printer className="mr-2 h-5 w-5" /> Print (Simple)
          </Button>
          <Button className="flex-1 bg-brand-primary" size="lg" onClick={printDesign} disabled={selectedDesigns.length === 0}>
            <Printer className="mr-2 h-5 w-5" /> Print (Design)
          </Button>
        </div>
      </div>

      <VerifyQuoteModal 
        isOpen={isVerifyModalOpen} 
        onClose={() => setIsVerifyModalOpen(false)} 
        onConfirm={handleGenerateConfirm} 
      />

      <ExpensesTaxPanel 
        isOpen={isTaxPanelOpen}
        onClose={() => setIsTaxPanelOpen(false)}
        discountPct={discountPct} setDiscountPct={setDiscountPct}
        transportCost={transportCost} setTransportCost={setTransportCost}
        loadingCost={loadingCost} setLoadingCost={setLoadingCost}
        gstPct={gstPct} setGstPct={setGstPct}
        totals={totals} formatINR={formatINR}
      />
    </div>
  );
}
