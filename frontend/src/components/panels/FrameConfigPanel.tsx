import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { profileCompanies, glassBrands, designSelections } from '@/lib/mockApi';

interface FrameConfigPanelProps {
  onTemplateSelect: (templateName: string) => void;
}

export default function FrameConfigPanel({ onTemplateSelect }: FrameConfigPanelProps) {
  const inputClass = "w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

  return (
    <Card className="h-full rounded-none border-0 border-l">
      <CardHeader className="bg-slate-50 border-b py-4">
        <CardTitle className="text-lg">Change Size</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 70px)' }}>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Design Description</label>
            <Input className={inputClass} placeholder="e.g. 3 Track Slider Window" defaultValue="3 Track Slider Window" />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Profile Company</label>
            <select className={inputClass} defaultValue={profileCompanies[0]}>
              {profileCompanies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Profile System</label>
            <select className={inputClass} defaultValue="Regal Series">
              <option value="Regal Series">Regal Series</option>
              <option value="Eco Series">Eco Series</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Profile Selection</label>
            <select className={inputClass} defaultValue="26MM 3 TRACK FRAME REGAL">
              <option value="26MM 3 TRACK FRAME REGAL">26MM 3 TRACK FRAME REGAL</option>
              <option value="18MM 2 TRACK FRAME">18MM 2 TRACK FRAME</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Glass Selection</label>
            <select className={inputClass} defaultValue={glassBrands[0]}>
              {glassBrands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>

        <div className="border-t pt-5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">Design Templates</label>
          <div className="grid grid-cols-2 gap-2">
            {designSelections.map(t => (
              <button 
                key={t}
                onClick={() => onTemplateSelect(t)}
                className="p-3 text-xs border rounded-md hover:bg-brand-primary hover:text-white transition-colors text-center font-medium bg-slate-50"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
