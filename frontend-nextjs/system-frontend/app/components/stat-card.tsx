type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: string;
};

export default function StatCard({ label, value, detail, icon }: StatCardProps) {
  return (
    <article className="min-w-0 rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:shadow-soft sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-muted">{label}</p>
        <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent/45 text-lg font-bold text-primary">
          {icon}
        </span>
      </div>
      <p className="mt-4 break-words text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs leading-5 text-muted">{detail}</p>
    </article>
  );
}
