import { CheckCircle2 } from "lucide-react";

type Props = {
  installedCount: number;
  updateCount: number;
  lastChecked: string;
};

export function SystemStatus({ installedCount, updateCount, lastChecked }: Props) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
      <div className="flex items-center gap-2 text-xs font-medium text-white/70"><CheckCircle2 size={14} />Launcher bereit</div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-white/35">
        <span>Installiert</span><span className="text-right text-white/65">{installedCount}</span>
        <span>Updates</span><span className="text-right text-white/65">{updateCount}</span>
        <span>Geprüft</span><span className="truncate text-right text-white/65">{lastChecked}</span>
      </div>
    </div>
  );
}
