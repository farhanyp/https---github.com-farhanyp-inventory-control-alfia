import React from 'react';
import { useForm } from '@inertiajs/react';
import type { Category } from '@/types';
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
    category: Category | null;
    onSuccess?: () => void;
}

export function DeleteDialog({ open, onOpenChange, category, onSuccess }: DeleteDialogProps) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        if (category) {
            destroy(`/categories/${category.id}`, {
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
                    <DialogTitle>Hapus Kategori</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus kategori <strong>{category?.category_name}</strong>? Tindakan ini tidak dapat dibatalkan.
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
