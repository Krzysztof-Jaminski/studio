
export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'hsl(var(--accent))' }} />
                <stop offset="100%" style={{ stopColor: 'hsl(var(--primary))' }} />
            </linearGradient>
        </defs>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.415 0.00195312C28.523 0.00195312 37.388 8.86695 37.388 19.975C37.388 31.083 28.523 39.948 17.415 39.948H5V0.00195312H17.415ZM17.415 8.65195H13.65V31.298H17.415C23.865 31.298 28.738 26.425 28.738 19.975C28.738 13.525 23.865 8.65195 17.415 8.65195Z"
            fill="url(#logo-gradient)"
        />
    </svg>
);
