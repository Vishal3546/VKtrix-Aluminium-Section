"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock Data
const MOCK_CUSTOMERS = [
  { id: '1', name: 'TechCorp Inc', phone: '+91 9876543210', gst: '27AADCB2230M1Z2', address: 'Mumbai, Maharashtra', status: 'Active' },
  { id: '2', name: 'Mr. Sharma', phone: '+91 9988776655', gst: 'Unregistered', address: 'Pune, Maharashtra', status: 'Active' },
  { id: '3', name: 'City Build Const.', phone: '+91 9123456780', gst: '27BBBCB2230M1Z3', address: 'Thane, Maharashtra', status: 'Inactive' },
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filteredCustomers = MOCK_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Customers</h1>
          <p className="text-muted-foreground mt-1">Manage your client list and details.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader className="py-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search customers by name or phone..." 
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
                <TableHead>Customer Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>GST Number</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No customers found matching "{searchTerm}"
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell className="font-mono text-xs">{customer.gst}</TableCell>
                    <TableCell className="truncate max-w-[200px]" title={customer.address}>{customer.address}</TableCell>
                    <TableCell>
                      <Badge variant={customer.status === 'Active' ? 'success' : 'secondary'}>
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-brand-primary">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Basic Modal for Add Customer (Mock) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle>Add New Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Customer Name</label>
                <Input placeholder="Enter company or person name" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <Input placeholder="+91 XXXXX XXXXX" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">GSTIN (Optional)</label>
                <Input placeholder="27XXXXX1234X1ZX" className="mt-1 font-mono uppercase" />
              </div>
              <div>
                <label className="text-sm font-medium">Billing Address</label>
                <textarea 
                  className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
                  rows={3}
                  placeholder="Enter full address"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button onClick={() => setShowModal(false)}>Save Customer</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
