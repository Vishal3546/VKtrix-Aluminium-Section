'use client';

import React from 'react';
import { Input } from '../ui/input';

export interface DesignConfig {
  code: string;
  widthMm: number;
  heightMm: number;
  type: string;
  panels: number;
  profileSystem: string;
  glass: string;
}

interface DesignConfiguratorProps {
  config: DesignConfig;
  onChange: (updates: Partial<DesignConfig>) => void;
}

export function DesignConfigurator({ config, onChange }: DesignConfiguratorProps) {
  const windowTypes = [
    'OPENABLE WINDOW',
    '2trcak 2shutter sliding',
    'FIX WINDOW',
    'Vantilation'
  ];

  const profileSystems = [
    'VITCO 40MM CASEMENT SERIES',
    'VITCO 31MM GULF SLIM SLIDING SERIES'
  ];

  const glassOptions = [
    '(1,2) 5mm Clear Toughened',
    '(1) 5mm Clear Toughened',
    '(1,2) 11.52mm LAM.'
  ];

  return (
    <div className="bg-white border rounded-md shadow-sm p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Design Code</label>
          <Input 
            value={config.code} 
            onChange={(e) => onChange({ code: e.target.value })} 
            placeholder="e.g. W1"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Type</label>
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={config.type}
            onChange={(e) => onChange({ type: e.target.value, panels: e.target.value.includes('2shutter') ? 2 : 1 })}
          >
            {windowTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Width (W)</label>
          <Input 
            type="number"
            value={config.widthMm} 
            onChange={(e) => onChange({ widthMm: Number(e.target.value) || 100 })} 
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Height (H)</label>
          <Input 
            type="number"
            value={config.heightMm} 
            onChange={(e) => onChange({ heightMm: Number(e.target.value) || 100 })} 
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Profile System</label>
        <select 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={config.profileSystem}
          onChange={(e) => onChange({ profileSystem: e.target.value })}
        >
          {profileSystems.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Glass</label>
        <select 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={config.glass}
          onChange={(e) => onChange({ glass: e.target.value })}
        >
          {glassOptions.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      
      <div className="space-y-1 pt-2">
        <label className="text-sm font-medium text-slate-700">Panels / Shutters</label>
        <select 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={config.panels}
          onChange={(e) => onChange({ panels: Number(e.target.value) })}
        >
          {[1,2,3,4].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
    </div>
  );
}
