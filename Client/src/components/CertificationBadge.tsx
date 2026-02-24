type Props = {
  certified: boolean | null;
  loading?: boolean;
};

export function CertificationBadge({ certified, loading }: Props) {
  const label = loading
    ? "Checking..."
    : certified === true
      ? "Verified"
      : certified === false
        ? "Not Verified"
        : "Unknown";

  const color = loading
    ? "#eab308"
    : certified
      ? "#22c55e"
      : "#f97316";

  return (
    <span className="badge" aria-live="polite">
      <span className="badge-dot" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </span>
  );
}
