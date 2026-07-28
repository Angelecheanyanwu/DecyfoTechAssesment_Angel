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
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-white/60 px-4 py-6 md:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-dark text-white">
          <Activity size={16} />
        </div>
        <span className="text-sm font-semibold text-body">Clinic Monitor</span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
          <div
            key={label}
            aria-current={active ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
              active
                ? 'bg-primary-dark/10 font-medium text-primary-dark'
                : 'cursor-not-allowed text-subtle'
            }`}
          >
            <Icon size={16} />
            {label}
          </div>
        ))}
      </nav>
    </aside>
  );
}
