import { useState } from 'react';
import { Head } from '@inertiajs/react';
import type { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { CreateDialog } from './create-dialog';
import { EditDialog } from './edit-dialog';
import { DeleteDialog } from './delete-dialog';

interface CategoriesIndexProps {
    categories: {
        data: Category[];
        current_page: number;
        last_page: number;
    };
}

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const handleOpenCreate = () => {
        setIsCreateOpen(true);
    };

    const handleOpenEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsEditOpen(true);
    };

    const handleOpenDelete = (category: Category) => {
        setSelectedCategory(category);
        setIsDeleteOpen(true);
    };

    return (
        <>
            <Head title="Kategori" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="rounded-xl border border-border bg-card text-card-foreground shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4">
                        <div>
                            <h3 className="text-lg font-semibold leading-none tracking-tight">Kategori Produk</h3>
                            <p className="text-sm text-muted-foreground mt-2">Kelola daftar kategori yang tersedia.</p>
                        </div>
                        <Button onClick={handleOpenCreate} className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Tambah Kategori
                        </Button>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 w-16 px-4 text-center align-middle font-medium text-muted-foreground">ID</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nama Kategori</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {categories.data.map((category) => (
                                        <tr key={category.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 text-center align-middle">{category.id}</td>
                                            <td className="p-4 align-middle">{category.category_name}</td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="icon" onClick={() => handleOpenEdit(category)}>
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="destructive" size="icon" onClick={() => handleOpenDelete(category)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {categories.data.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="h-24 text-center text-muted-foreground">
                                                Belum ada data kategori.
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
            />

            <EditDialog 
                open={isEditOpen} 
                onOpenChange={setIsEditOpen} 
                category={selectedCategory} 
            />

            <DeleteDialog 
                open={isDeleteOpen} 
                onOpenChange={setIsDeleteOpen} 
                category={selectedCategory} 
            />
        </>
    );
}

CategoriesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Kategori',
            href: '/categories',
        },
    ],
};
