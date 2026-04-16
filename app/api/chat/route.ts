/**
 * [BACKEND] Chat API Route
 * 실제 로직은 @backend/services/chat 에 위임합니다.
 */

import { NextRequest } from 'next/server'
import { sendChatMessage } from '@backend/services/chat'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { message, conversationId } = await req.json()
    const difyRes = await sendChatMessage({ message, conversationId })

    return new Response(difyRes.body, {
      headers: {
        'Content-Type':    'text/event-stream',
        'Cache-Control':   'no-cache',
        Connection:        'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (err) {
    console.error('[api/chat]', err)
    const msg = err instanceof Error ? err.message : '서버 오류가 발생했습니다.'
    const status = msg.includes('환경변수') ? 503 : 500
    return Response.json({ error: msg }, { status })
  }
}
