
export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M0 0H8V40H0V0Z" fill="hsl(var(--primary))"/>
        <path d="M16 0H24V8H16V0Z" fill="hsl(var(--primary))" fillOpacity="0.75"/>
        <path d="M16 16H24V24H16V16Z" fill="hsl(var(--primary))" fillOpacity="0.75"/>
        <path d="M32 0H40V40H32V0Z" fill="hsl(var(--primary))"/>
    </svg>
);
