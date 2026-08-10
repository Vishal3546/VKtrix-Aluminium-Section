"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FolderKanban, 
  PenTool, 
  FileText, 
  Users,
  Menu,
  History,
  Building2,
  Wand2
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Party', href: '/customers', icon: Users },
  { name: 'Project', href: '/projects', icon: FolderKanban },
  { name: 'Design', href: '/design', icon: PenTool },
  { name: 'Auto Design', href: '/auto-design', icon: Wand2 },
  { name: 'Quotation', href: '/quotation', icon: FileText },
  { name: 'Profile', href: '/profile', icon: LayoutDashboard },
  { name: 'History', href: '/history', icon: History },
  { name: 'Company Detail', href: '/company', icon: Building2 },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={cn(
      "flex flex-col bg-brand-dark text-white transition-all duration-300 min-h-screen",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-16 items-center justify-between px-4 border-b border-brand-primary/30">
        {!collapsed && (
          <h1 className="font-bold text-2xl tracking-widest text-white flex items-center">
            <span className="text-blue-500 text-3xl">h</span>
            <span className="text-blue-400">A</span>
            <span className="text-blue-500">Arsh</span>
          </h1>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-brand-primary/50 rounded text-brand-light transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  isActive 
                    ? "bg-brand-primary text-white" 
                    : "text-brand-light/70 hover:bg-brand-primary/50 hover:text-white"
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon size={20} className="shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
