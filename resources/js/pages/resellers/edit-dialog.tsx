import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import type { Reseller } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reseller: Reseller | null;
}

export function EditDialog({ open, onOpenChange, reseller }: EditDialogProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: '',
    });

    useEffect(() => {
        if (reseller) {
            setData({
                name: reseller.name,
            });
        }
    }, [reseller]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reseller) return;

        put(`/resellers/${reseller.id}`, {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Reseller</DialogTitle>
                    <DialogDescription>Ubah data reseller atau konsumen di sini.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Nama Reseller <span className="text-red-500">*</span></Label>
                            <Input
                                id="edit-name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Masukkan nama reseller"
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
