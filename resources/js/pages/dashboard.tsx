import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Package, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import type { Product, BatchStock, IncomingProduct } from '@/types';

interface DashboardProps {
    metrics: {
        totalProducts: number;
        lowStockCount: number;
        expiringCount: number;
    };
    lowStockTop: Product[];
    expiringTop: BatchStock[];
    recentIncoming: IncomingProduct[];
}

export default function Dashboard({ metrics, lowStockTop, expiringTop, recentIncoming }: DashboardProps) {
    const formatNumber = (val: string | number) => {
        return parseFloat(String(val)).toLocaleString('id-ID');
    };

    const getRemainingDays = (expiredDateStr: string | null) => {
        if (!expiredDateStr) return '-';
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expired = new Date(expiredDateStr);
        expired.setHours(0, 0, 0, 0);
        
        const diffTime = expired.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'Sudah Expired';
        if (diffDays === 0) return 'Hari ini';
        return `${diffDays} hari lagi`;
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6 bg-slate-50/50 dark:bg-transparent">
                <div className="grid auto-rows-min gap-6 md:grid-cols-3">
                    {/* Card 1: Total Produk */}
                    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Produk Aktif</p>
                                <h3 className="text-2xl font-bold tracking-tight">{formatNumber(metrics.totalProducts)}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Low Stock */}
                    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                                <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Stok Menipis</p>
                                <h3 className="text-2xl font-bold tracking-tight text-orange-600 dark:text-orange-400">
                                    {formatNumber(metrics.lowStockCount)} <span className="text-sm font-normal text-muted-foreground">produk</span>
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Expiring Soon */}
                    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                                <Clock className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Mendekati Kedaluwarsa</p>
                                <h3 className="text-2xl font-bold tracking-tight text-red-600 dark:text-red-400">
                                    {formatNumber(metrics.expiringCount)} <span className="text-sm font-normal text-muted-foreground">batch</span>
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Low Stock Table */}
                    <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col">
                        <div className="border-b border-border p-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-orange-500" /> 
                                Top 5 Produk Stok Menipis
                            </h3>
                        </div>
                        <div className="p-0 overflow-auto flex-1">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Produk</th>
                                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Sisa Stok</th>
                                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Batas Min.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lowStockTop.map(product => (
                                        <tr key={product.id} className="border-b last:border-0 hover:bg-muted/20">
                                            <td className="px-4 py-3 font-medium">{product.product_name}</td>
                                            <td className="px-4 py-3 text-right font-bold text-orange-600">{formatNumber((product as any).total_stock || 0)}</td>
                                            <td className="px-4 py-3 text-right text-muted-foreground">{formatNumber(product.min_stock)}</td>
                                        </tr>
                                    ))}
                                    {lowStockTop.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">Stok semua produk dalam keadaan aman.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Expiring Batches Table */}
                    <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col">
                        <div className="border-b border-border p-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Clock className="h-5 w-5 text-red-500" /> 
                                Top 5 Batch Mendekati Kedaluwarsa
                            </h3>
                        </div>
                        <div className="p-0 overflow-auto flex-1">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Produk</th>
                                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Batch</th>
                                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">Sisa Waktu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expiringTop.map(batch => (
                                        <tr key={batch.id} className="border-b last:border-0 hover:bg-muted/20">
                                            <td className="px-4 py-3 font-medium">{batch.product?.product_name}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{batch.batch_no}</td>
                                            <td className="px-4 py-3 text-right font-bold text-red-600">
                                                {getRemainingDays(batch.expired_date)}
                                            </td>
                                        </tr>
                                    ))}
                                    {expiringTop.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">Tidak ada batch yang mendekati kedaluwarsa.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Recent Incoming Table */}
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border p-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-500" /> 
                            Barang Masuk Terbaru
                        </h3>
                    </div>
                    <div className="p-0 overflow-auto flex-1">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tanggal</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Invoice</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Produk</th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Supplier</th>
                                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">Kuantitas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentIncoming.map(incoming => (
                                    <tr key={incoming.id} className="border-b last:border-0 hover:bg-muted/20">
                                        <td className="px-4 py-3">
                                            {new Date(incoming.created_at || incoming.incoming_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-4 py-3 font-medium">{incoming.invoice_number}</td>
                                        <td className="px-4 py-3">{incoming.product?.product_name}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{incoming.supplier?.supplier_name}</td>
                                        <td className="px-4 py-3 text-right font-bold text-green-600">
                                            +{formatNumber(incoming.quantity)}
                                        </td>
                                    </tr>
                                ))}
                                {recentIncoming.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Belum ada riwayat transaksi barang masuk.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
