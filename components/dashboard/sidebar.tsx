'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Home,
  FlaskConical,
  Package,
  Box,
  ShieldCheck,
  Activity,
  AlertTriangle,
  FileText,
  BarChart2,
  Cpu,
  Settings,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface SubItem {
  id: string
  label: string
}

interface NavItem {
  id: string
  icon: React.ReactNode
  label: string
  badge?: number
  subItems?: SubItem[]
}

// ─── Nav Data ─────────────────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  { id: 'home', icon: <Home size={17} />, label: '홈' },
  {
    id: 'test-mgmt',
    icon: <FlaskConical size={17} />,
    label: '시험관리',
    subItems: [
      { id: 'test-status', label: '시험현황' },
      { id: 'test-reg',    label: '시험등록' },
      { id: 'test-result', label: '결과입력' },
      { id: 'test-cert',   label: '성적서관리' },
      { id: 'test-items',  label: '시험항목관리' },
    ],
  },
  {
    id: 'raw-test',
    icon: <Package size={17} />,
    label: '원료시험',
    subItems: [
      { id: 'raw-status', label: '원료시험현황' },
      { id: 'raw-reg',    label: '원료등록' },
      { id: 'raw-vendor', label: '업체관리' },
    ],
  },
  {
    id: 'product-test',
    icon: <Box size={17} />,
    label: '제품시험',
    subItems: [
      { id: 'prod-status', label: '제품시험현황' },
      { id: 'prod-reg',    label: '완제품등록' },
      { id: 'prod-std',    label: '기준서관리' },
    ],
  },
  {
    id: 'stability',
    icon: <ShieldCheck size={17} />,
    label: '안정성시험',
    subItems: [
      { id: 'stab-status', label: '안정성현황' },
      { id: 'stab-plan',   label: '시험계획' },
      { id: 'stab-report', label: '결과보고' },
    ],
  },
  {
    id: 'env-monitor',
    icon: <Activity size={17} />,
    label: '환경모니터링',
    subItems: [
      { id: 'env-status',   label: '모니터링현황' },
      { id: 'env-plan',     label: '계획관리' },
      { id: 'env-analysis', label: '결과분석' },
    ],
  },
  {
    id: 'deviation',
    icon: <AlertTriangle size={17} />,
    label: '일탈관리',
    badge: 3,
    subItems: [
      { id: 'oos',        label: 'OOS현황' },
      { id: 'capa',       label: 'CAPA관리' },
      { id: 'inv-report', label: '조사보고서' },
    ],
  },
  {
    id: 'documents',
    icon: <FileText size={17} />,
    label: '문서관리',
    subItems: [
      { id: 'doc-cert',      label: '성적서' },
      { id: 'doc-std',       label: '기준서' },
      { id: 'doc-sop',       label: 'SOP' },
      { id: 'doc-checklist', label: '체크리스트' },
    ],
  },
  {
    id: 'insights',
    icon: <BarChart2 size={17} />,
    label: '인사이트',
    subItems: [
      { id: 'dash',       label: '대시보드' },
      { id: 'stats',      label: '통계분석' },
      { id: 'ins-report', label: '리포트' },
    ],
  },
  {
    id: 'equipment',
    icon: <Cpu size={17} />,
    label: '장비관리',
    subItems: [
      { id: 'equip-operation', label: '장비 가동 현황' },
      { id: 'equip-backup',    label: '장비 백업 현황' },
      { id: 'equip-usage',     label: '장비 사용현황' },
      { id: 'equip-ai-maint',  label: '장비 예측 정비 AI' },
    ],
  },
]

const BOTTOM_NAV: NavItem[] = [
  {
    id: 'settings',
    icon: <Settings size={17} />,
    label: '설정',
    subItems: [
      { id: 'users',        label: '사용자관리' },
      { id: 'roles',        label: '권한관리' },
      { id: 'sys-settings', label: '시스템설정' },
    ],
  },
]

const ALL_NAV = [...NAV_ITEMS, ...BOTTOM_NAV]

