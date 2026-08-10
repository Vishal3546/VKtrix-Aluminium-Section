import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Book, 
  Square, 
  Maximize, 
  MoreHorizontal, 
  GripHorizontal, 
  Settings, 
  MousePointer2, 
  Ruler, 
  Wrench, 
  Save, 
  LogOut 
} from 'lucide-react';

export type ToolType = 
  | 'LIBRARY' 
  | 'FRAME' 
  | 'CASHMEN_WINDOW' 
  | 'SLIDER_WINDOW' 
  | 'MULLIONS' 
  | 'HARDWARE' 
  | 'INDICATOR' 
  | 'DISTANCE' 
  | 'HARDWARE_SELECT' 
  | 'SAVE' 
  | 'EXIT';

interface DesignSidebarProps {
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
}

export default function DesignSidebar({ activeTool, onSelectTool }: DesignSidebarProps) {
  const tools = [
    { id: 'LIBRARY', label: 'Library', icon: Book },
    { id: 'FRAME', label: 'Frame', icon: Square },
    { id: 'CASHMEN_WINDOW', label: 'Cashmen Window', icon: Maximize },
    { id: 'SLIDER_WINDOW', label: 'Slider Window', icon: MoreHorizontal },
    { id: 'MULLIONS', label: 'Mullions', icon: GripHorizontal },
    { id: 'HARDWARE', label: 'Hardware', icon: Settings },
    { id: 'INDICATOR', label: 'Indicator', icon: MousePointer2 },
    { id: 'DISTANCE', label: 'Distance', icon: Ruler },
    { id: 'HARDWARE_SELECT', label: 'Hardware Select', icon: Wrench },
  ] as const;

  return (
    <div className="w-20 lg:w-24 bg-slate-900 flex flex-col items-center py-4 text-white shrink-0 shadow-lg z-10">
      <div className="flex-1 w-full space-y-2 flex flex-col items-center">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelectTool(t.id)}
            className={`w-16 h-16 flex flex-col items-center justify-center rounded-xl transition-all ${
              activeTool === t.id 
                ? 'bg-brand-primary text-white shadow-md' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
            title={t.label}
          >
            <t.icon className="h-6 w-6 mb-1" />
            <span className="text-[10px] font-medium leading-tight text-center px-1">{t.label}</span>
          </button>
        ))}
      </div>
      
      <div className="w-full space-y-2 flex flex-col items-center border-t border-slate-700 pt-4 mt-4">
        <button
          onClick={() => onSelectTool('SAVE')}
          className="w-16 h-16 flex flex-col items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          title="Save"
        >
          <Save className="h-6 w-6 mb-1" />
          <span className="text-[10px] font-medium">Save</span>
        </button>
        <button
          onClick={() => onSelectTool('EXIT')}
          className="w-16 h-16 flex flex-col items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          title="Exit"
        >
          <LogOut className="h-6 w-6 mb-1" />
          <span className="text-[10px] font-medium">Exit</span>
        </button>
      </div>
    </div>
  );
}
