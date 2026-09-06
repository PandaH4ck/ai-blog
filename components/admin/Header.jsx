'use client'

import { Button } from '../ui/button'
import { UserButton } from '@clerk/nextjs'
const Header = ({ projectName = 'Post Editor', onPublish }) => {
  return (
    <div className="flex h-12 w-full items-center justify-between border-b border-gray-200 px-6 dark:border-gray-800">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
          {projectName}
        </span>
        <span className="text-gray-300 dark:text-gray-700">•</span>
      </div>

      <div className="flex items-center gap-3">
        <UserButton />

        <Button size="sm" onClick={onPublish}>
          Publish
        </Button>
      </div>
    </div>
  )
}

export default Header
