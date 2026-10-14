import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Shield,
    User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Table } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { userApi } from '../../lib/services';
import type { User } from '../../types';
import { cn } from '../../lib/utils';

export function UsersPage() {
    const { hasRole } = useAuth();
    const { toast } = useToast();
    const canManage = hasRole(['admin']);

    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        username: '',
        password: '',
        role: 'petugas',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await userApi.getAll({
                page: currentPage,
                per_page: 10,
                search,
            });
            setUsers(response.data);
            setLastPage(response.meta.last_page);
            setTotal(response.meta.total);
        } catch {
            toast({
                type: 'error',
                title: 'Gagal memuat data',
                message: 'Terjadi kesalahan saat mengambil data user',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, search]);

    const handleOpenModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                nama_lengkap: user.nama_lengkap,
                username: user.username,
                password: '',
                role: user.role,
            });
        } else {
            setEditingUser(null);
            setFormData({
                nama_lengkap: '',
                username: '',
                password: '',
                role: 'petugas',
            });
        }
        setFormErrors({});
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors: Record<string, string> = {};
        if (!formData.nama_lengkap.trim())
            errors.nama_lengkap = 'Nama lengkap wajib diisi';
        if (!formData.username.trim()) errors.username = 'Username wajib diisi';
        if (!editingUser && !formData.password)
            errors.password = 'Password wajib diisi';
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setSubmitting(true);
        try {
            if (editingUser) {
                await userApi.update(editingUser.id_user, {
                    nama_lengkap: formData.nama_lengkap,
                    username: formData.username,
                    role: formData.role,
                });
                toast({
                    type: 'success',
                    title: 'Berhasil',
                    message: 'User berhasil diupdate',
                });
            } else {
                await userApi.create({
                    nama_lengkap: formData.nama_lengkap,
                    username: formData.username,
                    password: formData.password,
                    role: formData.role,
                });
                toast({
                    type: 'success',
                    title: 'Berhasil',
                    message: 'User berhasil ditambahkan',
                });
            }
            setModalOpen(false);
            void fetchUsers();
        } catch (error: unknown) {
            const axiosError = error as {
                response?: { data?: { errors?: Record<string, string[]> } };
            };
            if (axiosError.response?.data?.errors) {
                const newErrors: Record<string, string> = {};
                Object.entries(axiosError.response.data.errors).forEach(
                    ([key, val]) => {
                        newErrors[key] = val[0];
                    },
                );
                setFormErrors(newErrors);
            } else {
                toast({
                    type: 'error',
                    title: 'Gagal',
                    message: 'Terjadi kesalahan',
                });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (user: User) => {
        if (!confirm(`Hapus user "${user.nama_lengkap}"?`)) return;
        try {
            await userApi.delete(user.id_user);
            toast({
                type: 'success',
                title: 'Berhasil',
                message: 'User berhasil dihapus',
            });
            void fetchUsers();
        } catch {
            toast({
                type: 'error',
                title: 'Gagal',
                message: 'Terjadi kesalahan',
            });
        }
    };

    const columns = [
        {
            key: 'nama_lengkap',
            header: 'Nama Lengkap',
            render: (row: User) => (
                <span className="font-medium">{row.nama_lengkap}</span>
            ),
        },
        { key: 'username', header: 'Username' },
        {
            key: 'role',
            header: 'Role',
            render: (row: User) => (
                <span
                    className={cn(
                        'rounded-full px-2 py-1 text-xs font-medium capitalize',
                        row.role === 'admin' && 'bg-purple-100 text-purple-700',
                        row.role === 'petugas' && 'bg-blue-100 text-blue-700',
                        row.role === 'owner' && 'bg-green-100 text-green-700',
                    )}
                >
                    {row.role}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Aksi',
            className: 'text-right',
            render: (row: User) =>
                canManage ? (
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => handleOpenModal(row)}
                            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                            aria-label="Edit"
                        >
                            <Edit className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(row)}
                            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                            aria-label="Hapus"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <span className="text-sm text-slate-400">-</span>
                ),
        },
    ];

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Manajemen User
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Kelola akun admin, petugas, dan owner
                    </p>
                </div>
                {canManage && (
                    <Button
                        onClick={() => handleOpenModal()}
                        leftIcon={<Plus className="h-4 w-4" />}
                    >
                        Tambah User
                    </Button>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-slate-200 bg-white"
            >
                <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row">
                    <div className="max-w-md flex-1">
                        <Input
                            placeholder="Cari nama atau username..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            leftIcon={
                                <Search className="h-5 w-5 text-slate-400" />
                            }
                        />
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={users}
                    keyExtractor={(row) => row.id_user}
                    isLoading={isLoading}
                    emptyMessage="Tidak ada user ditemukan"
                />

                <div className="border-t border-slate-200 px-4 py-4">
                    <Pagination
                        currentPage={currentPage}
                        lastPage={lastPage}
                        onPageChange={setCurrentPage}
                        total={total}
                        perPage={10}
                    />
                </div>
            </motion.div>

            <AnimatePresence>
                {modalOpen && (
                    <Modal
                        isOpen={modalOpen}
                        onClose={() => setModalOpen(false)}
                        title={editingUser ? 'Edit User' : 'Tambah User'}
                        size="md"
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Nama Lengkap"
                                value={formData.nama_lengkap}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        nama_lengkap: e.target.value,
                                    })
                                }
                                error={formErrors.nama_lengkap}
                                leftIcon={
                                    <UserIcon className="h-5 w-5 text-slate-400" />
                                }
                            />
                            <Input
                                label="Username"
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        username: e.target.value,
                                    })
                                }
                                error={formErrors.username}
                                leftIcon={
                                    <UserIcon className="h-5 w-5 text-slate-400" />
                                }
                                disabled={!!editingUser}
                            />
                            {!editingUser && (
                                <Input
                                    label="Password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                    error={formErrors.password}
                                    leftIcon={
                                        <Shield className="h-5 w-5 text-slate-400" />
                                    }
                                    helperText="Minimal 6 karakter"
                                />
                            )}
                            <Select
                                label="Role"
                                value={formData.role}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        role: e.target.value,
                                    })
                                }
                                error={formErrors.role}
                                options={[
                                    { value: 'admin', label: 'Administrator' },
                                    { value: 'petugas', label: 'Petugas' },
                                    { value: 'owner', label: 'Owner' },
                                ]}
                            />
                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setModalOpen(false)}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" loading={submitting}>
                                    {editingUser ? 'Update' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
}