// ─── Props ────────────────────────────────────────────────────────────────────
interface SidebarProps {
  activeItem?: string
  onNavigate?: (navId: string, subId?: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Sidebar({ activeItem = 'test-mgmt', onNavigate }: SidebarProps) {
  const [openMenu,   setOpenMenu]   = useState<string | null>(activeItem)
  const [hoverMenu,  setHoverMenu]  = useState<string | null>(null)
  const [favorites,  setFavorites]  = useState<Set<string>>(new Set())
  const [collapsed,  setCollapsed]  = useState(false)

  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('kd-qc-favorites')
      if (stored) setFavorites(new Set(JSON.parse(stored) as string[]))
    } catch {}
  }, [])

  const toggleFavorite = (subItemId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(subItemId) ? next.delete(subItemId) : next.add(subItemId)
      localStorage.setItem('kd-qc-favorites', JSON.stringify([...next]))
      return next
    })
  }

  const handleNavClick = (item: NavItem) => {
    if (!item.subItems) {
      setOpenMenu(null)
      setHoverMenu(null)
      onNavigate?.(item.id)
      return
    }
    // Toggle: clicking active item closes it
    setOpenMenu(prev => (prev === item.id ? null : item.id))
    setHoverMenu(null)
  }

  const clearTimers = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
  }

  const handleItemMouseEnter = (itemId: string, hasSubItems: boolean) => {
    clearTimers()
    if (hasSubItems && openMenu !== itemId) {
      hoverTimer.current = setTimeout(() => setHoverMenu(itemId), 180)
    }
  }

  const handleSidebarMouseLeave = () => {
    clearTimers()
    leaveTimer.current = setTimeout(() => setHoverMenu(null), 350)
  }

  const handlePanelMouseEnter = () => clearTimers()

  const handlePanelMouseLeave = () => {
    clearTimers()
    leaveTimer.current = setTimeout(() => setHoverMenu(null), 300)
  }

  const handleCollapse = () => {
    setCollapsed(true)
    setOpenMenu(null)
    setHoverMenu(null)
  }

  // Panel to display: explicit click wins over hover
  const visibleMenuId   = openMenu ?? hoverMenu
  const activeMenuData  = visibleMenuId ? ALL_NAV.find(n => n.id === visibleMenuId) : null
  const isPanelOpen     = !!activeMenuData?.subItems && !collapsed

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Collapsed toggle button */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="fixed left-0 top-1/2 z-50 -translate-y-1/2 flex h-10 w-5 items-center justify-center rounded-r-lg bg-slate-700 text-slate-300 shadow-xl hover:bg-slate-600 transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      )}

      {/*
        ── Flex row wrapper ───────────────────────────────────────────────────
        Both the icon-rail and the submenu panel live here as flex siblings.
        The wrapper's total width expands/contracts → main content auto-adjusts.
      */}
      <div className="flex h-full shrink-0 z-40">

        {/* ── Icon rail ──────────────────────────────────────────────────── */}
        <aside
          onMouseLeave={handleSidebarMouseLeave}
          className="flex flex-col shrink-0 h-full transition-[width] duration-300 overflow-hidden"
          style={{ width: collapsed ? 0 : 65, backgroundColor: '#1a1f2e' } as React.CSSProperties}
        >
          {/* Logo */}
          <div className="flex items-center justify-center py-3.5 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-900/50">
              <span className="text-xs font-bold tracking-tight text-white">KD</span>
            </div>
          </div>

          <div className="mx-3 mb-1 h-px bg-white/8 shrink-0" />

          {/* Main nav */}
          <nav className="flex flex-1 flex-col items-center gap-0.5 px-2 py-1 overflow-y-auto overflow-x-hidden">
            {NAV_ITEMS.map(item => {
              const isOpen        = openMenu    === item.id
              const isHighlighted = visibleMenuId === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  onMouseEnter={() => handleItemMouseEnter(item.id, !!item.subItems)}
                  className={`
                    relative flex w-full flex-col items-center gap-1 rounded-xl px-1 py-2.5
                    transition-all duration-150 cursor-pointer select-none
                    ${isHighlighted
                      ? 'bg-white/14 text-white'
                      : 'text-slate-400 hover:bg-white/7 hover:text-slate-200'}
                  `}
                >
                  {isOpen && (
                    <span className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full bg-blue-500" />
                  )}
                  <div className="relative">
                    {item.icon}
                    {item.badge != null && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold text-white leading-none">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[9.5px] font-medium leading-none tracking-tight text-center w-full truncate">
                    {item.label}
                  </span>
                </button>
              )
            })}
          </nav>

          {/* Bottom nav */}
          <div className="flex flex-col items-center gap-0.5 px-2 py-2 border-t border-white/8 shrink-0">
            {BOTTOM_NAV.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                onMouseEnter={() => handleItemMouseEnter(item.id, !!item.subItems)}
                className={`
                  relative flex w-full flex-col items-center gap-1 rounded-xl px-1 py-2
                  transition-colors cursor-pointer select-none
                  ${visibleMenuId === item.id
                    ? 'bg-white/14 text-white'
                    : 'text-slate-500 hover:bg-white/7 hover:text-slate-300'}
                `}
              >
                {item.icon}
                <span className="text-[9.5px] font-medium leading-none">{item.label}</span>
              </button>
            ))}

            <button
              onClick={handleCollapse}
              title="사이드바 접기"
              className="flex w-full flex-col items-center gap-1 rounded-xl px-1 py-2 text-slate-600 hover:bg-white/7 hover:text-slate-400 transition-colors"
            >
              <ChevronLeft size={15} />
              <span className="text-[9px] leading-none">접기</span>
            </button>

            <button
              title="관리자"
              className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/80 text-[11px] font-bold text-white hover:bg-blue-600 transition-colors"
            >
              관
            </button>
          </div>
        </aside>

        {/* ── Submenu panel (inline flex sibling, not fixed) ─────────────── */}
        <div
          onMouseEnter={handlePanelMouseEnter}
          onMouseLeave={handlePanelMouseLeave}
          className="flex flex-col shrink-0 bg-white border-r border-slate-100 shadow-[2px_0_12px_-2px_rgba(0,0,0,0.08)] overflow-hidden transition-[width] duration-200"
          style={{ width: isPanelOpen ? 210 : 0 }}
        >
          {/* Fixed-width inner prevents layout jitter during transition */}
          <div className="flex flex-col h-full" style={{ width: 210 }}>
            {activeMenuData && (
              <>
                {/* Panel header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center text-slate-400">
                      {ALL_NAV.find(n => n.id === visibleMenuId)?.icon}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">{activeMenuData.label}</span>
                  </div>
                  <button
                    onClick={() => { setOpenMenu(null); setHoverMenu(null) }}
                    className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                  >
                    <X size={13} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto py-2 px-2">
                  {/* Favorites section */}
                  {(() => {
                    const favItems = activeMenuData.subItems!.filter(si => favorites.has(si.id))
                    if (!favItems.length) return null
                    return (
                      <div className="mb-1">
                        <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                          즐겨찾기
                        </p>
                        {favItems.map(sub => (
                          <SubItemRow
                            key={`fav-${sub.id}`}
                            sub={sub}
                            isFav
                            onFavToggle={toggleFavorite}
                            onSelect={() => onNavigate?.(activeMenuData.id, sub.id)}
                          />
                        ))}
                        <div className="my-2 mx-2 border-t border-slate-100" />
                      </div>
                    )
                  })()}

                  {/* All sub-items */}
                  {(() => {
                    const hasFavs = activeMenuData.subItems!.some(si => favorites.has(si.id))
                    return (
                      <div>
                        {hasFavs && (
                          <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                            전체
                          </p>
                        )}
                        {activeMenuData.subItems!.map(sub => (
                          <SubItemRow
                            key={sub.id}
                            sub={sub}
                            isFav={favorites.has(sub.id)}
                            onFavToggle={toggleFavorite}
                            onSelect={() => onNavigate?.(activeMenuData.id, sub.id)}
                          />
                        ))}
                      </div>
                    )
                  })()}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Sub-item Row ─────────────────────────────────────────────────────────────
interface SubItemRowProps {
  sub: SubItem
  isFav: boolean
  onFavToggle: (id: string, e: React.MouseEvent) => void
  onSelect: () => void
}

function SubItemRow({ sub, isFav, onFavToggle, onSelect }: SubItemRowProps) {
  return (
    <button
      onClick={onSelect}
      className="group flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-slate-50 active:bg-slate-100"
    >
      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
        {sub.label}
      </span>
      <button
        onClick={e => onFavToggle(sub.id, e)}
        className={`
          shrink-0 rounded p-0.5 transition-all
          ${isFav
            ? 'text-amber-400 hover:text-amber-500'
            : 'text-transparent group-hover:text-slate-300 hover:!text-amber-400'}
        `}
      >
        <Star size={12} fill={isFav ? 'currentColor' : 'none'} />
      </button>
    </button>
  )
}
