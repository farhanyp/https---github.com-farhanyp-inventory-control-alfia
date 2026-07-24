import React from 'react';
import { useForm } from '@inertiajs/react';
import type { Unit } from '@/types';
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
    unit: Unit | null;
    onSuccess?: () => void;
}

export function DeleteDialog({ open, onOpenChange, unit, onSuccess }: DeleteDialogProps) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        if (unit) {
            destroy(`/units/${unit.id}`, {
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
                    <DialogTitle>Hapus Satuan</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus satuan <strong>{unit?.unit_name}</strong>? Tindakan ini tidak dapat dibatalkan.
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
