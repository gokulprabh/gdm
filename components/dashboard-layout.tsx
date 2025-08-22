"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, PenTool, MessageCircle, BarChart3, Settings, Menu, HelpCircle, Mic, Code } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { UserMenu } from "@/components/user-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProtectedRoute } from "@/components/protected-route"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: "Home", icon: LayoutDashboard, href: "/", current: pathname === "/" },
    { name: "Create Post", icon: PenTool, href: "/create", current: pathname === "/create" },
    { name: "Chat", icon: MessageCircle, href: "/schedule", current: pathname === "/schedule" },
    { name: "Analytics", icon: BarChart3, href: "/analytics", current: pathname === "/analytics" },
    { name: "Explain", icon: HelpCircle, href: "/explain", current: pathname === "/explain" },
    { name: "Speak", icon: Mic, href: "/speak", current: pathname === "/speak" },
    { name: "Embed", icon: Code, href: "/embed", current: pathname === "/embed" },
    { name: "Settings", icon: Settings, href: "/settings", current: pathname === "/settings" },
  ]

  const NavigationItems = () => (
    <div className="space-y-1">
      {navigation.map((item) => {
        const Icon = item.icon
        return (
          <Link key={item.name} href={item.href} onClick={() => setOpen(false)}>
            <Button variant={item.current ? "default" : "ghost"} className="w-full justify-start gap-3 h-11">
              <Icon className="h-5 w-5" />
              {item.name}
            </Button>
          </Link>
        )
      })}
    </div>
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="mr-4">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex flex-col h-full">
                  <div className="flex items-center px-2 py-4">
                    <h1 className="text-lg font-semibold">Deepmind Explorations</h1>
                  </div>
                  <nav className="flex-1 px-2">
                    <NavigationItems />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex flex-1 items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-semibold">Deepmind Explorations</h1>
              </div>

              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="container py-6">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
