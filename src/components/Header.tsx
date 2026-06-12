import { Menu, RefreshCw, Search } from "lucide-react";
import { LauncherButton } from "./LauncherButton";

type Props = {
  title: string;
  subtitle: string;
  query: string;
  showSearch?: boolean;
  checking: boolean;
  onQueryChange: (value: string) => void;
  onCheckUpdates: () => void;
  onOpenMenu: () => void;
};

export function Header({
  title,
  subtitle,
  query,
  showSearch = true,
  checking,
  onQueryChange,
  onCheckUpdates,
  onOpenMenu
}: Props) {
  return (
    <header className="mb-10 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <button
          className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 lg:hidden"
          onClick={onOpenMenu}
          aria-label="Navigation öffnen"
        >
          <Menu size={19} />
        </button>
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.045em] text-white md:text-[38px]">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/46 md:text-[15px]">{subtitle}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {showSearch ? (
          <label className="flex h-10 min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 text-white/35 sm:w-64">
            <Search size={16} />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/28"
              placeholder="Apps durchsuchen"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
            />
          </label>
        ) : null}
        <LauncherButton
          variant="secondary"
          icon={<RefreshCw size={16} className={checking ? "animate-spin" : ""} />}
          onClick={onCheckUpdates}
          disabled={checking}
        >
          {checking ? "Wird geprüft" : "Nach Updates suchen"}
        </LauncherButton>
      </div>
    </header>
  );
}
