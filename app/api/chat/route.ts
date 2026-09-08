import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1]?.content || ''

    if (!lastMessage.trim()) {
      return NextResponse.json({ error: 'Message is empty' }, { status: 400 })
    }

    // If a Gemini/OpenAI key is configured in process.env, an external API can be called here.
    // Example assistant response:
    const reply = `I can help with your blog! You wrote: "${lastMessage}". What else can I help with, posts or code?`

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error('Chat API Error:', error)
    return NextResponse.json({ error: 'Failed to generate a response' }, { status: 500 })
  }
}
