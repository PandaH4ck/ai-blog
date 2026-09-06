'use client'
import TextareaAutosize from 'react-textarea-autosize'
import { SendHorizontal } from 'lucide-react'
import { Button } from '../ui/button'

const AiPromptBox = () => {
  return (
    <div className="ai-toolbar">
      <div className="ai-toolbar__input-area">
        <TextareaAutosize
          minRows={1}
          maxRows={8}
          className="ai-toolbar__input"
          placeholder="Tell AI what to do..."
        />

        <Button size="icon" className="ai-toolbar__send-btn">
          <SendHorizontal size={16} />
        </Button>
      </div>
    </div>
  )
}

export default AiPromptBox
