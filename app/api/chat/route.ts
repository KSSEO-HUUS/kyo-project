import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

/**
 * Dify API 프록시
 * 환경변수 설정:
 *   DIFY_API_URL=https://api.dify.ai   (또는 self-hosted URL)
 *   DIFY_API_KEY=app-xxxxxxxxxxxx
 */
export async function POST(req: NextRequest) {
  try {
    const { message, conversationId } = await req.json()

    const difyApiUrl = process.env.DIFY_API_URL
    const difyApiKey = process.env.DIFY_API_KEY

    if (!difyApiUrl || !difyApiKey) {
      return Response.json(
        {
          error:
            'Dify API가 설정되지 않았습니다. .env.local에 DIFY_API_URL과 DIFY_API_KEY를 설정해주세요.',
        },
        { status: 503 },
      )
    }

    const difyRes = await fetch(`${difyApiUrl}/v1/chat-messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${difyApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: message,
        response_mode: 'streaming',
        conversation_id: conversationId ?? '',
        user: 'kd-qc-user',
      }),
    })

    if (!difyRes.ok) {
      const errText = await difyRes.text()
      return Response.json({ error: errText }, { status: difyRes.status })
    }

    return new Response(difyRes.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (err) {
    console.error('[chat/route]', err)
    return Response.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
