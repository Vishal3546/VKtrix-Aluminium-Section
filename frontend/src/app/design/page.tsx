"use client";

import React, { useState } from 'react';
import { WindowVisualizer } from '@/components/design/WindowVisualizer';
import { DesignConfigurator, DesignConfig } from '@/components/design/DesignConfigurator';
import { ComputedValuesTable } from '@/components/design/ComputedValuesTable';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

export default function DesignPage() {
  const [config, setConfig] = useState<DesignConfig>({
    code: 'W1',
    widthMm: 1067,
    heightMm: 1067,
    type: 'OPENABLE WINDOW',
    panels: 2,
    profileSystem: 'VITCO 40MM CASEMENT SERIES',
    glass: '(1,2) 5mm Clear Toughened',
  });

  const handleConfigChange = (updates: Partial<DesignConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  // Mock computed values based on config
  const sqFt = (config.widthMm * config.heightMm) / 92903.04; // mm2 to sqft
  const valuePerSqFt = 1509.56;
  const quantity = 1;
  const weight = sqFt * 4.46; // mock ratio

  // Mock hardware based on type
  const hardware = config.type.includes('sliding') 
    ? ['Locking : Single-point', 'Handle color : WHITE', 'Roller : Double Roller', 'Handle Type : S1-Touch Lock Left']
    : ['Locking : Single-point', 'Handle color : WHITE', 'Friction : S1-Friction Stay 10 Inch', 'Handle Type : S1-Cockspur Handle'];

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen pb-24">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Design Studio</h1>
          <p className="text-slate-500 mt-1">Configure parameters and visualize your window/door design.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Printer size={18} /> Print Quotation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Visualizer */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 h-[500px]">
            <WindowVisualizer 
              widthMm={config.widthMm} 
              heightMm={config.heightMm} 
              type={config.type} 
              panels={config.panels}
            />
          </div>

          {/* Bottom Table */}
          <ComputedValuesTable 
            sqFt={sqFt}
            valuePerSqFt={valuePerSqFt}
            quantity={quantity}
            weight={weight}
            profileColor="Sparkle Grey"
            meshType="No"
            hardware={hardware}
          />
        </div>

        {/* Right Side: Configurator */}
        <div className="lg:col-span-4">
          <DesignConfigurator config={config} onChange={handleConfigChange} />
        </div>
      </div>
    </div>
  );
}
