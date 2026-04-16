/**
 * QC 시험 관리 시스템 - 공통 타입 정의
 * Frontend/Backend 양쪽에서 공유하는 타입을 여기서 관리합니다.
 */

// ─── 시험 상태 ────────────────────────────────────────────────────────────────
export type StatusKey = 'completed' | 'reviewing' | 'pending' | 'fail' | 'inprogress'

// ─── 테이블 행 ────────────────────────────────────────────────────────────────
export interface TestRow {
  id: number
  category: string
  type: string
  product: string
  testNo: string
  items: string
  contractor: string
  manager: string
  managerInit: string
  receiveDate: string
  dueDate: string
  status: StatusKey
}

// ─── KPI 카드 ─────────────────────────────────────────────────────────────────
export interface KpiItem {
  label: string
  value: string
  unit: string
  sub: string
  accent: string
  bg: string
  border: string
}
