'use client';

import React from 'react';

export interface ComputedValuesProps {
  sqFt: number;
  valuePerSqFt: number;
  quantity: number;
  weight: number;
  profileColor: string;
  meshType: string;
  hardware: string[];
}

export function ComputedValuesTable({
  sqFt,
  valuePerSqFt,
  quantity,
  weight,
  profileColor,
  meshType,
  hardware
}: ComputedValuesProps) {
  const unitPrice = sqFt * valuePerSqFt;
  const totalValue = unitPrice * quantity;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-md overflow-hidden text-sm">
      {/* Computed Values Section */}
      <div className="bg-slate-100 px-3 py-2 font-semibold text-slate-800 border-b border-slate-200">
        Computed Values
      </div>
      <div className="grid grid-cols-2 divide-x divide-slate-200 border-b border-slate-200">
        <div className="flex justify-between px-3 py-2 bg-white">
          <span className="text-slate-600">Sq.Ft. per window</span>
          <span className="font-medium">{sqFt.toFixed(3)} Sq.Ft.</span>
        </div>
        <div className="flex justify-between px-3 py-2 bg-white">
          <span className="text-slate-600">Value per Sq.Ft.</span>
          <span className="font-medium">{valuePerSqFt.toFixed(2)} INR</span>
        </div>
      </div>
      <div className="grid grid-cols-2 divide-x divide-slate-200 border-b border-slate-200">
        <div className="flex justify-between px-3 py-2 bg-white">
          <span className="text-slate-600">Unit Price</span>
          <span className="font-medium">{unitPrice.toFixed(2)} INR</span>
        </div>
        <div className="flex justify-between px-3 py-2 bg-white">
          <span className="text-slate-600">Quantity</span>
          <span className="font-medium">{quantity} Pcs</span>
        </div>
      </div>
      <div className="grid grid-cols-2 divide-x divide-slate-200 border-b border-slate-200">
        <div className="flex justify-between px-3 py-2 bg-white">
          <span className="text-slate-600">Value</span>
          <span className="font-medium">{totalValue.toFixed(2)} INR</span>
        </div>
        <div className="flex justify-between px-3 py-2 bg-white">
          <span className="text-slate-600">Weight</span>
          <span className="font-medium">{weight.toFixed(3)} KG</span>
        </div>
      </div>

      {/* Profile & Accessories Section */}
      <div className="grid grid-cols-2 divide-x divide-slate-200">
        <div>
          <div className="bg-slate-100 px-3 py-2 font-semibold text-slate-800 border-b border-slate-200">
            Profile
          </div>
          <div className="px-3 py-2 text-slate-600 space-y-1">
            <p>Profile Color : {profileColor}</p>
            <p>MeshType : {meshType}</p>
            <p>Outer : Cmt Outer Frame 80Mm X 39Mm Type 1</p>
          </div>
        </div>
        <div>
          <div className="bg-slate-100 px-3 py-2 font-semibold text-slate-800 border-b border-slate-200">
            Accessories
          </div>
          <div className="px-3 py-2 text-slate-600 space-y-1">
            {hardware.map((item, idx) => (
              <p key={idx}>{item}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
