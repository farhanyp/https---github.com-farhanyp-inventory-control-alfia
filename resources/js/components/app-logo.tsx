import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name, appSettings } = usePage<any>().props;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground overflow-hidden">
                {appSettings?.logo ? (
                    <img 
                        src={`/storage/${appSettings.logo}`} 
                        alt={name} 
                        className="w-full h-full object-contain" 
                    />
                ) : (
                    <AppLogoIcon className="size-5" />
                )}
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {name}
                </span>
            </div>
        </>
    );
}
