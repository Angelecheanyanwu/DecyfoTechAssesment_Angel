import { BedDouble, Clock, UserRound } from 'lucide-react';

const ROWS = [
  { label: 'Rooms occupied', value: '8 / 12', icon: BedDouble },
  { label: 'Avg. wait time', value: '14 min', icon: Clock },
  { label: 'Staff on duty', value: '6', icon: UserRound },
];

export default function WardOverview() {
  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <p className="mb-3 text-sm font-medium text-body">Ward overview</p>
      <div className="flex flex-col gap-3">
        {ROWS.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-muted">
              <Icon size={14} />
              {label}
            </span>
            <span className="text-sm font-semibold text-body">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
