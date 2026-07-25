import { useState, Fragment } from 'react';
import { Head } from '@inertiajs/react';
import type { BatchStock, BatchStocksIndexProps } from '@/types';
import { AlertCircle, CheckCircle2, AlertTriangle, Clock, Info, ChevronDown, ChevronRight, Layers, Box } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Pagination } from '@/components/pagination';

export default function BatchStocksIndex({ batchStocks }: BatchStocksIndexProps) {
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
        return `${diffDays} Hari Lagi`;
    };

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'Aman':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 ring-1 ring-inset ring-emerald-500/20 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Aman
                    </span>
                );
            case 'Peringatan':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 ring-1 ring-inset ring-amber-500/20 dark:text-amber-400">
                        <Clock className="w-3.5 h-3.5" /> Peringatan
                    </span>
                );
            case 'Hampir Expired':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-600 ring-1 ring-inset ring-orange-500/20 dark:text-orange-400">
                        <AlertTriangle className="w-3.5 h-3.5" /> Hampir Expired
                    </span>
                );
            case 'Expired':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 ring-1 ring-inset ring-rose-500/20 dark:text-rose-400 animate-pulse">
                        <AlertCircle className="w-3.5 h-3.5" /> Expired
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-500/10 px-2.5 py-1 text-xs font-semibold text-gray-600 ring-1 ring-inset ring-gray-500/20">
                        -
                    </span>
                );
        }
    };

    return (
        <>
            <Head title="Stok & Expired" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm text-card-foreground shadow-sm overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4 border-b border-border/50 bg-gradient-to-r from-card to-muted/20">
                        <div className="flex flex-col gap-1.5">
                            <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                                <Box className="w-5 h-5 text-primary" />
                                Monitoring Stok & Kedaluwarsa
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Pantau sisa stok produk per batch dan kelola status kedaluwarsanya dengan mudah.
                            </p>
                        </div>
                    </div>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="bg-muted/50 border-b border-border/50">
                                <tr className="[&>th]:font-semibold [&>th]:text-muted-foreground [&>th]:h-11">
                                    <th className="px-6 text-left align-middle whitespace-nowrap">
                                        <div className="flex items-center gap-1.5">
                                            Status Expired
                                            <TooltipProvider delayDuration={100}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Info className="w-4 h-4 cursor-help text-muted-foreground hover:text-foreground transition-colors" />
                                                    </TooltipTrigger>
                                                    <TooltipContent className="max-w-[320px] leading-relaxed p-4 shadow-lg border-border/50 bg-card/95 backdrop-blur-md">
                                                        <p className="font-semibold mb-3 border-b pb-2">Indikator Warna:</p>
                                                        <ul className="space-y-2.5">
                                                            <li className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> <span className="text-emerald-500 font-medium">Aman:</span> &gt; 30 Hari</li>
                                                            <li className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /> <span className="text-amber-500 font-medium">Peringatan:</span> 15 - 30 Hari</li>
                                                            <li className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-orange-500" /> <span className="text-orange-500 font-medium">Hampir Expired:</span> 8 - 14 Hari</li>
                                                            <li className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-rose-500" /> <span className="text-rose-500 font-medium">Expired:</span> &lt; 7 Hari / Terlewat</li>
                                                        </ul>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </th>
                                    <th className="px-4 text-left align-middle whitespace-nowrap">Sisa Waktu</th>
                                    <th className="px-4 text-left align-middle whitespace-nowrap">Produk</th>
                                    <th className="px-4 text-left align-middle whitespace-nowrap">Supplier</th>
                                    <th className="px-4 text-left align-middle whitespace-nowrap">No. Batch</th>
                                    <th className="px-4 text-right align-middle whitespace-nowrap">Kuantitas Awal</th>
                                    <th className="px-6 text-right align-middle whitespace-nowrap">Sisa Kuantitas</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {(() => {
                                    const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});
                                    
                                    const toggleGroup = (productId: number) => {
                                        setExpandedGroups(prev => ({ ...prev, [productId]: !prev[productId] }));
                                    };

                                    const groupedBatchStocks = Object.values(
                                        batchStocks.data.reduce((acc, item) => {
                                            const key = item.product_id;
                                            if (!acc[key]) acc[key] = [];
                                            acc[key].push(item);
                                            return acc;
                                        }, {} as Record<number, BatchStock[]>)
                                    );

                                    if (groupedBatchStocks.length === 0) {
                                        return (
                                            <tr>
                                                <td colSpan={7} className="h-32 text-center text-muted-foreground">
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                        <Box className="w-8 h-8 opacity-20" />
                                                        <p>Belum ada data stok per batch.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }

                                    return groupedBatchStocks.map((group) => {
                                        const isMultiple = group.length > 1;
                                        const firstItem = group[0];
                                        const isExpanded = expandedGroups[firstItem.product_id];
                                        
                                        const totalRemaining = group.reduce((sum, item) => sum + parseFloat(item.remaining_quantity.toString()), 0);
                                        const totalInitial = group.reduce((sum, item) => sum + parseFloat(item.initial_quantity.toString()), 0);
                                        const uniqueSuppliers = Array.from(new Set(group.map(item => item.incoming_product?.supplier?.supplier_name || '-')));
                                        const supplierText = uniqueSuppliers.length > 1 ? 'Berbagai Supplier' : uniqueSuppliers[0];
                                        
                                        return (
                                            <Fragment key={`group-${firstItem.product_id}`}>
                                                <tr 
                                                    className={`border-b border-border/40 transition-all duration-200 ${
                                                        isMultiple ? 'cursor-pointer hover:bg-muted/60' : 'hover:bg-muted/40'
                                                    } ${isExpanded ? 'bg-primary/[0.03] shadow-[inset_4px_0_0_0_hsl(var(--primary))] border-l-transparent' : ''}`}
                                                    onClick={isMultiple ? () => toggleGroup(firstItem.product_id) : undefined}
                                                >
                                                    <td className="p-4 px-6 align-middle whitespace-nowrap">
                                                        {getStatusBadge(firstItem.expired_status)}
                                                    </td>
                                                    <td className="p-4 px-4 align-middle whitespace-nowrap font-medium text-muted-foreground">
                                                        {getRemainingDays(firstItem.expired_date)}
                                                    </td>
                                                    <td className="p-4 px-4 align-middle whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            {isMultiple && (
                                                                <div className={`p-1 rounded-md transition-colors ${isExpanded ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                                                                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                                                </div>
                                                            )}
                                                            <span className={`font-semibold ${isExpanded ? 'text-primary' : 'text-foreground'}`}>{firstItem.product?.product_name || '-'}</span>
                                                            {isMultiple && (
                                                                <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                                                                    <Layers className="w-3 h-3" /> {group.length} Batch
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 px-4 align-middle whitespace-nowrap text-muted-foreground">
                                                        {isMultiple ? (
                                                            <span className="italic opacity-80">{supplierText}</span>
                                                        ) : (
                                                            firstItem.incoming_product?.supplier?.supplier_name || '-'
                                                        )}
                                                    </td>
                                                    <td className="p-4 px-4 align-middle whitespace-nowrap text-muted-foreground">
                                                        {isMultiple ? '-' : (
                                                            <span className="font-mono text-xs bg-muted px-2 py-1 rounded-md">{firstItem.batch_no}</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 px-4 align-middle whitespace-nowrap text-right text-muted-foreground">
                                                        {totalInitial.toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="p-4 px-6 align-middle whitespace-nowrap text-right">
                                                        <span className="font-bold text-primary text-base">
                                                            {totalRemaining.toLocaleString('id-ID')}
                                                        </span>
                                                    </td>
                                                </tr>
                                                
                                                {/* Child Rows for Multiple Batches */}
                                                {isMultiple && isExpanded && group.map((item, idx) => {
                                                    const isLast = idx === group.length - 1;
                                                    return (
                                                        <tr key={item.id} className={`border-b border-border/20 bg-primary/[0.015] transition-colors hover:bg-primary/[0.03] ${isLast ? 'shadow-[inset_0_-1px_0_0_border/30]' : ''}`}>
                                                            <td className="p-3 pl-8 align-middle whitespace-nowrap shadow-[inset_4px_0_0_0_hsl(var(--primary))] border-l-transparent">
                                                                {getStatusBadge(item.expired_status)}
                                                            </td>
                                                            <td className="p-3 px-4 align-middle whitespace-nowrap text-sm text-muted-foreground">
                                                                {getRemainingDays(item.expired_date)}
                                                            </td>
                                                            <td className="p-3 px-4 align-middle whitespace-nowrap text-sm text-muted-foreground flex items-center gap-3">
                                                                <div className="w-3 h-px bg-primary/30"></div>
                                                                <span className="opacity-80 font-medium">{item.product?.product_name || '-'}</span>
                                                            </td>
                                                            <td className="p-3 px-4 align-middle whitespace-nowrap text-sm text-muted-foreground">
                                                                {item.incoming_product?.supplier?.supplier_name || '-'}
                                                            </td>
                                                            <td className="p-3 px-4 align-middle whitespace-nowrap text-sm">
                                                                <span className="font-mono text-xs bg-background shadow-sm border border-border/50 px-2 py-1 rounded-md">
                                                                    {item.batch_no}
                                                                </span>
                                                            </td>
                                                            <td className="p-3 px-4 align-middle whitespace-nowrap text-right text-sm text-muted-foreground">
                                                                {parseFloat(item.initial_quantity.toString()).toLocaleString('id-ID')}
                                                            </td>
                                                            <td className="p-3 px-6 align-middle whitespace-nowrap text-right text-sm">
                                                                <span className="font-semibold text-primary/80">
                                                                    {parseFloat(item.remaining_quantity.toString()).toLocaleString('id-ID')}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </Fragment>
                                        );
                                    });
                                })()}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-border/50 bg-muted/10">
                        <Pagination links={batchStocks.links} />
                    </div>
                </div>
            </div>
        </>
    );
}

BatchStocksIndex.layout = {
    breadcrumbs: [
        {
            title: 'Stok & Expired',
            href: '/batch-stocks',
        },
    ],
};
