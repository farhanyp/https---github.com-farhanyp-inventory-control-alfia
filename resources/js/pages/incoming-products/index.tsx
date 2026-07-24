import { useState } from 'react';
import { Head } from '@inertiajs/react';
import type { IncomingProduct, Supplier, Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { CreateDialog } from './create-dialog';
import { EditDialog } from './edit-dialog';
import { DeleteDialog } from './delete-dialog';

interface IncomingProductsIndexProps {
    incomingProducts: {
        data: IncomingProduct[];
        current_page: number;
        last_page: number;
    };
    suppliers: Supplier[];
    products: Product[];
}

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
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="rounded-xl border border-border bg-card text-card-foreground shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4">
                        <div>
                            <h3 className="text-lg font-semibold leading-none tracking-tight">Barang Masuk</h3>
                            <p className="text-sm text-muted-foreground mt-2">Kelola riwayat transaksi barang masuk (Restock).</p>
                        </div>
                        <Button onClick={handleOpenCreate} className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Tambah Transaksi
                        </Button>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">Tgl Masuk</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">Invoice</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">Produk</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">Supplier</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground whitespace-nowrap">Kuantitas</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground whitespace-nowrap">Harga Beli</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground whitespace-nowrap">Total</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground whitespace-nowrap">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {incomingProducts.data.map((item) => (
                                        <tr key={item.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle whitespace-nowrap">
                                                {new Date(item.incoming_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="p-4 align-middle whitespace-nowrap font-medium">{item.invoice_number}</td>
                                            <td className="p-4 align-middle whitespace-nowrap">{item.product?.product_name || '-'}</td>
                                            <td className="p-4 align-middle whitespace-nowrap">{item.supplier?.supplier_name || '-'}</td>
                                            <td className="p-4 align-middle whitespace-nowrap text-right">
                                                {parseFloat(item.quantity.toString()).toLocaleString('id-ID')}
                                            </td>
                                            <td className="p-4 align-middle whitespace-nowrap text-right">
                                                Rp {parseFloat(item.purchase_price.toString()).toLocaleString('id-ID')}
                                            </td>
                                            <td className="p-4 align-middle whitespace-nowrap text-right font-semibold">
                                                Rp {parseFloat(item.total.toString()).toLocaleString('id-ID')}
                                            </td>
                                            <td className="p-4 align-middle text-right whitespace-nowrap">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" onClick={() => handleOpenEdit(item)}>
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="destructive" size="icon" onClick={() => handleOpenDelete(item)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {incomingProducts.data.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="h-24 text-center text-muted-foreground">
                                                Belum ada data barang masuk.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
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
