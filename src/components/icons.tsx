
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
            d="M17.5 0H5V40H17.5C28.8381 40 38 31.0457 38 20C38 8.9543 28.8381 0 17.5 0Z"
            transform="matrix(-1 0 0 1 20 0)"
            fill="url(#logo-gradient)"
        />
        <path 
            d="M17.5 0H5V40H17.5C28.8381 40 38 31.0457 38 20C38 8.9543 28.8381 0 17.5 0Z"
            transform="translate(20, 0)"
            fill="url(#logo-gradient)"
        />
    </svg>
);
