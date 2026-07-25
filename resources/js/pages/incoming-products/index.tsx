import { useState, Fragment } from 'react';
import { Head } from '@inertiajs/react';
import type { IncomingProduct, Supplier, Product, IncomingProductsIndexProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus, ChevronDown, ChevronRight, Layers, PackagePlus } from 'lucide-react';
import { CreateDialog } from './create-dialog';
import { EditDialog } from './edit-dialog';
import { DeleteDialog } from './delete-dialog';
import { Pagination } from '@/components/pagination';

export default function IncomingProductsIndex({ incomingProducts, suppliers, products }: IncomingProductsIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedIncoming, setSelectedIncoming] = useState<IncomingProduct | null>(null);

    const handleOpenCreate = () => {
        setIsCreateOpen(true);
    };

    const handleOpenEdit = (incoming: IncomingProduct) => {
        setSelectedIncoming(incoming);
        setIsEditOpen(true);
    };

    const handleOpenDelete = (incoming: IncomingProduct) => {
        setSelectedIncoming(incoming);
        setIsDeleteOpen(true);
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const formatCurrency = (value: number | string) => {
        return `Rp ${parseFloat(value.toString()).toLocaleString('id-ID')}`;
    };

    return (
        <>
            <Head title="Barang Masuk" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm text-card-foreground shadow-sm overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4 border-b border-border/50 bg-gradient-to-r from-card to-muted/20">
                        <div className="flex flex-col gap-1.5">
                            <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                                <PackagePlus className="w-5 h-5 text-primary" />
                                Transaksi Barang Masuk
                            </h3>
                            <p className="text-sm text-muted-foreground">Kelola riwayat transaksi penerimaan dan pengadaan stok (Restock).</p>
                        </div>
                        <Button onClick={handleOpenCreate} className="flex items-center gap-2 h-10 px-5 shadow-sm">
                            <Plus className="w-4 h-4" />
                            Tambah Transaksi
                        </Button>
                    </div>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="bg-muted/50 border-b border-border/50">
                                <tr className="[&>th]:font-semibold [&>th]:text-muted-foreground [&>th]:h-11">
                                    <th className="px-6 text-left align-middle whitespace-nowrap">Produk</th>
                                    <th className="px-4 text-left align-middle whitespace-nowrap">Supplier</th>
                                    <th className="px-4 text-left align-middle whitespace-nowrap">Invoice & Batch</th>
                                    <th className="px-4 text-left align-middle whitespace-nowrap">Tanggal Masuk</th>
                                    <th className="px-4 text-right align-middle whitespace-nowrap">Kuantitas</th>
                                    <th className="px-4 text-right align-middle whitespace-nowrap">Total Harga</th>
                                    <th className="px-6 text-right align-middle whitespace-nowrap">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {(() => {
                                    const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});
                                    
                                    const toggleGroup = (productId: number) => {
                                        setExpandedGroups(prev => ({ ...prev, [productId]: !prev[productId] }));
                                    };

                                    const groupedIncoming = Object.values(
                                        incomingProducts.data.reduce((acc, item) => {
                                            const key = item.product_id;
                                            if (!acc[key]) acc[key] = [];
                                            acc[key].push(item);
                                            return acc;
                                        }, {} as Record<number, IncomingProduct[]>)
                                    );

                                    if (groupedIncoming.length === 0) {
                                        return (
                                            <tr>
                                                <td colSpan={7} className="h-32 text-center text-muted-foreground">
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                        <PackagePlus className="w-8 h-8 opacity-20" />
                                                        <p>Belum ada riwayat transaksi barang masuk.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }

                                    return groupedIncoming.map((group) => {
                                        const isMultiple = group.length > 1;
                                        const firstItem = group[0];
                                        const isExpanded = expandedGroups[firstItem.product_id];
                                        
                                        const totalQty = group.reduce((sum, item) => sum + parseFloat(item.quantity.toString()), 0);
                                        const totalAmount = group.reduce((sum, item) => sum + parseFloat(item.total.toString()), 0);
                                        const uniqueSuppliers = Array.from(new Set(group.map(item => item.supplier?.supplier_name || '-')));
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
                                                        <div className="flex items-center gap-3">
                                                            {isMultiple && (
                                                                <div className={`p-1 rounded-md transition-colors ${isExpanded ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                                                                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                                                </div>
                                                            )}
                                                            <span className={`font-semibold ${isExpanded ? 'text-primary' : 'text-foreground'}`}>{firstItem.product?.product_name || '-'}</span>
                                                            {isMultiple && (
                                                                <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                                                                    <Layers className="w-3 h-3" /> {group.length} Transaksi
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 px-4 align-middle whitespace-nowrap text-muted-foreground">
                                                        {isMultiple ? (
                                                            <span className="italic opacity-80">{supplierText}</span>
                                                        ) : (
                                                            firstItem.supplier?.supplier_name || '-'
                                                        )}
                                                    </td>
                                                    <td className="p-4 px-4 align-middle whitespace-nowrap text-muted-foreground">
                                                        {isMultiple ? '-' : (
                                                            <div className="flex flex-col gap-1">
                                                                <span className="font-semibold text-foreground text-xs">{firstItem.invoice_number}</span>
                                                                <span className="font-mono text-[10px] opacity-70">B: {firstItem.batch_no}</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="p-4 px-4 align-middle whitespace-nowrap text-muted-foreground">
                                                        {isMultiple ? '-' : formatDate(firstItem.incoming_date)}
                                                    </td>
                                                    <td className="p-4 px-4 align-middle whitespace-nowrap text-right">
                                                        <span className="font-bold text-foreground">
                                                            {totalQty.toLocaleString('id-ID')}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 px-4 align-middle whitespace-nowrap text-right">
                                                        <span className="font-bold text-primary">
                                                            {formatCurrency(totalAmount)}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 px-6 align-middle text-right whitespace-nowrap">
                                                        {!isMultiple && (
                                                            <div className="flex justify-end gap-2">
                                                                <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-muted/80" onClick={(e) => { e.stopPropagation(); handleOpenEdit(firstItem); }}>
                                                                    <Pencil className="w-3.5 h-3.5" />
                                                                </Button>
                                                                <Button variant="destructive" size="icon" className="h-8 w-8 hover:bg-destructive/90" onClick={(e) => { e.stopPropagation(); handleOpenDelete(firstItem); }}>
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                                
                                                {/* Child Rows for Multiple Incoming Trans */}
                                                {isMultiple && isExpanded && group.map((item, idx) => {
                                                    const isLast = idx === group.length - 1;
                                                    return (
                                                        <tr key={item.id} className={`border-b border-border/20 bg-primary/[0.015] transition-colors hover:bg-primary/[0.03] ${isLast ? 'shadow-[inset_0_-1px_0_0_border/30]' : ''}`}>
                                                            <td className="p-3 pl-8 px-6 align-middle whitespace-nowrap shadow-[inset_4px_0_0_0_hsl(var(--primary))] border-l-transparent flex items-center gap-3">
                                                                <div className="w-3 h-px bg-primary/30"></div>
                                                                <span className="opacity-80 font-medium text-sm">{item.product?.product_name || '-'}</span>
                                                            </td>
                                                            <td className="p-3 px-4 align-middle whitespace-nowrap text-sm text-muted-foreground">
                                                                {item.supplier?.supplier_name || '-'}
                                                            </td>
                                                            <td className="p-3 px-4 align-middle whitespace-nowrap text-sm">
                                                                <div className="flex flex-col gap-0.5">
                                                                    <span className="font-medium text-foreground text-xs">{item.invoice_number}</span>
                                                                    <span className="font-mono text-[10px] text-muted-foreground">B: {item.batch_no}</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-3 px-4 align-middle whitespace-nowrap text-sm text-muted-foreground">
                                                                {formatDate(item.incoming_date)}
                                                            </td>
                                                            <td className="p-3 px-4 align-middle whitespace-nowrap text-right text-sm">
                                                                <span className="font-medium text-muted-foreground">
                                                                    {parseFloat(item.quantity.toString()).toLocaleString('id-ID')}
                                                                </span>
                                                            </td>
                                                            <td className="p-3 px-4 align-middle whitespace-nowrap text-right text-sm">
                                                                <span className="font-medium text-primary/80">
                                                                    {formatCurrency(item.total)}
                                                                </span>
                                                            </td>
                                                            <td className="p-3 px-6 align-middle text-right whitespace-nowrap">
                                                                <div className="flex justify-end gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                                                                    <Button variant="outline" size="icon" className="h-7 w-7 hover:bg-muted/80" onClick={() => handleOpenEdit(item)}>
                                                                        <Pencil className="w-3 h-3" />
                                                                    </Button>
                                                                    <Button variant="destructive" size="icon" className="h-7 w-7 hover:bg-destructive/90" onClick={() => handleOpenDelete(item)}>
                                                                        <Trash2 className="w-3 h-3" />
                                                                    </Button>
                                                                </div>
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
                        <Pagination links={incomingProducts.links} />
                    </div>
                </div>
            </div>

            <CreateDialog 
                open={isCreateOpen} 
                onOpenChange={setIsCreateOpen}
                suppliers={suppliers}
                products={products}
            />

            <EditDialog 
                open={isEditOpen} 
                onOpenChange={setIsEditOpen} 
                incomingProduct={selectedIncoming}
                suppliers={suppliers}
                products={products}
            />

            <DeleteDialog 
                open={isDeleteOpen} 
                onOpenChange={setIsDeleteOpen} 
                incomingProduct={selectedIncoming} 
            />
        </>
    );
}

IncomingProductsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Barang Masuk',
            href: '/incoming-products',
        },
    ],
};
