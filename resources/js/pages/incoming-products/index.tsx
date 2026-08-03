import { useState, Fragment } from 'react';
import { Head } from '@inertiajs/react';
import type { IncomingProduct, Supplier, Product, IncomingProductsIndexProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus, ChevronDown, ChevronUp, Layers, PackagePlus } from 'lucide-react';
import { CreateDialog } from './create-dialog';
import { EditDialog } from './edit-dialog';
import { DeleteDialog } from './delete-dialog';
import { Pagination } from '@/components/pagination';
import { formatDate, formatCurrency, formatNumber } from '@/lib/utils';

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

    return (
        <>
            <Head title="Barang Masuk" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm text-card-foreground shadow-sm overflow-hidden flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 md:p-6 gap-4 border-b border-border/50 bg-gradient-to-r from-card to-muted/20">
                        <div className="flex flex-col gap-1.5">
                            <h3 className="text-lg md:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                                <PackagePlus className="w-5 h-5 text-primary" />
                                Transaksi Barang Masuk
                            </h3>
                            <p className="text-sm text-muted-foreground">Kelola riwayat transaksi penerimaan dan pengadaan stok (Restock).</p>
                        </div>
                        <Button onClick={handleOpenCreate} className="flex items-center gap-2 h-10 px-5 shadow-sm w-full sm:w-auto">
                            <Plus className="w-4 h-4" />
                            Tambah Transaksi
                        </Button>
                    </div>
                    
                    <div className="flex flex-col gap-4 p-4 md:p-6 overflow-y-auto bg-muted/5">
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
                                    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/60 rounded-xl bg-card/50">
                                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                            <PackagePlus className="w-6 h-6 text-muted-foreground/50" />
                                        </div>
                                        <h4 className="text-base font-medium text-foreground mb-1">Belum ada riwayat transaksi barang masuk.</h4>
                                        <p className="text-sm text-muted-foreground max-w-sm">Data pengadaan stok masih kosong. Silakan tambah transaksi baru.</p>
                                    </div>
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
                                    <div key={`group-${firstItem.product_id}`} className={`flex flex-col rounded-xl border transition-all duration-200 ${isExpanded ? 'border-primary/50 shadow-md ring-1 ring-primary/20' : 'border-border/60 bg-card shadow-sm hover:shadow-md'}`}>
                                        <div 
                                            className={`p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center ${isMultiple ? 'cursor-pointer hover:bg-muted/30' : ''}`}
                                            onClick={isMultiple ? () => toggleGroup(firstItem.product_id) : undefined}
                                        >
                                            <div className="flex flex-col gap-2 w-full sm:w-auto flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {!isMultiple ? (
                                                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border/50">
                                                            {formatDate(firstItem.incoming_date)}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider border border-primary/20">
                                                            <Layers className="w-3 h-3" /> {group.length} Transaksi
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="font-semibold text-base md:text-lg text-foreground">{firstItem.product?.product_name || '-'}</span>
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-wrap">
                                                    <p>Supplier: {isMultiple ? <span className="italic opacity-80">{supplierText}</span> : <span className="font-medium text-foreground/80">{supplierText}</span>}</p>
                                                    {!isMultiple && (
                                                        <>
                                                            <span className="hidden sm:inline opacity-50">•</span>
                                                            <p>Inv: <span className="font-semibold text-foreground/80">{firstItem.invoice_number}</span></p>
                                                            <span className="hidden sm:inline opacity-50">•</span>
                                                            <p>Batch: <span className="font-mono bg-muted/60 px-1.5 py-0.5 rounded text-xs border border-border/50">{firstItem.batch_no}</span></p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-border/30 sm:border-t-0">
                                                <div className="flex flex-col sm:items-end">
                                                    <p className="text-xs text-muted-foreground mb-0.5">Kuantitas</p>
                                                    <p className="text-lg font-bold text-foreground">
                                                        {formatNumber(totalQty)}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <p className="text-xs text-muted-foreground mb-0.5">Total Harga</p>
                                                    <p className="text-lg font-bold text-primary">
                                                        {formatCurrency(totalAmount)}
                                                    </p>
                                                </div>
                                                
                                                {isMultiple ? (
                                                    <div className="hidden sm:flex ml-2">
                                                        <div className={`p-1.5 rounded-md transition-colors ${isExpanded ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-end gap-1.5 ml-2">
                                                        <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-primary/5 hover:text-primary hover:border-primary/30" onClick={(e) => { e.stopPropagation(); handleOpenEdit(firstItem); }}>
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button variant="destructive" size="icon" className="h-8 w-8 opacity-90 hover:opacity-100" onClick={(e) => { e.stopPropagation(); handleOpenDelete(firstItem); }}>
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            {isMultiple && (
                                                <div className="w-full flex justify-center sm:hidden mt-1">
                                                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full border border-border/40">
                                                        {isExpanded ? 'Tutup Detail' : 'Lihat Detail Transaksi'}
                                                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Child Rows for Multiple Incoming Trans */}
                                        {isMultiple && isExpanded && (
                                            <div className="bg-muted/20 border-t border-border/50 flex flex-col p-3 md:p-4 gap-3 rounded-b-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Rincian Transaksi</p>
                                                {group.map((item) => (
                                                    <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg border border-border/60 bg-card shadow-sm hover:shadow-md transition-all gap-3 hover:border-primary/30">
                                                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/40">
                                                                    {formatDate(item.incoming_date)}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground font-medium">Inv: <span className="text-foreground font-semibold">{item.invoice_number}</span></span>
                                                            </div>
                                                            <p className="text-sm text-foreground/80">
                                                                Supplier: <span className="font-medium text-foreground">{item.supplier?.supplier_name || '-'}</span>
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                Batch: <span className="font-mono bg-primary/5 px-1.5 py-0.5 rounded border border-primary/20 text-primary">{item.batch_no}</span>
                                                            </p>
                                                        </div>
                                                        <div className="flex w-full sm:w-auto justify-between sm:justify-end items-end sm:items-center gap-4 pt-3 sm:pt-0 border-t border-border/40 sm:border-0 mt-1 sm:mt-0">
                                                            <div className="flex flex-col sm:items-end">
                                                                <p className="text-xs text-muted-foreground mb-0.5">Kuantitas</p>
                                                                <p className="text-sm font-medium">{formatNumber(item.quantity)}</p>
                                                            </div>
                                                            <div className="flex flex-col items-end">
                                                                <p className="text-xs text-muted-foreground mb-0.5">Total Harga</p>
                                                                <p className="text-sm font-bold text-primary">{formatCurrency(item.total)}</p>
                                                            </div>
                                                            <div className="flex justify-end gap-1.5 ml-2 opacity-80 hover:opacity-100 transition-opacity">
                                                                <Button variant="outline" size="icon" className="h-7 w-7 hover:bg-primary/5 hover:text-primary hover:border-primary/30" onClick={() => handleOpenEdit(item)}>
                                                                    <Pencil className="w-3 h-3" />
                                                                </Button>
                                                                <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => handleOpenDelete(item)}>
                                                                    <Trash2 className="w-3 h-3" />
                                                                </Button>
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
