'use client';

import React from 'react';

export interface WindowDesignProps {
  widthMm: number;
  heightMm: number;
  type: string; // 'OPENABLE WINDOW', '2trcak 2shutter sliding', 'FIX WINDOW', 'Vantilation'
  panels: number;
}

export function WindowVisualizer({ widthMm, heightMm, type, panels }: WindowDesignProps) {
  // Basic scaling to fit within a 400x400 box
  const maxSize = 400;
  const ratio = widthMm / heightMm;
  
  let drawWidth = maxSize;
  let drawHeight = maxSize;
  
  if (ratio > 1) {
    drawHeight = maxSize / ratio;
  } else {
    drawWidth = maxSize * ratio;
  }

  // Ensure minimum size for visibility
  drawWidth = Math.max(drawWidth, 100);
  drawHeight = Math.max(drawHeight, 100);

  const panelWidth = drawWidth / panels;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border rounded-lg h-full">
      <div className="relative">
        {/* Top dimension */}
        <div className="absolute -top-8 left-0 right-0 flex justify-center text-sm font-mono text-slate-500">
          <div className="flex items-center w-full">
            <div className="flex-1 border-t border-slate-400"></div>
            <span className="px-2">{widthMm}</span>
            <div className="flex-1 border-t border-slate-400"></div>
          </div>
        </div>
        
        {/* Left dimension */}
        <div className="absolute top-0 bottom-0 -left-12 flex items-center justify-center text-sm font-mono text-slate-500">
          <div className="flex flex-col items-center h-full">
            <div className="flex-1 border-l border-slate-400"></div>
            <span className="py-2 -rotate-90">{heightMm}</span>
            <div className="flex-1 border-l border-slate-400"></div>
          </div>
        </div>

        {/* SVG Drawing */}
        <svg 
          width={drawWidth} 
          height={drawHeight} 
          className="bg-sky-100 shadow-inner border-[4px] border-slate-700"
          style={{ overflow: 'visible' }}
        >
          {Array.from({ length: panels }).map((_, i) => {
            const x = i * panelWidth;
            return (
              <g key={i}>
                {/* Panel Border */}
                <rect 
                  x={x} 
                  y={0} 
                  width={panelWidth} 
                  height={drawHeight} 
                  fill="none" 
                  stroke="#334155" 
                  strokeWidth="2"
                />
                
                {/* Drawing specific types */}
                {type.includes('OPENABLE') && (
                  <path 
                    d={`M${x},0 L${x + panelWidth},${drawHeight/2} L${x},${drawHeight}`} 
                    fill="none" 
                    stroke="#94a3b8" 
                    strokeWidth="1" 
                    strokeDasharray="4,4"
                  />
                )}
                
                {type.includes('Vantilation') && (
                  <circle 
                    cx={x + panelWidth/2} 
                    cy={drawHeight/2} 
                    r={Math.min(panelWidth, drawHeight) * 0.25} 
                    fill="#e2e8f0" 
                    stroke="#94a3b8"
                  />
                )}
                
                {type.includes('sliding') && (
                  <g>
                    {/* Overlapping sashes indication */}
                    <rect 
                      x={x + 4} 
                      y={4} 
                      width={panelWidth - 8} 
                      height={drawHeight - 8} 
                      fill="none" 
                      stroke="#64748b" 
                      strokeWidth="2"
                    />
                    <text x={x + panelWidth/2} y={drawHeight/2} textAnchor="middle" fill="#64748b" fontSize="12">→</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
