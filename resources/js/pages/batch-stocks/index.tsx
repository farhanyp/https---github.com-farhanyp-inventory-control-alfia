import { Head } from '@inertiajs/react';
import type { BatchStock } from '@/types';
import { AlertCircle, CheckCircle2, AlertTriangle, Clock, Info } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

interface BatchStocksIndexProps {
    batchStocks: {
        data: BatchStock[];
        current_page: number;
        last_page: number;
    };
}

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
        return `${diffDays} hari lagi`;
    };

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'Aman':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                        <CheckCircle2 className="w-3 h-3" /> Aman
                    </span>
                );
            case 'Peringatan':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                        <Clock className="w-3 h-3" /> Peringatan (Kuning)
                    </span>
                );
            case 'Hampir Expired':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                        <AlertTriangle className="w-3 h-3" /> Hampir Expired (Orange)
                    </span>
                );
            case 'Expired':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                        <AlertCircle className="w-3 h-3" /> Expired (Merah)
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        -
                    </span>
                );
        }
    };

    return (
        <>
            <Head title="Stok & Expired" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="rounded-xl border border-border bg-card text-card-foreground shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4">
                        <div>
                            <h3 className="text-lg font-semibold leading-none tracking-tight">Monitoring Stok & Kedaluwarsa</h3>
                            <p className="text-sm text-muted-foreground mt-2">Pantau sisa stok produk per batch dan status kedaluwarsanya.</p>
                        </div>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
                                            <div className="flex items-center gap-1">
                                                Status Expired
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Info className="w-4 h-4 cursor-help text-muted-foreground hover:text-foreground" />
                                                        </TooltipTrigger>
                                                        <TooltipContent className="max-w-[300px] leading-relaxed">
                                                            <p className="font-semibold mb-1">Keterangan Warna:</p>
                                                            <ul className="list-disc pl-4 space-y-1">
                                                                <li><strong className="text-green-300">Hijau (Aman):</strong> &gt; 30 Hari</li>
                                                                <li><strong className="text-yellow-300">Kuning (Peringatan):</strong> 15 - 30 Hari</li>
                                                                <li><strong className="text-orange-300">Orange (Hampir Expired):</strong> 8 - 14 Hari</li>
                                                                <li><strong className="text-red-300">Merah (Expired):</strong> Kurang Dari 7 Hari / Terlewat</li>
                                                            </ul>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">Sisa Waktu</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">Produk</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">Supplier</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">No. Batch</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground whitespace-nowrap">Kuantitas Awal</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground whitespace-nowrap">Sisa Kuantitas</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {batchStocks.data.map((item) => (
                                        <tr key={item.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle whitespace-nowrap">
                                                {getStatusBadge(item.expired_status)}
                                            </td>
                                            <td className="p-4 align-middle whitespace-nowrap">
                                                {getRemainingDays(item.expired_date)}
                                            </td>
                                            <td className="p-4 align-middle whitespace-nowrap font-medium">
                                                {item.product?.product_name || '-'}
                                            </td>
                                            <td className="p-4 align-middle whitespace-nowrap text-muted-foreground">
                                                {item.incoming_product?.supplier?.supplier_name || '-'}
                                            </td>
                                            <td className="p-4 align-middle whitespace-nowrap">
                                                {item.batch_no}
                                            </td>
                                            <td className="p-4 align-middle whitespace-nowrap text-right text-muted-foreground">
                                                {parseFloat(item.initial_quantity.toString()).toLocaleString('id-ID')}
                                            </td>
                                            <td className="p-4 align-middle whitespace-nowrap text-right font-semibold text-primary">
                                                {parseFloat(item.remaining_quantity.toString()).toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    ))}
                                    {batchStocks.data.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="h-24 text-center text-muted-foreground">
                                                Belum ada data stok per batch.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
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
