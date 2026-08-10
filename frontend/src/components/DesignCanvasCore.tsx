"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Group, Line } from 'react-konva';
import DesignSidebar, { ToolType } from './DesignSidebar';
import FrameConfigPanel from './panels/FrameConfigPanel';
import MullionPropertyPanel from './panels/MullionPropertyPanel';
import ShutterFramePanel from './panels/ShutterFramePanel';
import { Download, Save } from 'lucide-react';
import { Button } from './ui/button';

import SaveDesignModal from './SaveDesignModal';

export type DesignPanel = {
  id: string;
  panelIndex: number;
  panelType: string;
  widthMm: number;
  heightMm: number;
  x?: number;
  y?: number;
  topLabel?: string;
  bottomLabel?: string;
  leftLabel?: string;
  rightLabel?: string;
  centerLabel?: string;
};

export type DesignData = {
  id: string;
  widthMm: number;
  heightMm: number;
  layoutType: string;
  gridRows: number;
  gridCols: number;
  panels: DesignPanel[];
};

interface Props {
  design: DesignData;
  onUpdatePanel: (panelId: string, updates: Partial<DesignPanel>) => void;
}

export default function DesignCanvasCore({ design, onUpdatePanel }: Props) {
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [activeTool, setActiveTool] = useState<ToolType>('FRAME');
  const [selectedPanelId, setSelectedPanelId] = useState<string | null>(null);
  const [clickedFrameEdge, setClickedFrameEdge] = useState(false);
  
  const [containerWidth, setContainerWidth] = useState(600);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [thumbnailDataUrl, setThumbnailDataUrl] = useState<string | null>(null);
  
  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  
  // Local active design state to allow auto-drawing new templates
  const [activeDesign, setActiveDesign] = useState<DesignData>(design);

  useEffect(() => {
    setActiveDesign(design);
  }, [design]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Use a fixed scale or dynamic
  const SCALE = Math.min(containerWidth, 800) / Math.max(activeDesign.widthMm, 100);
  const stageWidth = activeDesign.widthMm * SCALE;
  const stageHeight = activeDesign.heightMm * SCALE;
  const padding = 60; // For dimensions

  const handleExport = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL({ pixelRatio: 3 });
      const link = document.createElement("a");
      link.download = `design_${activeDesign.id}.png`;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSave = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL({ pixelRatio: 1 }); // lower res for thumbnail
      setThumbnailDataUrl(uri);
    }
    setIsSaveModalOpen(true);
  };

  const onModalSave = (data: any) => {
    setIsSaving(true);
    setIsSaveModalOpen(false);
    // Mock saving delay
    setTimeout(() => {
      setIsSaving(false);
      alert(`Design saved successfully as ${data.designCode}: ${data.designName}`);
    }, 800);
  };

  const handleToolSelect = (tool: ToolType) => {
    if (tool === 'SAVE') {
      handleSave();
      return;
    }
    setActiveTool(tool);
    // Reset selections on tool change
    setSelectedPanelId(null);
    setClickedFrameEdge(false);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt) return;
    setIsAiGenerating(true);
    
    // Simulate AI Call to the Calculation Engine
    setTimeout(async () => {
      try {
        const req = {
            widthMm: 3000,
            heightMm: 3000,
            layoutType: aiPrompt.toLowerCase().includes('slider') ? '4-Slider' : '2-Track',
            profileSeries: '26 MM 3 TRACK FRAME REGAL',
            glassProfile: 'Modi Glass'
        };
        const res = await fetch('http://localhost:8080/api/v1/designs/calculate', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(req)
        });
        if (res.ok) {
            const data = await res.json();
            setActiveDesign({
                ...activeDesign,
                widthMm: data.calculatedTotalWidth,
                heightMm: data.calculatedTotalHeight,
                layoutType: data.layout.layoutType,
                gridCols: data.layout.gridCols,
                panels: data.layout.panels
            });
        }
      } catch (e) {
        console.error(e);
      }
      setIsAiGenerating(false);
    }, 1500);
  };

  const handleCanvasClick = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedPanelId(null);
      setClickedFrameEdge(false);
    }
  };

  const handleFrameClick = () => {
    if (activeTool === 'FRAME') {
      setClickedFrameEdge(true);
      setSelectedPanelId(null);
    }
  };

  const handlePanelClick = (id: string) => {
    if (activeTool === 'MULLIONS') {
      setSelectedPanelId(id);
      setClickedFrameEdge(false);
    } else {
      setSelectedPanelId(id);
      setClickedFrameEdge(false);
    }
  };

  const handleTemplateSelect = (templateName: string) => {
    // Generate a simple layout based on template name
    let cols = 1;
    let type = 'FIXED';
    
    if (templateName.includes('Slider')) {
      const match = templateName.match(/(\d+)-Slider/);
      cols = match ? parseInt(match[1]) : 2;
      type = 'SLIDING';
    } else if (templateName.includes('Casement')) {
      const match = templateName.match(/(\d+)-Door Casement/);
      cols = match ? parseInt(match[1]) : 1;
      type = 'CASEMENT';
    }

    const panelW = activeDesign.widthMm / cols;
    const newPanels: DesignPanel[] = [];
    for(let i=0; i<cols; i++) {
      newPanels.push({
        id: `p${i+1}`,
        panelIndex: i+1,
        panelType: type,
        widthMm: panelW,
        heightMm: activeDesign.heightMm,
        x: i * panelW,
        y: 0
      });
    }

    setActiveDesign({
      ...activeDesign,
      gridCols: cols,
      layoutType: 'GRID',
      panels: newPanels
    });
    
    // Auto-save the new layout
    newPanels.forEach(p => onUpdatePanel(p.id, p));
  };

  const renderRightPanel = () => {
    if (activeTool === 'MULLIONS' && selectedPanelId) {
      return <MullionPropertyPanel panelId={selectedPanelId} onApply={() => setSelectedPanelId(null)} />;
    }
    if (activeTool === 'FRAME' && clickedFrameEdge) {
      return <ShutterFramePanel onApply={() => setClickedFrameEdge(false)} />;
    }
    return <FrameConfigPanel onTemplateSelect={handleTemplateSelect} />;
  };

  return (
    <>
      <div className="flex h-[calc(100vh-100px)] border rounded-xl overflow-hidden bg-white">
        {/* 1. Left Sidebar (Toolbar) */}
        <DesignSidebar activeTool={activeTool} onSelectTool={handleToolSelect} />
        
        {/* 2. Middle Canvas Area */}
        <div className="flex-1 flex flex-col relative bg-slate-50">
          
          {/* AI Auto-Designer Bar (2026 Glassmorphism Style) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-[600px]">
            <div className="backdrop-blur-md bg-white/70 border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-full p-2 flex items-center gap-2 transition-all hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
               <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full p-2 ml-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
               </div>
               <input 
                 className="flex-1 bg-transparent outline-none px-2 text-sm text-slate-700 placeholder:text-slate-400 font-medium" 
                 placeholder="Ask AI e.g. 'Create a 3000x3000 4-Slider for Bedroom'"
                 value={aiPrompt}
                 onChange={e => setAiPrompt(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleAiGenerate()}
               />
               <Button size="sm" className="rounded-full px-6 bg-slate-900 hover:bg-slate-800" onClick={handleAiGenerate} disabled={isAiGenerating}>
                 {isAiGenerating ? 'Generating...' : 'Generate'}
               </Button>
            </div>
          </div>

          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} className="bg-white/80 backdrop-blur-sm border-slate-200">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
            <Button variant="default" size="sm" onClick={handleSave} className="bg-brand-primary shadow-lg shadow-brand-primary/20">
              <Save className="h-4 w-4 mr-2" /> {isSaving ? 'Saving...' : 'Save Design'}
            </Button>
          </div>

          <div className="flex-1 overflow-auto p-8 flex items-center justify-center" ref={containerRef}>
            {containerWidth > 0 && (
              <div className="relative shadow-md bg-white p-[60px]" style={{ width: stageWidth + padding*2, height: stageHeight + padding*2 }}>
                
                {/* Drum Dimension Labels (Top & Left) */}
                <div className="absolute top-0 left-[60px] h-[60px] flex items-center justify-center border-b border-dashed border-slate-300" style={{ width: stageWidth }}>
                  <span className="bg-white px-2 text-xs font-semibold text-slate-500 font-mono tracking-widest">{activeDesign.widthMm} mm</span>
                </div>
                <div className="absolute top-[60px] left-0 w-[60px] flex items-center justify-center border-r border-dashed border-slate-300" style={{ height: stageHeight }}>
                  <span className="bg-white px-2 text-xs font-semibold text-slate-500 font-mono tracking-widest -rotate-90">{activeDesign.heightMm} mm</span>
                </div>

                <Stage width={stageWidth} height={stageHeight} ref={stageRef} onClick={handleCanvasClick} onTap={handleCanvasClick}>
                  <Layer>
                    {/* Outer Frame */}
                    <Rect
                      x={0} y={0}
                      width={stageWidth}
                      height={stageHeight}
                      stroke={clickedFrameEdge ? '#2563eb' : '#334155'}
                      strokeWidth={clickedFrameEdge ? 4 : 2}
                      onClick={handleFrameClick}
                      onTap={handleFrameClick}
                      onMouseEnter={(e) => { const c = e.target.getStage()?.container(); if (c && activeTool === 'FRAME') c.style.cursor = 'pointer'; }}
                      onMouseLeave={(e) => { const c = e.target.getStage()?.container(); if (c) c.style.cursor = 'default'; }}
                    />

                    {/* Inner Panels/Mullions */}
                    {activeDesign.panels.map((panel) => {
                      const isSelected = selectedPanelId === panel.id;
                      const x = (panel.x || 0) * SCALE;
                      const y = (panel.y || 0) * SCALE;
                      const w = panel.widthMm * SCALE;
                      const h = panel.heightMm * SCALE;

                      return (
                        <Group 
                          key={panel.id} 
                          x={x} 
                          y={y}
                          onClick={() => handlePanelClick(panel.id)}
                          onTap={() => handlePanelClick(panel.id)}
                          onMouseEnter={(e) => { const c = e.target.getStage()?.container(); if (c && activeTool === 'MULLIONS') c.style.cursor = 'pointer'; }}
                          onMouseLeave={(e) => { const c = e.target.getStage()?.container(); if (c) c.style.cursor = 'default'; }}
                        >
                          <Rect
                            width={w}
                            height={h}
                            fill={panel.panelType === 'DOOR' ? '#f8fafc' : '#e0ffff'} // Light blue glass tint
                            stroke={isSelected ? '#16a34a' : '#64748b'}
                            strokeWidth={isSelected ? 3 : 2}
                          />
                          
                          {/* Top Label */}
                          {panel.topLabel && <Text text={panel.topLabel} x={w/2 - 10} y={5} fill="#ef4444" fontSize={12} fontStyle="bold" />}
                          {/* Bottom Label */}
                          {panel.bottomLabel && <Text text={panel.bottomLabel} x={w/2 - 10} y={h - 15} fill="#ef4444" fontSize={12} fontStyle="bold" />}
                          {/* Left Label */}
                          {panel.leftLabel && <Text text={panel.leftLabel} x={5} y={h/2 - 5} fill="#ef4444" fontSize={12} fontStyle="bold" />}
                          {/* Right Label */}
                          {panel.rightLabel && <Text text={panel.rightLabel} x={w - 15} y={h/2 - 5} fill="#ef4444" fontSize={12} fontStyle="bold" />}
                          {/* Center Label */}
                          {panel.centerLabel && <Text text={panel.centerLabel} x={w/2 - 10} y={h/2 - 5} fill="#ef4444" fontSize={14} fontStyle="bold" />}
                          
                          {!panel.centerLabel && (
                              <Text
                                text={`${panel.panelType}\n${panel.widthMm.toFixed(0)}`}
                                width={w}
                                height={h}
                                align="center"
                                verticalAlign="middle"
                                fontSize={12}
                                fill="#475569"
                              />
                          )}
                          
                          {/* Draggable Mullion Divider (Right edge) */}
                          <Line
                            points={[w, 0, w, h]}
                            stroke="#334155"
                            strokeWidth={4}
                            draggable={activeTool === 'MULLIONS'}
                            dragBoundFunc={(pos) => ({ x: pos.x, y: y })}
                            onMouseEnter={(e) => { const c = e.target.getStage()?.container(); if (c && activeTool === 'MULLIONS') c.style.cursor = 'col-resize'; }}
                            onMouseLeave={(e) => { const c = e.target.getStage()?.container(); if (c) c.style.cursor = 'default'; }}
                          />
                        </Group>
                      );
                    })}
                  </Layer>
                </Stage>
              </div>
            )}
          </div>
        </div>

        {/* 3. Right Property Panel */}
        <div className="w-80 shrink-0 bg-white border-l z-10">
          {renderRightPanel()}
        </div>
      </div>

      <SaveDesignModal 
        isOpen={isSaveModalOpen} 
        onClose={() => setIsSaveModalOpen(false)} 
        onSave={onModalSave}
        thumbnailDataUrl={thumbnailDataUrl}
      />
    </>
  );
}
