import { useState, Fragment } from 'react';
import { Head } from '@inertiajs/react';
import type { BatchStock, BatchStocksIndexProps } from '@/types';
import { AlertCircle, CheckCircle2, AlertTriangle, Clock, Info, ChevronDown, ChevronUp, Layers, Box } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Pagination } from '@/components/pagination';
import { getRemainingDays, formatNumber } from '@/lib/utils';

export default function BatchStocksIndex({ batchStocks }: BatchStocksIndexProps) {
    const getStatusBadge = (status?: string) => {
        const renderBadge = (icon: React.ReactNode, text: string, colorClass: string, pulse = false) => (
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 sm:px-2.5 sm:py-1 text-xs font-semibold ring-1 ring-inset cursor-help ${colorClass} ${pulse ? 'animate-pulse' : ''}`}>
                            {icon}
                            <span className="hidden sm:inline">{text}</span>
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{text}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );

        switch (status) {
            case 'Aman':
                return renderBadge(<CheckCircle2 className="w-3.5 h-3.5" />, 'Aman', 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400');
            case 'Peringatan':
                return renderBadge(<Clock className="w-3.5 h-3.5" />, 'Peringatan', 'bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400');
            case 'Hampir Expired':
                return renderBadge(<AlertTriangle className="w-3.5 h-3.5" />, 'Hampir Kedaluwarsa', 'bg-orange-500/10 text-orange-600 ring-orange-500/20 dark:text-orange-400');
            case 'Expired':
                return renderBadge(<AlertCircle className="w-3.5 h-3.5" />, 'Kedaluwarsa', 'bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:text-rose-400', true);
            default:
                return renderBadge(<span className="w-3.5 h-3.5 inline-block text-center leading-none">-</span>, '-', 'bg-gray-500/10 text-gray-600 ring-gray-500/20');
        }
    };

    return (
        <>
            <Head title="Stok & Kedaluwarsa" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm text-card-foreground shadow-sm overflow-hidden flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 md:p-6 gap-4 border-b border-border/50 bg-gradient-to-r from-card to-muted/20">
                        <div className="flex flex-col gap-1.5">
                            <h3 className="text-lg md:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                                <Box className="w-5 h-5 text-primary" />
                                Monitoring Stok & Kedaluwarsa
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Pantau sisa stok produk per batch dan kelola status kedaluwarsanya dengan mudah.
                            </p>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <button type="button" className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 hover:bg-muted/80 transition-colors px-3 py-1.5 rounded-md border border-border/50 cursor-pointer">
                                    <Info className="w-4 h-4" />
                                    <span>Status Warna</span>
                                    <div className="w-4 h-4 rounded-full border border-muted-foreground/30 flex items-center justify-center ml-1">
                                        <span className="text-[10px] font-bold">?</span>
                                    </div>
                                </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[90vw] sm:max-w-[400px]">
                                <DialogHeader>
                                    <DialogTitle>Indikator Warna</DialogTitle>
                                    <DialogDescription>
                                        Berikut adalah penjelasan status kedaluwarsa berdasarkan sisa hari:
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="p-2">
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-emerald-500" /> <span className="text-emerald-500 font-medium">Aman:</span> &gt; 30 Hari</li>
                                        <li className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-amber-500" /> <span className="text-amber-500 font-medium">Peringatan:</span> 15 - 30 Hari</li>
                                        <li className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-orange-500" /> <span className="text-orange-500 font-medium">Hampir Kedaluwarsa:</span> 8 - 14 Hari</li>
                                        <li className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-rose-500" /> <span className="text-rose-500 font-medium">Kedaluwarsa:</span> &lt; 7 Hari / Terlewat</li>
                                    </ul>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    
                    <div className="flex flex-col gap-4 p-4 md:p-6 overflow-y-auto">
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
                                    <div className="h-32 flex flex-col items-center justify-center gap-2 text-muted-foreground border border-dashed border-border/60 rounded-xl">
                                        <Box className="w-8 h-8 opacity-20" />
                                        <p>Belum ada data stok per batch.</p>
                                    </div>
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
                                    <div key={`group-${firstItem.product_id}`} className={`flex flex-col rounded-xl border transition-all duration-200 ${isExpanded ? 'border-primary/50 shadow-md ring-1 ring-primary/20' : 'border-border/60 bg-card shadow-sm hover:shadow-md'}`}>
                                        <div 
                                            className={`p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center ${isMultiple ? 'cursor-pointer hover:bg-muted/30' : ''}`}
                                            onClick={isMultiple ? () => toggleGroup(firstItem.product_id) : undefined}
                                        >
                                            <div className="flex flex-col gap-2 w-full sm:w-auto flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {getStatusBadge(firstItem.expired_status)}
                                                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border/50">
                                                        {getRemainingDays(firstItem.expired_date)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="font-semibold text-base md:text-lg text-foreground">{firstItem.product?.product_name || '-'}</span>
                                                    {isMultiple && (
                                                        <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider border border-primary/20">
                                                            <Layers className="w-3 h-3" /> {group.length} Batch
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Supplier: {isMultiple ? <span className="italic opacity-80">{supplierText}</span> : <span className="font-medium">{supplierText}</span>}
                                                    {!isMultiple && (
                                                        <>
                                                            <span className="mx-2 opacity-50">•</span>
                                                            Batch: <span className="font-mono bg-muted/60 px-1.5 py-0.5 rounded text-xs border border-border/50 text-foreground">{firstItem.batch_no}</span>
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                            
                                            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-border/30 sm:border-t-0">
                                                <div className="flex flex-col sm:items-end">
                                                    <p className="text-xs text-muted-foreground mb-0.5">Kuantitas Awal</p>
                                                    <p className="text-sm font-medium">{formatNumber(totalInitial)}</p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <p className="text-xs text-muted-foreground mb-0.5">Sisa Stok</p>
                                                    <p className="text-xl md:text-2xl font-bold text-primary">{formatNumber(totalRemaining)}</p>
                                                </div>
                                                {isMultiple && (
                                                    <div className="hidden sm:flex ml-2">
                                                        <div className={`p-1.5 rounded-md transition-colors ${isExpanded ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {isMultiple && (
                                                <div className="w-full flex justify-center sm:hidden mt-1">
                                                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full border border-border/40">
                                                        {isExpanded ? 'Tutup Detail' : 'Lihat Detail Batch'}
                                                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {isMultiple && isExpanded && (
                                            <div className="bg-muted/20 border-t border-border/50 flex flex-col p-3 md:p-4 gap-3 rounded-b-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Rincian Batch Produk</p>
                                                {group.map((item) => (
                                                    <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg border border-border/60 bg-card shadow-sm hover:shadow-md transition-all gap-3 hover:border-primary/30">
                                                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                {getStatusBadge(item.expired_status)}
                                                                <span className="text-xs font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/40">
                                                                    {getRemainingDays(item.expired_date)}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-sm text-muted-foreground">Batch:</span>
                                                                <span className="font-mono bg-primary/5 px-2 py-0.5 rounded text-sm font-semibold border border-primary/20 text-primary">
                                                                    {item.batch_no}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">Supplier: <span className="font-medium text-foreground/80">{item.incoming_product?.supplier?.supplier_name || '-'}</span></p>
                                                        </div>
                                                        <div className="flex w-full sm:w-auto justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t border-border/40 sm:border-0 mt-1 sm:mt-0">
                                                            <div className="flex flex-col sm:items-end">
                                                                <p className="text-xs text-muted-foreground mb-0.5">Awal</p>
                                                                <p className="text-sm font-medium">{formatNumber(item.initial_quantity)}</p>
                                                            </div>
                                                            <div className="flex flex-col items-end">
                                                                <p className="text-xs text-muted-foreground mb-0.5">Sisa</p>
                                                                <p className="text-lg font-bold text-primary">{formatNumber(item.remaining_quantity)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            });
                        })()}
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
            title: 'Stok & Kedaluwarsa',
            href: '/batch-stocks',
        },
    ],
};
