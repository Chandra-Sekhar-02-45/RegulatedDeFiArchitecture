import { SectionCard } from "./SectionCard";

type Props = {
  onSwitch: () => Promise<void>;
};

export function NetworkWarning({ onSwitch }: Props) {
  return (
    <SectionCard
      title="Network mismatch"
      subtitle="Switch to the required compliance network"
      action={
        <button className="primary" onClick={onSwitch}>
          Switch network
        </button>
      }
    >
      <p className="text-sm text-[var(--text-muted)]">
        You are connected to the wrong chain. Please switch to the configured chain to access hybrid
        banking features.
      </p>
    </SectionCard>
  );
}
