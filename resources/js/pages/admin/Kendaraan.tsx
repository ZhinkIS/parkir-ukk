import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Car,
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
import { kendaraanApi } from '../../lib/services';
import type { Kendaraan } from '../../types';
import { cn } from '../../lib/utils';

export function KendaraanPage() {
    const { hasRole } = useAuth();
    const { toast } = useToast();
    const canManage = hasRole(['admin']);

    const [kendaraans, setKendaraans] = useState<Kendaraan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingKendaraan, setEditingKendaraan] = useState<Kendaraan | null>(
        null,
    );
    const [formData, setFormData] = useState({
        plat_nomor: '',
        jenis_kendaraan: 'motor',
        warna: '',
        pemilik: '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const fetchKendaraans = async () => {
        setIsLoading(true);
        try {
            const response = await kendaraanApi.getAll({
                page: currentPage,
                per_page: 10,
                search,
            });
            setKendaraans(response.data);
            setLastPage(response.meta.last_page);
            setTotal(response.meta.total);
        } catch {
            toast({ type: 'error', title: 'Gagal memuat data' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchKendaraans();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, search]);

    const handleOpenModal = (kendaraan?: Kendaraan) => {
        if (kendaraan) {
            setEditingKendaraan(kendaraan);
            setFormData({
                plat_nomor: kendaraan.plat_nomor,
                jenis_kendaraan: kendaraan.jenis_kendaraan,
                warna: kendaraan.warna,
                pemilik: kendaraan.pemilik,
            });
        } else {
            setEditingKendaraan(null);
            setFormData({
                plat_nomor: '',
                jenis_kendaraan: 'motor',
                warna: '',
                pemilik: '',
            });
        }
        setFormErrors({});
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors: Record<string, string> = {};
        if (!formData.plat_nomor.trim())
            errors.plat_nomor = 'Plat nomor wajib diisi';
        if (!formData.warna.trim()) errors.warna = 'Warna wajib diisi';
        if (!formData.pemilik.trim()) errors.pemilik = 'Pemilik wajib diisi';
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setSubmitting(true);
        try {
            if (editingKendaraan) {
                await kendaraanApi.update(
                    editingKendaraan.id_kendaraan,
                    formData,
                );
                toast({
                    type: 'success',
                    title: 'Berhasil',
                    message: 'Data kendaraan berhasil diupdate',
                });
            } else {
                await kendaraanApi.create(formData);
                toast({
                    type: 'success',
                    title: 'Berhasil',
                    message: 'Kendaraan berhasil ditambahkan',
                });
            }
            setModalOpen(false);
            void fetchKendaraans();
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
                    message:
                        'Plat nomor sudah terdaftar atau terjadi kesalahan',
                });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (kendaraan: Kendaraan) => {
        if (!confirm(`Hapus kendaraan "${kendaraan.plat_nomor}"?`)) return;
        try {
            await kendaraanApi.delete(kendaraan.id_kendaraan);
            toast({
                type: 'success',
                title: 'Berhasil',
                message: 'Kendaraan berhasil dihapus',
            });
            void fetchKendaraans();
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
            key: 'plat_nomor',
            header: 'Plat Nomor',
            render: (row: Kendaraan) => (
                <span className="font-mono font-medium">{row.plat_nomor}</span>
            ),
        },
        {
            key: 'jenis_kendaraan',
            header: 'Jenis',
            render: (row: Kendaraan) => (
                <span
                    className={cn(
                        'rounded-full px-2 py-1 text-xs font-medium capitalize',
                        row.jenis_kendaraan === 'motor' &&
                            'bg-blue-100 text-blue-700',
                        row.jenis_kendaraan === 'mobil' &&
                            'bg-green-100 text-green-700',
                        row.jenis_kendaraan === 'lainnya' &&
                            'bg-gray-100 text-gray-700',
                    )}
                >
                    {row.jenis_kendaraan}
                </span>
            ),
        },
        { key: 'warna', header: 'Warna' },
        { key: 'pemilik', header: 'Pemilik' },
        {
            key: 'created_at',
            header: 'Dibuat',
            render: (row: Kendaraan) =>
                row.created_at
                    ? new Date(row.created_at).toLocaleDateString('id-ID')
                    : '-',
        },
        {
            key: 'actions',
            header: 'Aksi',
            className: 'text-right',
            render: (row: Kendaraan) =>
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
                        Data Kendaraan
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Kelola data kendaraan terdaftar
                    </p>
                </div>
                {canManage && (
                    <Button
                        onClick={() => handleOpenModal()}
                        leftIcon={<Plus className="h-4 w-4" />}
                    >
                        Tambah Kendaraan
                    </Button>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-slate-200 bg-white"
            >
                <div className="border-b border-slate-200 p-4">
                    <Input
                        placeholder="Cari plat nomor atau pemilik..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        leftIcon={<Search className="h-5 w-5 text-slate-400" />}
                    />
                </div>

                <Table
                    columns={columns}
                    data={kendaraans}
                    keyExtractor={(row) => row.id_kendaraan}
                    isLoading={isLoading}
                    emptyMessage="Tidak ada data kendaraan"
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
                        title={
                            editingKendaraan
                                ? 'Edit Kendaraan'
                                : 'Tambah Kendaraan'
                        }
                        size="md"
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Plat Nomor"
                                value={formData.plat_nomor}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        plat_nomor:
                                            e.target.value.toUpperCase(),
                                    })
                                }
                                error={formErrors.plat_nomor}
                                leftIcon={
                                    <Car className="h-5 w-5 text-slate-400" />
                                }
                                placeholder="Contoh: B 1234 ABC"
                                maxLength={15}
                            />
                            <Select
                                label="Jenis Kendaraan"
                                value={formData.jenis_kendaraan}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        jenis_kendaraan: e.target.value,
                                    })
                                }
                                error={formErrors.jenis_kendaraan}
                                options={[
                                    { value: 'motor', label: 'Motor' },
                                    { value: 'mobil', label: 'Mobil' },
                                    { value: 'lainnya', label: 'Lainnya' },
                                ]}
                            />
                            <Input
                                label="Warna"
                                value={formData.warna}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        warna: e.target.value,
                                    })
                                }
                                error={formErrors.warna}
                                placeholder="Contoh: Hitam"
                            />
                            <Input
                                label="Pemilik"
                                value={formData.pemilik}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        pemilik: e.target.value,
                                    })
                                }
                                error={formErrors.pemilik}
                                leftIcon={
                                    <UserIcon className="h-5 w-5 text-slate-400" />
                                }
                                placeholder="Nama pemilik kendaraan"
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
                                    {editingKendaraan ? 'Update' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
}
