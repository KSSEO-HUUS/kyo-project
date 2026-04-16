/**
 * [BACKEND] Chat 서비스 - Dify API 연동
 *
 * app/api/chat/route.ts 에서 호출합니다.
 * 비즈니스 로직을 API Route와 분리하여 유지보수성을 높입니다.
 */

interface ChatRequest {
  message: string
  conversationId?: string
}

interface DifyPayload {
  inputs: Record<string, unknown>
  query: string
  response_mode: 'streaming' | 'blocking'
  conversation_id: string
  user: string
}

/**
 * Dify API에 채팅 메시지를 전송하고 SSE 스트림을 반환합니다.
 */
export async function sendChatMessage({ message, conversationId }: ChatRequest): Promise<Response> {
  const difyApiUrl = process.env.DIFY_API_URL
  const difyApiKey = process.env.DIFY_API_KEY

  if (!difyApiUrl || !difyApiKey) {
    throw new Error('Dify API 환경변수가 설정되지 않았습니다. .env.local을 확인해주세요.')
  }

  const payload: DifyPayload = {
    inputs: {},
    query: message,
    response_mode: 'streaming',
    conversation_id: conversationId ?? '',
    user: 'kd-qc-user',
  }

  const res = await fetch(`${difyApiUrl}/v1/chat-messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${difyApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(errText)
  }

  return res
}
