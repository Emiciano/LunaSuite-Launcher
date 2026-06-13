import { Menu, RefreshCw, Search } from "lucide-react";
import { LauncherButton } from "./LauncherButton";

type Props = {
  title: string;
  subtitle: string;
  query: string;
  showSearch?: boolean;
  showUpdateButton?: boolean;
  hideCopy?: boolean;
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
  showUpdateButton = false,
  hideCopy = false,
  checking,
  onQueryChange,
  onCheckUpdates,
  onOpenMenu
}: Props) {
  return (
    <header className={`mb-8 flex flex-col gap-6 ${hideCopy ? "items-center" : "xl:flex-row xl:items-start xl:justify-between"}`}>
      <div className={`min-w-0 items-start gap-3 ${hideCopy ? "absolute left-5 top-6 flex lg:hidden" : "flex"}`}>
        <button
          className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 lg:hidden"
          onClick={onOpenMenu}
          aria-label="Navigation öffnen"
        >
          <Menu size={19} />
        </button>
        {!hideCopy ? <div>
          <h1 className="text-3xl font-semibold tracking-[-0.045em] text-white md:text-[38px]">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/46 md:text-[15px]">{subtitle}</p>
        </div> : null}
      </div>

      <div className={`flex flex-col gap-3 sm:flex-row ${hideCopy ? "w-full justify-center" : ""}`}>
        {showSearch ? (
          <label className={`flex h-10 min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 text-white/35 transition-colors duration-200 focus-within:border-white/20 focus-within:bg-white/[0.05] ${hideCopy ? "w-full max-w-[470px]" : "sm:w-64"}`}>
            <Search size={16} />
            <input
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/28"
              placeholder="Apps durchsuchen"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
            />
          </label>
        ) : null}
        {showUpdateButton ? (
          <LauncherButton
            variant="secondary"
            icon={<RefreshCw size={16} className={checking ? "animate-spin" : ""} />}
            onClick={onCheckUpdates}
            disabled={checking}
          >
            {checking ? "Wird geprüft" : "Nach Updates suchen"}
          </LauncherButton>
        ) : null}
      </div>
    </header>
  );
}
