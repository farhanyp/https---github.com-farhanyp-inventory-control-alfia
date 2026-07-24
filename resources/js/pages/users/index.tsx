import { Head, router } from '@inertiajs/react';
import type { User } from '@/types';

interface UsersIndexProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
    };
    roles: { name: string; value: string }[];
}

export default function UsersIndex({ users, roles }: UsersIndexProps) {
    const handleRoleChange = (userId: string, newRole: string) => {
        router.put(`/users/${userId}/role`, { role: newRole }, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Manajemen Pengguna" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="rounded-xl border border-border bg-card text-card-foreground shadow">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold leading-none tracking-tight">Manajemen Pengguna</h3>
                        <p className="text-sm text-muted-foreground mt-2">Atur role untuk para pengguna aplikasi.</p>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nama</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role Saat Ini</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Ubah Role</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {users.data.map((user: any) => {
                                        const currentRole = user.roles?.[0]?.name || '';
                                        return (
                                            <tr key={user.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <td className="p-4 align-middle">{user.name}</td>
                                                <td className="p-4 align-middle">{user.email}</td>
                                                <td className="p-4 align-middle">
                                                    <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-400/10 dark:text-indigo-400 dark:ring-indigo-400/30">
                                                        {currentRole || 'GUEST'}
                                                    </span>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <select
                                                        className="flex h-9 w-[180px] items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                        value={currentRole}
                                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    >
                                                        <option value="" disabled>Pilih Role</option>
                                                        {roles.map((role: any) => (
                                                            <option key={role.value || role} value={role.value || role}>
                                                                {role.name || role}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Manajemen Pengguna',
            href: '/users',
        },
    ],
};
