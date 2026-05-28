import type { ReactNode } from "react";

type PageShellProps = {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function PageShell({ title, description, actions, children }: PageShellProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-normal text-foreground">{title}</h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}
