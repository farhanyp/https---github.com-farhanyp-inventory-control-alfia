import React from 'react';
import { useForm } from '@inertiajs/react';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';

interface DeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product | null;
    onSuccess?: () => void;
}

export function DeleteDialog({ open, onOpenChange, product, onSuccess }: DeleteDialogProps) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        if (product) {
            destroy(`/products/${product.id}`, {
                onSuccess: () => {
                    onOpenChange(false);
                    if (onSuccess) onSuccess();
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hapus Produk</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus produk <strong>{product?.product_name}</strong>? Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                    <Button type="button" variant="destructive" onClick={handleDelete} disabled={processing}>Hapus</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
