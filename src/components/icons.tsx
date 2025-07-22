
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
            d="M5 0V40H15V25H25V40H35V0H25V15H15V0H5Z"
            fill="hsl(var(--primary))"
        />
    </svg>
);
