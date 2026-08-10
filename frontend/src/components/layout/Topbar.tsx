"use client"

import React from 'react'
import { Bell, Search, User } from 'lucide-react'

export function Topbar() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search projects..."
            className="h-9 w-64 rounded-md border border-input bg-transparent pl-9 pr-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <select className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          <option>Project Alpha</option>
          <option>Project Beta</option>
          <option>Global Factory</option>
        </select>
        
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand-info"></span>
        </button>
        
        <div className="flex items-center gap-2 border-l pl-4 ml-2">
          <div className="h-8 w-8 rounded-full bg-brand-primary text-white flex items-center justify-center">
            <User size={16} />
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-medium leading-none text-brand-dark">Alex Manager</p>
            <p className="text-xs text-muted-foreground mt-1">Admin</p>
          </div>
        </div>
      </div>
    </header>
  )
}
