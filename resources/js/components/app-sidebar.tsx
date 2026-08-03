import { Link, usePage } from '@inertiajs/react';
import { Archive, ArrowRightLeft, FileText, FolderGit2, LayoutGrid, Package, Scale, ShoppingCart, Tags, Truck, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dasbor',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Manajemen Pengguna',
        href: '/users',
        icon: Users,
        roles: ['MANAGEMENT', 'ADMIN'],
    },
    {
        title: 'Kategori',
        href: '/categories',
        icon: Tags,
        roles: ['MANAGEMENT', 'STAFF'],
    },
    {
        title: 'Satuan',
        href: '/units',
        icon: Scale, 
        roles: ['MANAGEMENT', 'STAFF'],
    },
    {
        title: 'Supplier',
        href: '/suppliers',
        icon: Truck,
        roles: ['MANAGEMENT', 'STAFF'],
    },
    {
        title: 'Produk',
        href: '/products',
        icon: Package,
        roles: ['MANAGEMENT', 'STAFF'],
    },
    {
        title: 'Barang Masuk',
        href: '/incoming-products',
        icon: ArrowRightLeft,
        roles: ['MANAGEMENT', 'STAFF'],
    },
    {
        title: 'Stok & Kedaluwarsa',
        href: '/batch-stocks',
        icon: Archive,
        roles: ['MANAGEMENT', 'STAFF'],
    },
    {
        title: 'Kasir / Penjualan',
        href: '/sales',
        icon: ShoppingCart,
        roles: ['MANAGEMENT', 'STAFF'],
    },
    {
        title: 'Laporan',
        href: '/reports',
        icon: FileText,
        roles: ['MANAGEMENT', 'ADMIN', 'STAFF'],
    }
];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: FolderGit2,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    const { auth, expiringStockCount } = usePage().props as any;
    const user = auth?.user;
    const userRole = user?.roles?.[0]?.name?.toUpperCase() || 'GUEST';

    const visibleMainNavItems = mainNavItems.map(item => {
        if (item.title === 'Stok & Kedaluwarsa') {
            return { ...item, badge: expiringStockCount };
        }
        return item;
    }).filter((item) => {
        if (!item.roles || item.roles.length === 0) return true;
        return item.roles.includes(userRole);
    });

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={visibleMainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
