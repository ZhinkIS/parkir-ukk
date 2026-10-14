import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Table } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { areaParkirApi } from '../../lib/services';
import type { AreaParkir } from '../../types';
import { cn } from '../../lib/utils';

export function AreaParkirPage() {
    const { hasRole } = useAuth();
    const { toast } = useToast();
    const canManage = hasRole(['admin']);

    const [areas, setAreas] = useState<AreaParkir[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingArea, setEditingArea] = useState<AreaParkir | null>(null);
    const [formData, setFormData] = useState({ nama_area: '', kapasitas: 0 });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const fetchAreas = async () => {
        setIsLoading(true);
        try {
            const response = await areaParkirApi.getAll({
                page: currentPage,
                per_page: 10,
            });
            setAreas(response.data);
            setLastPage(response.meta.last_page);
            setTotal(response.meta.total);
        } catch {
            toast({ type: 'error', title: 'Gagal memuat data' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchAreas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const handleOpenModal = (area?: AreaParkir) => {
        if (area) {
            setEditingArea(area);
            setFormData({
                nama_area: area.nama_area,
                kapasitas: area.kapasitas,
            });
        } else {
            setEditingArea(null);
            setFormData({ nama_area: '', kapasitas: 0 });
        }
        setFormErrors({});
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors: Record<string, string> = {};
        if (!formData.nama_area.trim())
            errors.nama_area = 'Nama area wajib diisi';
        if (!formData.kapasitas || formData.kapasitas < 1)
            errors.kapasitas = 'Kapasitas minimal 1';
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setSubmitting(true);
        try {
            if (editingArea) {
                await areaParkirApi.update(editingArea.id_area, formData);
                toast({
                    type: 'success',
                    title: 'Berhasil',
                    message: 'Area parkir berhasil diupdate',
                });
            } else {
                await areaParkirApi.create(formData);
                toast({
                    type: 'success',
                    title: 'Berhasil',
                    message: 'Area parkir berhasil ditambahkan',
                });
            }
            setModalOpen(false);
            void fetchAreas();
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

    const handleDelete = async (area: AreaParkir) => {
        if (!confirm(`Hapus area "${area.nama_area}"?`)) return;
        try {
            await areaParkirApi.delete(area.id_area);
            toast({
                type: 'success',
                title: 'Berhasil',
                message: 'Area parkir berhasil dihapus',
            });
            void fetchAreas();
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
            key: 'nama_area',
            header: 'Nama Area',
            render: (row: AreaParkir) => (
                <span className="font-medium">{row.nama_area}</span>
            ),
        },
        {
            key: 'kapasitas',
            header: 'Kapasitas',
            render: (row: AreaParkir) => (
                <span className="font-mono">{row.kapasitas}</span>
            ),
        },
        {
            key: 'terisi',
            header: 'Terisi',
            render: (row: AreaParkir) => (
                <div className="flex items-center gap-2">
                    <span className="font-mono">{row.terisi}</span>
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{
                                width: `${Math.min(100, (row.terisi / row.kapasitas) * 100)}%`,
                            }}
                            className="h-full rounded-full bg-blue-500 transition-all duration-500"
                        />
                    </div>
                </div>
            ),
        },
        {
            key: 'tersedia',
            header: 'Tersedia',
            render: (row: AreaParkir) => (
                <span
                    className={cn(
                        'font-medium',
                        row.tersedia > 0 ? 'text-green-600' : 'text-red-600',
                    )}
                >
                    {row.tersedia}
                </span>
            ),
        },
        {
            key: 'created_at',
            header: 'Dibuat',
            render: (row: AreaParkir) =>
                row.created_at
                    ? new Date(row.created_at).toLocaleDateString('id-ID')
                    : '-',
        },
        {
            key: 'actions',
            header: 'Aksi',
            className: 'text-right',
            render: (row: AreaParkir) =>
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
                        Area Parkir
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Kelola area dan kapasitas parkir
                    </p>
                </div>
                {canManage && (
                    <Button
                        onClick={() => handleOpenModal()}
                        leftIcon={<Plus className="h-4 w-4" />}
                    >
                        Tambah Area
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
                    data={areas}
                    keyExtractor={(row) => row.id_area}
                    isLoading={isLoading}
                    emptyMessage="Tidak ada area parkir"
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
                            editingArea
                                ? 'Edit Area Parkir'
                                : 'Tambah Area Parkir'
                        }
                        size="md"
                    >
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Nama Area"
                                value={formData.nama_area}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        nama_area: e.target.value,
                                    })
                                }
                                error={formErrors.nama_area}
                                leftIcon={
                                    <Building2 className="h-5 w-5 text-slate-400" />
                                }
                                placeholder="Contoh: Area A - Depan"
                            />
                            <Input
                                label="Kapasitas"
                                type="number"
                                value={formData.kapasitas}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        kapasitas:
                                            parseInt(e.target.value) || 0,
                                    })
                                }
                                error={formErrors.kapasitas}
                                leftIcon={
                                    <Building2 className="h-5 w-5 text-slate-400" />
                                }
                                placeholder="Contoh: 50"
                                min={1}
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
                                    {editingArea ? 'Update' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
}
