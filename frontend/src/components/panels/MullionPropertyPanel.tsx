import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MullionPropertyPanelProps {
  panelId: string;
  onApply: () => void;
}

export default function MullionPropertyPanel({ panelId, onApply }: MullionPropertyPanelProps) {
  const [advanceSection, setAdvanceSection] = useState(false);
  const inputClass = "w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

  return (
    <Card className="h-full rounded-none border-0 border-l">
      <CardHeader className="bg-slate-50 border-b py-4">
        <CardTitle className="text-lg">Section Property Editor</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 70px)' }}>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Design Sec. No</label>
            <Input className={inputClass} defaultValue={`SEC-${panelId.toUpperCase()}`} readOnly />
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Section Type</label>
            <select className={inputClass} defaultValue="I">
              <option value="O">Outer (O)</option>
              <option value="I">Inner (I)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Profile</label>
          <select className={inputClass}>
            <option>Standard Mullion 40x20</option>
            <option>Heavy Mullion 40x40</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Width</label>
            <Input type="number" className={inputClass} defaultValue="40" />
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Height(Cross)</label>
            <Input type="number" className={inputClass} defaultValue="20" />
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Length</label>
            <Input type="number" className={inputClass} defaultValue="1450" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Outer Deep</label>
            <Input type="number" className={inputClass} defaultValue="0" />
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Inner Deep</label>
            <Input type="number" className={inputClass} defaultValue="12" />
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Angle</label>
            <Input type="number" className={inputClass} defaultValue="90" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Type</label>
            <select className={inputClass} defaultValue="Vertical">
              <option value="Vertical">Vertical</option>
              <option value="Horizontal">Horizontal</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Property</label>
            <select className={inputClass} defaultValue="Fixed">
              <option value="Fixed">Fixed</option>
              <option value="Sliding">Sliding</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Colour</label>
            <select className={inputClass}>
              <option>Powder Coated White</option>
              <option>Anodized Silver</option>
            </select>
          </div>
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" className="rounded" /> Fill Color
            </label>
          </div>
        </div>

        <div className="border-t pt-3">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Hardware Accessories</label>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Screw</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Handle</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Lock</label>
            <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Wheel</label>
          </div>
        </div>

        <div className="border-t pt-3 flex flex-col gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
            <input 
              type="checkbox" 
              className="rounded w-4 h-4" 
              checked={advanceSection} 
              onChange={e => setAdvanceSection(e.target.checked)} 
            /> 
            Advance for Section
          </label>

          <Button onClick={onApply} className="w-full bg-brand-primary">
            OK
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
