
export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <div {...props} className="flex items-center justify-center space-x-1 font-bold text-2xl font-headline">
        <div className="flex items-center justify-center h-full w-full rounded-md bg-gradient-to-br from-blue-500 to-purple-600 text-white p-1">
            <span className="font-black">PH</span>
        </div>
    </div>
);
