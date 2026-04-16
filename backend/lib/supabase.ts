/**
 * [BACKEND] Supabase 클라이언트 - 서버 전용
 *
 * 환경변수 설정 필요 (.env.local):
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 *
 * 서비스 롤 키 (RLS 우회, 서버 사이드 전용):
 *   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/** 일반 클라이언트 (Row Level Security 적용) */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/** 서버 전용 Admin 클라이언트 (RLS 우회 - API Route에서만 사용) */
// export const supabaseAdmin = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!,
//   { auth: { autoRefreshToken: false, persistSession: false } }
// )
