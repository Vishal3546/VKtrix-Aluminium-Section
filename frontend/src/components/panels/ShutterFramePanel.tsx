import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ShutterFramePanelProps {
  onApply: () => void;
}

export default function ShutterFramePanel({ onApply }: ShutterFramePanelProps) {
  const inputClass = "w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";
  
  const [shutterH, setShutterH] = useState('68.8');
  const [shutterW, setShutterW] = useState('80.0');
  const [glassH, setGlassH] = useState('103.5');
  const [glassW, setGlassW] = useState('42.0');

  const handleSoftwareCalc = () => {
    // Mock deriving deduction logic
    setShutterH('68.8');
    setShutterW('80.0');
    setGlassH('103.5');
    setGlassW('42.0');
    alert("Deductions auto-calculated based on Profile spec (2 * Wall Thickness + Overlap).");
  };

  return (
    <Card className="h-full rounded-none border-0 border-l">
      <CardHeader className="bg-slate-50 border-b py-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Shutter Frame Profile</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 70px)' }}>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Angle</label>
            <select className={inputClass} defaultValue="45">
              <option value="45">45°</option>
              <option value="90">90°</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Right Angle</label>
            <select className={inputClass} defaultValue="90">
              <option value="45">45°</option>
              <option value="90">90°</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 border p-3 rounded-md bg-slate-50 relative">
          <div className="absolute right-3 top-3 w-12 h-16 border-4 border-slate-300 rounded-sm"></div>
          
          <div className="w-2/3">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Top Frame</label>
            <select className={inputClass}>
              <option>Standard Top Track</option>
            </select>
          </div>
          <div className="w-2/3">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Left Frame</label>
            <select className={inputClass}>
              <option>Standard Side Track</option>
            </select>
          </div>
          <div className="w-2/3">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Right Frame</label>
            <select className={inputClass} defaultValue="interlock">
              <option value="standard">Standard Side Track</option>
              <option value="interlock">Interlock Section</option>
            </select>
          </div>
          <div className="w-2/3">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Bottom Frame</label>
            <select className={inputClass}>
              <option>Standard Bottom Track</option>
            </select>
          </div>
        </div>

        {/* Deduction Blocks */}
        <div className="space-y-4">
          <DeductionBlock 
            title="Shutter Frame Height Cutting" 
            reference="TOTAL_HEIGHT" 
            op="SUBTRACT" 
            val={shutterH} 
            setVal={setShutterH} 
          />
          <DeductionBlock 
            title="Shutter Frame Width Cutting" 
            reference="INNER_TRACK_WIDTH" 
            op="ADD" 
            val={shutterW} 
            setVal={setShutterW} 
          />
          <DeductionBlock 
            title="Glass Height Cutting" 
            reference="FRAME_HEIGHT" 
            op="SUBTRACT" 
            val={glassH} 
            setVal={setGlassH} 
          />
          <DeductionBlock 
            title="Glass Width Cutting" 
            reference="FRAME_WIDTH" 
            op="SUBTRACT" 
            val={glassW} 
            setVal={setGlassW} 
          />
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Button variant="secondary" onClick={handleSoftwareCalc} className="w-full text-xs">
            Software Calculation
          </Button>
          <Button onClick={onApply} className="w-full bg-brand-primary">
            OK
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}

function DeductionBlock({ title, reference, op, val, setVal }: any) {
  return (
    <div className="border rounded-md p-3 text-xs bg-white shadow-sm space-y-2">
      <div className="font-semibold text-slate-800">{title}</div>
      <div className="flex items-center gap-4 text-[10px] font-medium text-slate-600">
        <label className="flex items-center gap-1">
          <input type="radio" checked={reference === 'TOTAL_HEIGHT' || reference === 'TOTAL_WIDTH'} readOnly />
          Total
        </label>
        <label className="flex items-center gap-1">
          <input type="radio" checked={reference === 'INNER_TRACK_HEIGHT' || reference === 'INNER_TRACK_WIDTH'} readOnly />
          Inner Track
        </label>
        <label className="flex items-center gap-1">
          <input type="radio" checked={reference === 'FRAME_HEIGHT' || reference === 'FRAME_WIDTH'} readOnly />
          Frame
        </label>
      </div>
      <div className="flex items-center gap-2 pt-1">
        <select className="h-7 text-xs border rounded px-1 w-20" defaultValue={op}>
          <option value="ADD">Add (+)</option>
          <option value="SUBTRACT">Sub (-)</option>
        </select>
        <Input 
          className="h-7 text-xs w-20 px-2 font-mono" 
          value={val} 
          onChange={(e) => setVal(e.target.value)} 
        />
        <span className="text-muted-foreground">mm</span>
      </div>
    </div>
  );
}
