import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Supabase 클라이언트
 * 환경변수 설정 필요:
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 서버 전용 (RLS 우회 필요 시)
// import { createClient as createServerClient } from '@supabase/supabase-js'
// export const supabaseAdmin = createServerClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// )
