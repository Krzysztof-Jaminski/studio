
export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g transform="rotate(-90 20 20)">
            <path d="M40 8V32H32V8H40Z" fill="hsl(var(--primary))"/>
            <path d="M32 0V40H24V0H32Z" fill="hsl(var(--primary))"/>
            <path d="M8 8V32H0V8H8Z" fill="hsl(var(--primary))"/>
        </g>
        <path d="M16 0H24V16H16V0Z" fill="hsl(var(--accent))"/>
        <path d="M16 16H8V24H16V16Z" fill="hsl(var(--accent))"/>
        <path d="M16 24V40H8V24H16Z" fill="hsl(var(--accent))" fillOpacity="0.7"/>
    </svg>
);
