
export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M5 0V40H12.5V22.5H27.5V40H35V0H27.5V17.5H12.5V0H5Z"
            fill="hsl(var(--primary))"
        />
    </svg>
);
