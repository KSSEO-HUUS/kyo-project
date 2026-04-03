'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Sidebar from '@/components/dashboard/sidebar'
import Chatbot from '@/components/dashboard/chatbot'
import {
  Bell,
  ChevronDown,
  Star,
  Pin,
  PinOff,
  Filter,
  Download,
  Calendar,
  Search,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
type StatusKey = 'completed' | 'reviewing' | 'pending' | 'fail' | 'inprogress'

interface TestRow {
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

// ─── Static Data ──────────────────────────────────────────────────────────────
const ALL_TABS = ['시험현황', '원료시험', '제품시험', '안정성시험', '환경모니터링', '일탈관리'] as const

const STATUS_CONFIG: Record<StatusKey, { label: string; cls: string }> = {
  completed:  { label: '적합완료', cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  reviewing:  { label: '검토중',   cls: 'bg-blue-50 text-blue-700 border border-blue-200' },
  pending:    { label: '승인대기', cls: 'bg-amber-50 text-amber-700 border border-amber-200' },
  fail:       { label: '부적합',   cls: 'bg-red-50 text-red-700 border border-red-200' },
  inprogress: { label: '진행중',   cls: 'bg-violet-50 text-violet-700 border border-violet-200' },
}

interface KpiItem {
  label: string; value: string; unit: string; sub: string
  accent: string; bg: string; border: string
}

const KPI_DATA: KpiItem[] = [
  { label: '전체시험',  value: '324',  unit: '건',  sub: '이번 달 전체',   accent: 'text-slate-800',   bg: 'bg-white',          border: 'border-slate-200'  },
  { label: '나의시험',  value: '7',    unit: '건',  sub: '배정된 시험',    accent: 'text-blue-600',    bg: 'bg-blue-50/60',     border: 'border-blue-100'   },
  { label: '진행중',    value: '42',   unit: '건',  sub: '처리 진행 중',   accent: 'text-violet-600',  bg: 'bg-violet-50/60',   border: 'border-violet-100' },
  { label: '완료',      value: '276',  unit: '건',  sub: '시험 완료',      accent: 'text-emerald-600', bg: 'bg-emerald-50/60',  border: 'border-emerald-100'},
  { label: '전달대비',  value: '±0',   unit: '%',   sub: '증감 없음',      accent: 'text-slate-500',   bg: 'bg-slate-50',       border: 'border-slate-200'  },
  { label: 'OOS건수',   value: '3',    unit: '건',  sub: '기준 이탈',      accent: 'text-red-600',     bg: 'bg-red-50/60',      border: 'border-red-100'    },
  { label: '평균처리일', value: '2.4', unit: '일',  sub: '처리 소요일',    accent: 'text-amber-600',   bg: 'bg-amber-50/60',    border: 'border-amber-100'  },
]

const TABLE_DATA: TestRow[] = [
  { id:1,  category:'완제품', type:'이화학시험',  product:'경옥고 프리미엄',        testNo:'QC-2024-0312', items:'pH, 점도, 비중',       contractor:'광동제약(주)', manager:'김수현', managerInit:'김', receiveDate:'2024.03.01', dueDate:'2024.03.15', status:'completed'  },
  { id:2,  category:'원료',   type:'미생물시험',  product:'비타500 원액',           testNo:'QC-2024-0318', items:'총균수, 대장균',       contractor:'광동제약(주)', manager:'박지민', managerInit:'박', receiveDate:'2024.03.05', dueDate:'2024.03.20', status:'reviewing'  },
  { id:3,  category:'완제품', type:'안정성시험',  product:'홍삼농축액 에브리타임',  testNo:'QC-2024-0325', items:'함량, 순도',           contractor:'광동제약(주)', manager:'이서연', managerInit:'이', receiveDate:'2024.03.08', dueDate:'2024.04.08', status:'inprogress' },
  { id:4,  category:'완제품', type:'이화학시험',  product:'옥수수수염차 500ml',     testNo:'QC-2024-0331', items:'pH, 탁도, 당도',       contractor:'광동제약(주)', manager:'최준호', managerInit:'최', receiveDate:'2024.03.10', dueDate:'2024.03.25', status:'pending'    },
  { id:5,  category:'원료',   type:'중금속시험',  product:'경옥고 원료 배합',       testNo:'QC-2024-0337', items:'Pb, Cd, As, Hg',      contractor:'광동제약(주)', manager:'김수현', managerInit:'김', receiveDate:'2024.03.12', dueDate:'2024.03.26', status:'completed'  },
  { id:6,  category:'완제품', type:'미생물시험',  product:'비타500W 제로',          testNo:'QC-2024-0342', items:'총균수, 효모',         contractor:'광동제약(주)', manager:'박지민', managerInit:'박', receiveDate:'2024.03.14', dueDate:'2024.03.28', status:'fail'       },
  { id:7,  category:'원료',   type:'이화학시험',  product:'홍삼정 에브리타임 2X',  testNo:'QC-2024-0349', items:'진세노사이드 함량',    contractor:'광동제약(주)', manager:'정다은', managerInit:'정', receiveDate:'2024.03.15', dueDate:'2024.03.29', status:'inprogress' },
  { id:8,  category:'완제품', type:'관능시험',    product:'헛개수 플러스',          testNo:'QC-2024-0356', items:'색상, 향, 맛, 이물',   contractor:'광동제약(주)', manager:'이서연', managerInit:'이', receiveDate:'2024.03.18', dueDate:'2024.04.01', status:'reviewing'  },
]

const AVATAR_COLORS: Record<string, string> = {
  김: 'bg-blue-500', 박: 'bg-violet-500', 이: 'bg-emerald-500',
  최: 'bg-amber-500', 정: 'bg-rose-500',
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function QCDashboard() {
  const [activeTab, setActiveTab]         = useState<string>('시험현황')
  const [pinnedTabs, setPinnedTabs]       = useState<Set<string>>(new Set(['시험현황', '원료시험']))
  const [stickyHeader, setStickyHeader]   = useState(true)
  const [selectedRows, setSelectedRows]   = useState<Set<number>>(new Set())
  const [searchValue, setSearchValue]     = useState('')
  const [dateFrom, setDateFrom]           = useState('2024-03-01')
  const [dateTo, setDateTo]               = useState('2024-03-31')
  const [activeNav, setActiveNav]         = useState('test-mgmt')

  const toggleTab = (tab: string) => {
    setPinnedTabs(prev => {
      const next = new Set(prev)
      next.has(tab) ? next.delete(tab) : next.add(tab)
      return next
    })
  }

  const toggleRow = (id: number) => {
    setSelectedRows(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    setSelectedRows(selectedRows.size === TABLE_DATA.length ? new Set() : new Set(TABLE_DATA.map(r => r.id)))
  }

  const filtered = TABLE_DATA.filter(
    row =>
      !searchValue ||
      row.product.includes(searchValue) ||
      row.testNo.includes(searchValue) ||
      row.manager.includes(searchValue),
  )

  // Sorted tabs: pinned first, then rest
  const sortedTabs = [
    ...ALL_TABS.filter(t => pinnedTabs.has(t)),
    ...ALL_TABS.filter(t => !pinnedTabs.has(t)),
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 font-sans">

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <Sidebar
        activeItem={activeNav}
        onNavigate={(navId) => setActiveNav(navId)}
      />

      {/* ── Main area ──────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* ── Top bar ──────────────────────────────────────────────────────── */}
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm z-20">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 leading-none">광동제약</p>
            <h1 className="text-[14px] font-semibold text-slate-800 leading-tight mt-0.5">QC 시험 관리 시스템</h1>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Sticky toggle */}
            <button
              onClick={() => setStickyHeader(p => !p)}
              title={stickyHeader ? '헤더 고정 해제' : '헤더 고정'}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${
                stickyHeader
                  ? 'border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100'
                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              {stickyHeader ? <Pin size={11} /> : <PinOff size={11} />}
              <span>헤더 {stickyHeader ? '고정' : '해제'}</span>
            </button>

            <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
              <Bell size={16} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
            </button>

            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 cursor-pointer hover:bg-slate-100 transition-colors">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-blue-600 text-white text-[10px] font-bold">관</AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-slate-700">관리자</span>
              <ChevronDown size={12} className="text-slate-400" />
            </div>
          </div>
        </header>

        {/* ── Scrollable body ──────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col overflow-y-auto">

          {/* ── KPI + Tab header (optionally sticky) ─────────────────────── */}
          <div className={`bg-white border-b border-slate-200 shadow-sm z-10 ${stickyHeader ? 'sticky top-0' : ''}`}>

            {/* Tabs */}
            <div className="flex items-center gap-0 overflow-x-auto px-5 scrollbar-none border-b border-slate-100">
              {sortedTabs.map(tab => {
                const isPinned = pinnedTabs.has(tab)
                const isActive = activeTab === tab
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      group relative flex shrink-0 items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors
                      ${isActive
                        ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-t-full'
                        : 'text-slate-500 hover:text-slate-700'}
                    `}
                  >
                    <span>{tab}</span>
                    {tab === '일탈관리' && (
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">3</span>
                    )}
                    {/* Pin / Star toggle */}
                    <button
                      onClick={e => { e.stopPropagation(); toggleTab(tab) }}
                      title={isPinned ? '즐겨찾기 해제' : '즐겨찾기'}
                      className={`
                        ml-0.5 rounded p-0.5 transition-all
                        ${isPinned
                          ? 'text-amber-400 hover:text-amber-500'
                          : 'text-transparent group-hover:text-slate-300 hover:!text-amber-400'}
                      `}
                    >
                      <Star size={11} fill={isPinned ? 'currentColor' : 'none'} />
                    </button>
                  </button>
                )
              })}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-7 gap-2.5 px-5 py-3">
              {KPI_DATA.map(kpi => (
                <Card
                  key={kpi.label}
                  className={`cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${kpi.bg} border ${kpi.border} shadow-none rounded-xl py-0`}
                >
                  <CardContent className="px-3.5 py-3">
                    <p className="text-[10px] font-medium text-slate-500 mb-0.5">{kpi.label}</p>
                    <div className="flex items-baseline gap-0.5">
                      <span className={`text-[22px] font-bold tabular-nums leading-none ${kpi.accent}`}>{kpi.value}</span>
                      <span className="text-xs font-medium text-slate-400 ml-0.5">{kpi.unit}</span>
                    </div>
                    <p className="mt-1 text-[10px] text-slate-400 leading-none">{kpi.sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* ── Table section ────────────────────────────────────────────── */}
          <div className="flex-1 p-5">
            <Card className="border border-slate-200 shadow-none rounded-xl bg-white py-0 overflow-hidden">

              {/* Toolbar */}
              <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
                {/* Date range */}
                <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
                  <Calendar size={13} className="text-slate-400" />
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                    className="w-[96px] bg-transparent outline-none text-xs tabular-nums"
                  />
                  <span className="text-slate-300">~</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
                    className="w-[96px] bg-transparent outline-none text-xs tabular-nums"
                  />
                </div>

                {/* Search */}
                <div className="flex max-w-[240px] flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <Search size={13} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="제품명, 시험번호, 담당자..."
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>

                <Button size="sm" className="h-7 bg-blue-600 px-4 text-xs font-medium hover:bg-blue-700 rounded-lg shadow-none">
                  조회
                </Button>

                <div className="ml-auto flex items-center gap-1.5">
                  <Button size="sm" variant="outline" className="h-7 gap-1.5 px-3 text-xs text-slate-600 rounded-lg border-slate-200 shadow-none">
                    <Filter size={12} />
                    필터
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 gap-1.5 px-3 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50 rounded-lg shadow-none">
                    <Download size={12} />
                    Excel
                  </Button>
                </div>
              </div>

              {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-slate-100">
                    <TableHead className="w-10 px-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.size === TABLE_DATA.length && TABLE_DATA.length > 0}
                        onChange={toggleAll}
                        className="h-3.5 w-3.5 rounded border-slate-300 accent-blue-600"
                      />
                    </TableHead>
                    {['구분','유형','제품명','시험번호','시험항목','수탁사','담당자','접수일','완료예정일','진행상태'].map(h => (
                      <TableHead key={h} className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide px-3">
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(row => {
                    const status = STATUS_CONFIG[row.status]
                    const isSelected = selectedRows.has(row.id)
                    return (
                      <TableRow
                        key={row.id}
                        data-state={isSelected ? 'selected' : undefined}
                        onClick={() => toggleRow(row.id)}
                        className={`cursor-pointer border-slate-100 text-sm transition-colors ${
                          isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50/70'
                        }`}
                      >
                        <TableCell className="px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleRow(row.id)}
                            onClick={e => e.stopPropagation()}
                            className="h-3.5 w-3.5 rounded border-slate-300 accent-blue-600"
                          />
                        </TableCell>
                        <TableCell className="px-3">
                          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${
                            row.category === '완제품' ? 'bg-slate-100 text-slate-600' : 'bg-sky-50 text-sky-700'
                          }`}>
                            {row.category}
                          </span>
                        </TableCell>
                        <TableCell className="px-3 text-xs text-slate-600">{row.type}</TableCell>
                        <TableCell className="px-3">
                          <span className="text-sm font-medium text-slate-800">{row.product}</span>
                        </TableCell>
                        <TableCell className="px-3">
                          <span className="font-mono text-xs text-slate-500">{row.testNo}</span>
                        </TableCell>
                        <TableCell className="px-3 text-xs text-slate-600">{row.items}</TableCell>
                        <TableCell className="px-3 text-xs text-slate-600">{row.contractor}</TableCell>
                        <TableCell className="px-3">
                          <div className="flex items-center gap-1.5">
                            <Avatar className="h-6 w-6 shrink-0">
                              <AvatarFallback className={`text-[10px] font-bold text-white ${AVATAR_COLORS[row.managerInit] ?? 'bg-slate-400'}`}>
                                {row.managerInit}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-slate-700">{row.manager}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-3 font-mono text-xs text-slate-500">{row.receiveDate}</TableCell>
                        <TableCell className="px-3 font-mono text-xs text-slate-500">{row.dueDate}</TableCell>
                        <TableCell className="px-3">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${status.cls}`}>
                            {status.label}
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5 bg-slate-50/50">
                <p className="text-xs text-slate-500">
                  총 <span className="font-semibold text-slate-700">{filtered.length}</span>건
                  {selectedRows.size > 0 && (
                    <span className="ml-2 text-blue-600">
                      · <span className="font-semibold">{selectedRows.size}</span>건 선택됨
                    </span>
                  )}
                </p>
                <span className="text-xs text-slate-400">1 / 1 페이지</span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* ── Floating Chatbot ───────────────────────────────────────────────── */}
      <Chatbot />
    </div>
  )
}
