"use client"

import React from 'react';
import Link from 'next/link';
import { 
  FolderKanban, 
  FileText, 
  Package, 
  AlertTriangle,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back. Here is what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/quotation">New Quotation</Link>
          </Button>
          <Button asChild>
            <Link href="/design">
              <Plus className="mr-2 h-4 w-4" /> New Design
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Quotations</CardTitle>
            <FileText className="h-4 w-4 text-brand-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">3 requiring approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Production</CardTitle>
            <Package className="h-4 w-4 text-brand-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24 units</div>
            <p className="text-xs text-muted-foreground">On track for daily goal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">2</div>
            <p className="text-xs text-muted-foreground">Glass & Corner joints</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects Table Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 rounded-tl-md">Project Name</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Updated</th>
                  <th className="px-4 py-3 text-right rounded-tr-md">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium">Office Complex A</td>
                  <td className="px-4 py-3">TechCorp Inc</td>
                  <td className="px-4 py-3"><Badge variant="success">In Production</Badge></td>
                  <td className="px-4 py-3">Today, 10:23 AM</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm">View <ArrowRight className="ml-1 h-3 w-3" /></Button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium">Residential Villa</td>
                  <td className="px-4 py-3">Mr. Sharma</td>
                  <td className="px-4 py-3"><Badge variant="warning">Design Phase</Badge></td>
                  <td className="px-4 py-3">Yesterday</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm">View <ArrowRight className="ml-1 h-3 w-3" /></Button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium">Mall Entrance</td>
                  <td className="px-4 py-3">City Build</td>
                  <td className="px-4 py-3"><Badge variant="default">Quote Sent</Badge></td>
                  <td className="px-4 py-3">Oct 24, 2026</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm">View <ArrowRight className="ml-1 h-3 w-3" /></Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
