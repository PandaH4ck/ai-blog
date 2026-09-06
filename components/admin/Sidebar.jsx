'use client'

import { Settings, FileText, StickyNote, BarChart2, Brush } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const Sidebar = () => {
  return (
    <aside className="sidebar-full">
      <Button variant="outline" size="icon" className="sidebar-item">
        <FileText size={20} strokeWidth={1.5} />
      </Button>

      <Button variant="outline" size="icon" className="sidebar-item">
        <StickyNote size={20} strokeWidth={1.5} />
      </Button>

      <Button variant="outline" size="icon" className="sidebar-item">
        <BarChart2 size={20} strokeWidth={1.5} />
      </Button>

      <Button variant="outline" size="icon" className="sidebar-item">
        <Brush size={20} strokeWidth={1.5} />
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="sidebar-item">
            <Settings size={20} strokeWidth={1.5} />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>API Key</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              console.log('Key saved!')
            }}
            className="grid gap-4 py-4"
          >
            <Input type="password" placeholder="sk-..." autoFocus />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit">Save</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </aside>
  )
}

export default Sidebar
