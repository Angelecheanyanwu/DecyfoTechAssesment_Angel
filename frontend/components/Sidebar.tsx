'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  Stethoscope,
  Receipt,
  FileText,
  Boxes,
  BarChart3,
  MessagesSquare,
  Activity,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Patients', icon: Users },
  { label: 'Appointments', icon: CalendarClock },
  { label: 'Clinical Operations', icon: Stethoscope },
  { label: 'Billing & Revenue', icon: Receipt },
  { label: 'MR & Docs', icon: FileText },
  { label: 'Inventory & Supplies', icon: Boxes },
  { label: 'Reports & Analytics', icon: BarChart3 },
  { label: 'Communications', icon: MessagesSquare },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden shrink-0 flex-col border-r border-border bg-white/60 py-6 transition-all duration-200 md:flex ${
        collapsed ? 'w-16 px-2' : 'w-64 px-4'
      }`}
    >
      <div className={`mb-8 flex items-center px-2 ${collapsed ? 'justify-center' : 'gap-2'}`}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-dark text-white">
          <Activity size={16} />
        </div>
        {!collapsed && <span className="text-sm font-semibold text-body">Clinic Monitor</span>}
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
          <div
            key={label}
            aria-current={active ? 'page' : undefined}
            title={collapsed ? label : undefined}
            className={`flex items-center rounded-lg px-3 py-2 text-sm ${collapsed ? 'justify-center' : 'gap-3'} ${
              active
                ? 'bg-primary-dark/10 font-medium text-primary-dark'
                : 'cursor-not-allowed text-subtle'
            }`}
          >
            <Icon size={16} />
            {!collapsed && label}
          </div>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className={`mt-auto flex items-center rounded-lg px-3 py-2 text-sm text-subtle transition hover:bg-primary-dark/5 hover:text-body ${
          collapsed ? 'justify-center' : 'gap-2'
        }`}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        {!collapsed && 'Collapse'}
      </button>
    </aside>
  );
}
