import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SaveDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  thumbnailDataUrl: string | null;
}

export default function SaveDesignModal({ isOpen, onClose, onSave, thumbnailDataUrl }: SaveDesignModalProps) {
  const [designName, setDesignName] = useState('');
  const [designNameError, setDesignNameError] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setDesignName('');
      setDesignNameError('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDesignNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDesignName(val);
    if (val && !/^[a-zA-Z0-9 ]+$/.test(val)) {
      setDesignNameError("Only Character and Numbers are acceptable");
    } else {
      setDesignNameError('');
    }
  };

  const handleSubmit = () => {
    if (designName && !/^[a-zA-Z0-9 ]+$/.test(designName)) {
      setDesignNameError("Only Character and Numbers are acceptable");
      return;
    }
    
    // Mock save
    onSave({
      designCode: `W${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      designName: designName || 'Untitled Design',
      date,
      thumbnail: thumbnailDataUrl
    });
  };

  const inputClass = "w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md">
      <Card className="w-[500px] shadow-2xl border-white/20 bg-white/80 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between bg-transparent border-b border-slate-200 py-3 px-4">
          <CardTitle className="text-lg bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Save Design</CardTitle>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="h-5 w-5" /></button>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Date</label>
              <Input type="date" className={`${inputClass} bg-white/50 backdrop-blur-sm`} value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Party Name</label>
              <select className={`${inputClass} bg-white/50 backdrop-blur-sm`}>
                <option value="">Select Party...</option>
                <option value="Vinodbhai">Vinodbhai</option>
                <option value="mayank">mayank</option>
                <option value="rolex">rolex</option>
                <option value="Anilbhai">Anilbhai</option>
                <option value="maheshbhai">maheshbhai</option>
                <option value="shambhubhai">shambhubhai</option>
                <option value="Hirenbhai">Hirenbhai</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Project Name</label>
              <select className={`${inputClass} bg-white/50 backdrop-blur-sm`}>
                <option value="">Select Project...</option>
                <option value="Bunglow">Bunglow</option>
                <option value="Villa Renovation">Villa Renovation</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Design Location</label>
              <select className={`${inputClass} bg-white/50 backdrop-blur-sm`}>
                <option value="">Select Location...</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Drawingroom">Drawingroom</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Gallery">Gallery</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Design Name</label>
            <Input 
              className={`${inputClass} ${designNameError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              placeholder="Enter alphanumeric design name" 
              value={designName}
              onChange={handleDesignNameChange}
            />
            {designNameError && <p className="text-xs text-red-500 mt-1">{designNameError}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t mt-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Profile Series</label>
              <Input className={`${inputClass} bg-slate-50`} defaultValue="26MM 3 TRACK FRAME REGAL" readOnly />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Glass Profile</label>
              <Input className={`${inputClass} bg-slate-50`} defaultValue="Saint Gobain" readOnly />
            </div>
          </div>

        </CardContent>
        <CardFooter className="bg-slate-50 border-t py-3 px-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-brand-primary">Save & Generate Code</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
