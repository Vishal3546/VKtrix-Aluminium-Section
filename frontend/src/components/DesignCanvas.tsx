"use client";

import dynamic from 'next/dynamic';
import type { DesignData, DesignPanel } from './DesignCanvasCore';

const DesignCanvasCore = dynamic(() => import('./DesignCanvasCore'), { ssr: false });

interface Props {
  design: DesignData;
  onUpdatePanel: (panelId: string, updates: Partial<DesignPanel>) => void;
  onUpdateDesign?: (newDesign: DesignData) => void;
}

export default function DesignCanvas(props: Props) {
  return <DesignCanvasCore {...props} />;
}
