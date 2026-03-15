interface StatsCardProps {
  label: string
  value: number
  accentClass: string
}

const StatsCard = ({ label, value, accentClass }: StatsCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`absolute inset-x-0 top-0 h-1 ${accentClass} opacity-75`}
      />
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-800">
            {value}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsCard

