"use client";

import React from 'react';
import { DesignQueueItem } from './AutoDesignForm';
import DesignCanvas from './DesignCanvas';

interface Props {
  queue: DesignQueueItem[];
}

export default function QuotationPDFTemplate({ queue }: Props) {
  if (!queue || queue.length === 0) return null;
  
  const partyName = queue[0]?.partyName || 'Customer';
  const projectName = queue[0]?.projectName || 'Project';

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white text-black text-sm">
      {/* Cover Page */}
      <div className="min-h-screen p-12 page-break-after-always">
        <div className="flex justify-between items-start border-b-4 border-slate-900 pb-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-widest text-slate-900">Quotation</h1>
            <p className="text-xl text-slate-600 mt-2">Aristo Fenestration System</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-lg">{partyName}</p>
            <p className="text-slate-600">{projectName}</p>
            <p className="text-slate-600 mt-4">Date: {new Date().toLocaleDateString('en-IN')}</p>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Project Summary</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="border p-3">Code</th>
                <th className="border p-3">Type</th>
                <th className="border p-3">Size (W x H)</th>
                <th className="border p-3 text-right">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {queue.map(item => (
                <tr key={item.id}>
                  <td className="border p-3 font-semibold">W{item.sr} - {item.designCode}</td>
                  <td className="border p-3">{item.designCode.split('-')[0]}</td>
                  <td className="border p-3">{item.widthMm} x {item.heightMm} mm</td>
                  <td className="border p-3 text-right">1</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-auto pt-24 text-center text-slate-500">
          <p>Please review the detailed window configurations on the following pages.</p>
        </div>
      </div>

      {/* Detail Pages for each Window */}
      {queue.map(item => {
        const areaSqFt = (item.widthMm * item.heightMm) / 92903.04;
        const type = item.designCode.split('-')[0];
        
        return (
          <div key={item.id} className="min-h-screen p-12 page-break-after-always">
            <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4 mb-8">
              <h2 className="text-2xl font-bold">Window Detail: W{item.sr}</h2>
              <span className="text-lg font-semibold text-slate-600">{type}</span>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-2">Specifications</h3>
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    <tr><td className="border p-2 bg-slate-50 font-medium w-1/3">Width</td><td className="border p-2">{item.widthMm} mm</td></tr>
                    <tr><td className="border p-2 bg-slate-50 font-medium">Height</td><td className="border p-2">{item.heightMm} mm</td></tr>
                    <tr><td className="border p-2 bg-slate-50 font-medium">Area</td><td className="border p-2">{areaSqFt.toFixed(2)} Sq.Ft</td></tr>
                    <tr><td className="border p-2 bg-slate-50 font-medium">Profile</td><td className="border p-2">Premium System 25mm</td></tr>
                    <tr><td className="border p-2 bg-slate-50 font-medium">Glass</td><td className="border p-2">6mm Toughened</td></tr>
                  </tbody>
                </table>
              </div>
              
              {/* Profile / Accessories Bill of Materials (Mocked) */}
              <div>
                <h3 className="font-semibold mb-2">Bill of Materials</h3>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border p-2 text-left">Item</th>
                      <th className="border p-2 text-right">Qty / Len</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border p-2">Outer Frame Profile</td><td className="border p-2 text-right">{((item.widthMm + item.heightMm) * 2).toFixed(0)} mm</td></tr>
                    <tr><td className="border p-2">Sash Profile</td><td className="border p-2 text-right">{((item.widthMm/2 + item.heightMm) * 4).toFixed(0)} mm</td></tr>
                    <tr><td className="border p-2">Rollers / Hardware</td><td className="border p-2 text-right">1 Set</td></tr>
                    <tr><td className="border p-2">Locking Mechanism</td><td className="border p-2 text-right">1 No</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border rounded-xl p-4 bg-slate-50 flex items-center justify-center" style={{ height: '500px' }}>
              <div className="scale-75 origin-top">
                <DesignCanvas design={item.layoutData} onUpdatePanel={() => {}} />
              </div>
            </div>
          </div>
        );
      })}

      {/* Terms and Conditions / Pre-Requisites */}
      <div className="min-h-screen p-12">
        <div className="border-b-2 border-slate-900 pb-4 mb-8">
          <h2 className="text-2xl font-bold">Terms & Conditions</h2>
        </div>
        
        <div className="prose prose-sm max-w-none space-y-6 text-slate-700">
          <div>
            <h3 className="text-lg font-bold text-slate-900">1. Quotation Validity</h3>
            <p>This quotation is valid for a period of 15 days from the date of issue. Prices are subject to revision upon expiry of the validity period.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-slate-900">2. Payment Terms</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>50% advance payment along with the confirmed purchase order.</li>
              <li>40% against material delivery at the site.</li>
              <li>10% upon successful installation and handover.</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-slate-900">3. Pre-Requisites for Installation</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Clear and leveled masonry/plastered openings must be provided by the client prior to installation.</li>
              <li>Scaffolding, if required, shall be arranged by the client at their cost.</li>
              <li>Free access to electricity (220V) and water must be available at the site.</li>
              <li>Safe storage space for materials must be provided by the client.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">4. Delivery & Installation</h3>
            <p>Standard delivery time is 3-4 weeks from the date of advance payment and final site measurement. Delays due to site unreadiness or force majeure events are exempted.</p>
          </div>

          <div className="mt-24 pt-8 border-t flex justify-between">
            <div className="text-center w-64">
              <div className="border-b border-black mb-2 h-16"></div>
              <p className="font-semibold">For Aristo Fenestration System</p>
              <p className="text-xs">Authorized Signatory</p>
            </div>
            <div className="text-center w-64">
              <div className="border-b border-black mb-2 h-16"></div>
              <p className="font-semibold">For {partyName}</p>
              <p className="text-xs">Client Acceptance / Seal</p>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .page-break-after-always {
            page-break-after: always;
          }
          @page {
            margin: 10mm;
          }
        }
      `}} />
    </div>
  );
}
