import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Table } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { tarifApi } from '../../lib/services';
import type { Tarif } from '../../types';
import { cn } from '../../lib/utils';

export function TarifPage() {
    const { hasRole } = useAuth();
    const { toast } = useToast();
    const canManage = hasRole(['admin']);

    const [tarifs, setTarifs] = useState<Tarif[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingTarif, setEditingTarif] = useState<Tarif | null>(null);
    const [formData, setFormData] = useState({
        jenis_kendaraan: 'motor',
        tarif_per_jam: 0,
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const fetchTarifs = async () => {
        setIsLoading(true);
        try {
            const response = await tarifApi.getAll({
                page: currentPage,
                per_page: 10,
            });
            setTarifs(response.data);
            setLastPage(response.meta.last_page);
            setTotal(response.meta.total);
        } catch {
            toast({ type: 'error', title: 'Gagal memuat data' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchTarifs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const handleOpenModal = (tarif?: Tarif) => {
        if (tarif) {
            setEditingTarif(tarif);
            setFormData({
                jenis_kendaraan: tarif.jenis_kendaraan,
                tarif_per_jam: tarif.tarif_per_jam,
            });
        } else {
            setEditingTarif(null);
            setFormData({ jenis_kendaraan: 'motor', tarif_per_jam: 0 });
        }
        setFormErrors({});
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors: Record<string, string> = {};
        if (!formData.tarif_per_jam || formData.tarif_per_jam < 0)
            errors.tarif_per_jam = 'Tarif harus diisi dan minimal 0';
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setSubmitting(true);
        try {
            if (editingTarif) {
                await tarifApi.update(editingTarif.id_tarif, {
                    tarif_per_jam: formData.tarif_per_jam,
                });
                toast({
                    type: 'success',
                    title: 'Berhasil',
                    message: 'Tarif berhasil diupdate',
                });
            } else {
                await tarifApi.create({
                    jenis_kendaraan: formData.jenis_kendaraan,
                    tarif_per_jam: formData.tarif_per_jam,
                });
                toast({
                    type: 'success',
                    title: 'Berhasil',
                    message: 'Tarif berhasil ditambahkan',
                });
            }
            setModalOpen(false);
            void fetchTarifs();
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
                    message: 'Jenis kendaraan sudah ada atau terjadi kesalahan',
                });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (tarif: Tarif) => {
        if (!confirm(`Hapus tarif "${tarif.jenis_kendaraan}"?`)) return;
        try {
            await tarifApi.delete(tarif.id_tarif);
            toast({
                type: 'success',
                title: 'Berhasil',
                message: 'Tarif berhasil dihapus',
            });
            void fetchTarifs();
        } catch {
            toast({
                type: 'error',
                title: 'Gagal',
                message: 'Terjadi kesalahan',
            });
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const columns = [
        {
            key: 'jenis_kendaraan',
            header: 'Jenis Kendaraan',
            render: (row: Tarif) => (
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
        {
            key: 'tarif_per_jam',
            header: 'Tarif/Jam',
            render: (row: Tarif) => (
                <span className="font-mono font-medium">
                    {formatCurrency(row.tarif_per_jam)}
                </span>
            ),
        },
        {
            key: 'created_at',
            header: 'Dibuat',
            render: (row: Tarif) =>
                row.created_at
                    ? new Date(row.created_at).toLocaleDateString('id-ID')
                    : '-',
        },
        {
            key: 'actions',
            header: 'Aksi',
            className: 'text-right',
            render: (row: Tarif) =>
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
                        Tarif Parkir
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Kelola tarif parkir per jenis kendaraan
                    </p>
                </div>
                {canManage && (
                    <Button
                        onClick={() => handleOpenModal()}
                        leftIcon={<Plus className="h-4 w-4" />}
                    >
                        Tambah Tarif
                    </Button>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-slate-200 bg-white"
            >
                <Table
                    columns={columns}
                    data={tarifs}
                    keyExtractor={(row) => row.id_tarif}
                    isLoading={isLoading}
                    emptyMessage="Tidak ada data tarif"
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
                        title={editingTarif ? 'Edit Tarif' : 'Tambah Tarif'}
                        size="md"
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!editingTarif && (
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
                            )}
                            {editingTarif && (
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Jenis Kendaraan
                                    </label>
                                    <div className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 font-medium text-slate-900 capitalize">
                                        {formData.jenis_kendaraan}
                                    </div>
                                </div>
                            )}
                            <Input
                                label="Tarif per Jam (Rp)"
                                type="number"
                                value={formData.tarif_per_jam}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        tarif_per_jam:
                                            parseInt(e.target.value) || 0,
                                    })
                                }
                                error={formErrors.tarif_per_jam}
                                leftIcon={
                                    <Tag className="h-5 w-5 text-slate-400" />
                                }
                                placeholder="Contoh: 5000"
                                min={0}
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
                                    {editingTarif ? 'Update' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
}
