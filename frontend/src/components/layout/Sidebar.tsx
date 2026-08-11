"use client"

import React, { useState, useEffect } from 'react'
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
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Party', href: '/customers', icon: Users },
  { name: 'Project', href: '/projects', icon: FolderKanban },
  { name: 'Design', href: '/design', icon: PenTool },
  { name: 'Auto Design', href: '/auto-design', icon: Wand2 },
  { name: 'Quotation', href: '/quotation', icon: FileText },
  { name: 'Profile Systems', href: '/profile', icon: Building2 },
  { name: 'History', href: '/history', icon: History },
  { name: 'Company Detail', href: '/company', icon: Building2 },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true)
      } else {
        setCollapsed(false)
      }
    }
    // Initialize on mount
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Collapse sidebar on mobile when navigating to a new page
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setCollapsed(true)
    }
  }, [pathname])

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setCollapsed(true)}
          aria-hidden="true"
        />
      )}
      
      <div className={cn(
        "flex flex-col bg-brand-dark text-white transition-all duration-300 min-h-screen z-50",
        collapsed ? "w-16" : "w-64 absolute lg:relative h-full"
      )}>
        <div className="flex h-16 items-center justify-between px-4 border-b border-brand-primary/30">
          {!collapsed && (
            <h1 className="font-bold text-2xl tracking-widest text-white flex items-center">
              <span className="text-blue-500 text-3xl">V</span>
              <span className="text-blue-400">K</span>
              <span className="text-blue-500">trix</span>
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
    </>
  )
}
