import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name, appSettings } = usePage<any>().props;
    const logoSrc = appSettings?.logo ? `/storage/${appSettings.logo}` : '/favicon.ico';

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md text-sidebar-primary-foreground overflow-hidden">
                <img 
                    src={logoSrc} 
                    alt={name} 
                    className="w-full h-full object-contain" 
                    onError={(e) => {
                        e.currentTarget.src = '/favicon.ico';
                    }}
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {name}
                </span>
            </div>
        </>
    );
}
