"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, FolderKanban, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// Mock Data
const MOCK_PROJECTS = [
  { id: '1', name: 'Office Complex A', customer: 'TechCorp Inc', status: 'In Production', date: '2026-10-24' },
  { id: '2', name: 'Residential Villa', customer: 'Mr. Sharma', status: 'Design Phase', date: '2026-10-23' },
  { id: '3', name: 'Mall Entrance', customer: 'City Build Const.', status: 'Quote Sent', date: '2026-10-15' },
];

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filteredProjects = MOCK_PROJECTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage ongoing and past projects.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      <Card>
        <CardHeader className="py-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search projects or customers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm border-0 focus-visible:ring-0 px-0 shadow-none bg-transparent"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No projects found matching "{searchTerm}"
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FolderKanban className="h-4 w-4 text-brand-primary" />
                        {project.name}
                      </div>
                    </TableCell>
                    <TableCell>{project.customer}</TableCell>
                    <TableCell>
                      <Badge variant={
                        project.status === 'In Production' ? 'success' : 
                        project.status === 'Design Phase' ? 'warning' : 'default'
                      }>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{project.date}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/projects/${project.id}`}>
                          Open <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Basic Modal for New Project (Mock) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Project Name</label>
                <Input placeholder="e.g. Skyline Apartments Phase 1" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Select Customer</label>
                <select className="w-full h-10 px-3 mt-1 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="">-- Select a Customer --</option>
                  <option value="1">TechCorp Inc</option>
                  <option value="2">Mr. Sharma</option>
                  <option value="3">City Build Const.</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Site Address</label>
                <textarea 
                  className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                  rows={2}
                  placeholder="Installation address"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button onClick={() => setShowModal(false)}>Create Project</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
