type SectionCardProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export function SectionCard({ title, subtitle, action, children }: SectionCardProps) {
  return (
    <section className="card w-full">
      <header className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {subtitle ? <p className="text-sm text-[var(--text-muted)]">{subtitle}</p> : null}
        </div>
        {action}
      </header>
      <div>{children}</div>
    </section>
  );
}
