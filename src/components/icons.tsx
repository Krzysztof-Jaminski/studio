
export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="40" height="32" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="8" height="8" y="0" fill="hsl(var(--primary))" />
        <rect width="8" height="8" y="8" fill="hsl(var(--primary))" opacity="0.75" />
        <rect width="8" height="8" y="16" fill="hsl(var(--primary))" opacity="0.5" />
        <rect width="8" height="8" y="24" fill="hsl(var(--primary))" opacity="0.25" />

        <rect width="8" height="8" x="8" y="16" fill="hsl(var(--primary))" opacity="0.5" />
        <rect width="8" height="8" x="16" y="8" fill="hsl(var(--primary))" opacity="0.75" />
        <rect width="8" height="8" x="16" y="16" fill="hsl(var(--primary))" opacity="0.5" />

        <rect width="8" height="8" x="24" y="16" fill="hsl(var(--primary))" opacity="0.5" />
        <rect width="8" height="8" x="32" y="24" fill="hsl(var(--primary))" opacity="0.25" />
        <rect width="8" height="8" x="32" y="16" fill="hsl(var(--primary))" opacity="0.5" />
        <rect width="8" height="8" x="32" y="8" fill="hsl(var(--primary))" opacity="0.75" />
        <rect width="8" height="8" x="32" y="0" fill="hsl(var(--primary))" />
    </svg>
);
