"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, PenTool, FileText, Download, Check } from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetailPage({ params }: any) {
  // Mock data for the specific project
  const { id } = React.use(params as Promise<{id: string}>);
  const project = {
    id: id,
    name: 'Office Complex A',
    customer: 'TechCorp Inc',
    status: 'In Production',
    date: '2026-10-24',
    address: 'Andheri East, Mumbai, Maharashtra 400069',
    designs: [
      { id: 'd1', name: 'Main Entrance Glass', dimensions: '1200x2400', type: 'Fixed + Door' },
      { id: 'd2', name: 'Conference Room Partitions', dimensions: '4000x2800', type: 'Fixed' }
    ],
    quotation: {
      id: 'q1',
      total: '₹3,45,000',
      status: 'Approved',
      date: '2026-10-25'
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/projects"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{project.name}</h1>
        <Badge variant="success" className="ml-2">{project.status}</Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium text-lg">{project.customer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium text-lg">{project.date}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Site Address</p>
                <p className="font-medium">{project.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quotation</CardTitle>
            <CardDescription>Active quote for this project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-brand-primary">{project.quotation.total}</span>
              <Badge variant="success"><Check className="h-3 w-3 mr-1"/> {project.quotation.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Approved on {project.quotation.date}</p>
            <div className="space-y-2">
              <Button className="w-full" variant="outline"><FileText className="mr-2 h-4 w-4" /> View Quote</Button>
              <Button className="w-full" variant="outline"><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between mt-8 mb-4">
        <h2 className="text-2xl font-bold">Designs</h2>
        <Button asChild>
          <Link href="/design"><PenTool className="mr-2 h-4 w-4" /> New Design</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {project.designs.map((design) => (
          <Card key={design.id} className="hover:border-brand-primary/50 transition-colors cursor-pointer group">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{design.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-1">Dimensions: {design.dimensions} mm</p>
              <p className="text-sm text-muted-foreground mb-4">Type: {design.type}</p>
              <Button variant="ghost" className="w-full group-hover:bg-brand-primary/10 group-hover:text-brand-primary">
                Edit Design
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
