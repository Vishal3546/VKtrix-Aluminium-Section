"use client";

import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { parseDimension, DimensionValidationResult } from '@/lib/dimensionParser';
import {
  windowTypes,
  profileLengths,
  glassOptions,
  designSelections,
  parties,
  fetchProjectsByParty,
  fetchProfileSystemsByType,
  simulateFormulaEngine
} from '@/lib/mockApi';
import { fetchParties, fetchProjectsByPartyId, fetchProfileSystems, generateAutoDesign } from '@/lib/api';

export interface DesignQueueItem {
  id: string; // Used internally as row id
  sr: number;
  partyName: string;
  projectName: string;
  designCode: string;
  widthMm: number;
  heightMm: number;
  status: string;
  layoutData: any; // The generated design
}

interface AutoDesignFormProps {
  onAddToQueue: (item: DesignQueueItem) => void;
  nextSrNumber: number;
}

export default function AutoDesignForm({ onAddToQueue, nextSrNumber }: AutoDesignFormProps) {
  // Form State
  const [selectedType, setSelectedType] = useState(windowTypes[0]);
  const [profileSysOptions, setProfileSysOptions] = useState<any[]>([]);
  const [selectedProfileSys, setSelectedProfileSys] = useState('');
  const [selectedLength, setSelectedLength] = useState(profileLengths[0]);
  const [selectedGlass, setSelectedGlass] = useState(glassOptions[0]);
  
  const [widthInput, setWidthInput] = useState('');
  const [heightInput, setHeightInput] = useState('');
  const [widthValidation, setWidthValidation] = useState<DimensionValidationResult>({ isValid: false });
  const [heightValidation, setHeightValidation] = useState<DimensionValidationResult>({ isValid: false });

  const [selectedDesign, setSelectedDesign] = useState(designSelections[0]);
  const [designFor, setDesignFor] = useState('Interior');
  const [shutterCount, setShutterCount] = useState('2');
  const [hasMesh, setHasMesh] = useState(false);
  const [hasGrill, setHasGrill] = useState(false);

  // Party/Project Modal State
  const [isPartyModalOpen, setIsPartyModalOpen] = useState(false);
  const [tempPartyId, setTempPartyId] = useState<string>('');
  const [tempProjectOptions, setTempProjectOptions] = useState<any[]>([]);
  const [tempProjectId, setTempProjectId] = useState<string>('');
  const [partiesList, setPartiesList] = useState<any[]>([]);

  // Selected Party/Project State
  const [selectedParty, setSelectedParty] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effects
  useEffect(() => {
    let isMounted = true;
    fetchProfileSystems().then(data => {
      if (isMounted) {
        setProfileSysOptions(data);
        if (data.length > 0) setSelectedProfileSys(data[0].id.toString());
        else setSelectedProfileSys('');
      }
    }).catch(console.error);

    fetchParties().then(data => {
      if (isMounted) {
        setPartiesList(data);
      }
    }).catch(console.error);

    return () => { isMounted = false };
  }, []);

  useEffect(() => {
    if (tempPartyId) {
      let isMounted = true;
      fetchProjectsByPartyId(tempPartyId).then(data => {
        if (isMounted) {
          setTempProjectOptions(data);
          if (data.length > 0) setTempProjectId(data[0].id.toString());
          else setTempProjectId('');
        }
      }).catch(console.error);
      return () => { isMounted = false };
    } else {
      setTempProjectOptions([]);
      setTempProjectId('');
    }
  }, [tempPartyId]);

  // Handlers
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWidthInput(e.target.value);
    setWidthValidation(parseDimension(e.target.value));
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeightInput(e.target.value);
    setHeightValidation(parseDimension(e.target.value));
  };

  const handlePartyModalSave = () => {
    const party = partiesList.find(p => p.id.toString() === tempPartyId);
    const proj = tempProjectOptions.find(p => p.id.toString() === tempProjectId);
    if (party && proj) {
      setSelectedParty(party);
      setSelectedProject(proj);
      setIsPartyModalOpen(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedParty || !selectedProject) {
      alert("Please select a Party and Project first.");
      return;
    }
    if (!widthValidation.isValid || !heightValidation.isValid) {
      alert("Please enter valid width and height.");
      return;
    }

    setIsSubmitting(true);
    
    const w = widthValidation.valueMm!;
    const h = heightValidation.valueMm!;

    // Call real API backend
    try {
      const layout = await generateAutoDesign({
        partyId: selectedParty.id,
        projectId: selectedProject.id,
        profileSystemId: selectedProfileSys || null,
        type: selectedType,
        widthMm: w,
        heightMm: h,
        shutterCount: parseInt(shutterCount) || 2,
        hasMosquitoNet: hasMesh,
        hasGrill: hasGrill,
        designSelection: selectedDesign,
        designFor: designFor
      });

      const newItem: DesignQueueItem = {
        id: layout.id,
        sr: nextSrNumber,
        partyName: selectedParty.name,
        projectName: selectedProject.name,
        designCode: selectedType + '-' + w + 'x' + h,
        widthMm: w,
        heightMm: h,
        status: "Generated",
        layoutData: layout
      };

      onAddToQueue(newItem);
    } catch (error) {
      console.error(error);
      alert("Failed to generate design.");
    }
    
    setIsSubmitting(false);

    // Optional: reset dimensions for the next item
    setWidthInput('');
    setHeightInput('');
    setWidthValidation({ isValid: false });
    setHeightValidation({ isValid: false });
  };

  const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Auto Design Parameters</h2>
          <p className="text-sm text-muted-foreground mt-1">Configure options to generate a window or door layout automatically.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm">
            {selectedParty ? (
              <div>
                <span className="font-semibold text-foreground">Party: </span><span className="text-muted-foreground">{selectedParty.name}</span>
                <br/>
                <span className="font-semibold text-foreground">Project: </span><span className="text-muted-foreground">{selectedProject.name}</span>
              </div>
            ) : (
              <span className="text-muted-foreground italic">No Party Selected</span>
            )}
          </div>
          <Button variant="outline" onClick={() => setIsPartyModalOpen(true)}>
            {selectedParty ? "Change Party" : "Select Party"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Row 1 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>
          <select className={inputClass} value={selectedType} onChange={e => setSelectedType(e.target.value)}>
            {windowTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Profile System</label>
          <select className={inputClass} value={selectedProfileSys} onChange={e => setSelectedProfileSys(e.target.value)} disabled={profileSysOptions.length === 0}>
            {profileSysOptions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Profile Length</label>
          <select className={inputClass} value={selectedLength} onChange={e => setSelectedLength(e.target.value)}>
            {profileLengths.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Glass Options</label>
          <select className={inputClass} value={selectedGlass} onChange={e => setSelectedGlass(e.target.value)}>
            {glassOptions.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {/* Row 2 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Width (mm or ft'in")</label>
          <Input 
            placeholder="e.g. 1200 or 4'2&#34;" 
            value={widthInput} 
            onChange={handleWidthChange}
            className={widthInput && !widthValidation.isValid ? 'border-red-500' : ''}
          />
          {widthInput && !widthValidation.isValid && (
            <p className="text-xs text-red-500">{widthValidation.errorMessage}</p>
          )}
          {widthValidation.isValid && (
            <p className="text-xs text-green-600">Valid: {widthValidation.valueMm} mm</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Height (mm or ft'in")</label>
          <Input 
            placeholder="e.g. 1500 or 5'" 
            value={heightInput} 
            onChange={handleHeightChange}
            className={heightInput && !heightValidation.isValid ? 'border-red-500' : ''}
          />
          {heightInput && !heightValidation.isValid && (
            <p className="text-xs text-red-500">{heightValidation.errorMessage}</p>
          )}
          {heightValidation.isValid && (
            <p className="text-xs text-green-600">Valid: {heightValidation.valueMm} mm</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Design Selection</label>
          <select className={inputClass} value={selectedDesign} onChange={e => setSelectedDesign(e.target.value)}>
            {designSelections.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Design For</label>
          <select className={inputClass} value={designFor} onChange={e => setDesignFor(e.target.value)}>
            <option value="Interior">Interior</option>
            <option value="Exterior">Exterior</option>
          </select>
        </div>

        {/* Row 3 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Shutter Count</label>
          <select className={inputClass} value={shutterCount} onChange={e => setShutterCount(e.target.value)}>
            {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Shutters</option>)}
          </select>
        </div>
        <div className="space-y-2 flex flex-col justify-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300" checked={hasMesh} onChange={e => setHasMesh(e.target.checked)} />
            Mosquito Mesh
          </label>
        </div>
        <div className="space-y-2 flex flex-col justify-end pb-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300" checked={hasGrill} onChange={e => setHasGrill(e.target.checked)} />
            Security Grill
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button 
          size="lg" 
          onClick={handleSubmit} 
          disabled={!selectedParty || !widthValidation.isValid || !heightValidation.isValid || isSubmitting}
        >
          {isSubmitting ? "Generating..." : "Generate & Add to Queue"}
        </Button>
      </div>

      {/* Select Party Modal */}
      {isPartyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md p-6 bg-background shadow-lg">
            <h3 className="text-xl font-bold mb-4">Select Party & Project</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Party Name</label>
                <select className={inputClass} value={tempPartyId} onChange={e => setTempPartyId(e.target.value)}>
                  <option value="" disabled>Select Party</option>
                  {partiesList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Name</label>
                <select className={inputClass} value={tempProjectId} onChange={e => setTempProjectId(e.target.value)} disabled={!tempPartyId || tempProjectOptions.length === 0}>
                  {tempProjectOptions.length === 0 && <option value="" disabled>No projects available</option>}
                  {tempProjectOptions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsPartyModalOpen(false)}>Cancel</Button>
              <Button onClick={handlePartyModalSave} disabled={!tempPartyId || !tempProjectId}>Confirm</Button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
}
