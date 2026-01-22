interface CalloutBoxProps {
  title?: string;
  children: React.ReactNode;
  variant?: "default" | "highlight";
}

export function CalloutBox({ title, children, variant = "default" }: CalloutBoxProps) {
  if (variant === "highlight") {
    return (
      <div className="p-8 rounded-xl border-2 border-[#2563EB]/30 bg-gradient-to-br from-card to-[#2563EB]/5 shadow-lg">
        <div className="space-y-3">
          {title && (
            <h3 className="text-xl font-semibold text-[#2563EB]">{title}</h3>
          )}
          <div className="text-muted-foreground leading-relaxed">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="space-y-2">
        {title && (
          <h3 className="text-lg font-semibold">{title}</h3>
        )}
        <div className="text-muted-foreground leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

