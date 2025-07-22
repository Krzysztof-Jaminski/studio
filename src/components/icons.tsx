export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <div {...props} className="flex items-center space-x-1 font-bold text-2xl font-headline">
        <span style={{ color: 'hsl(var(--primary))' }}>P</span>
        <span style={{ color: 'hsl(var(--color-food))' }}>H</span>
    </div>
);
