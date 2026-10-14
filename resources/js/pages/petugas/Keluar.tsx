import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { transaksiApi } from '../../lib/services';
import type { Transaksi } from '../../types';
import { cn } from '../../lib/utils';

export function KeluarPage() {
    const { toast } = useToast();
    const [activeTransaksis, setActiveTransaksis] = useState<Transaksi[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [processingId, setProcessingId] = useState<number | null>(null);

    const fetchActive = async () => {
        setIsLoading(true);
        try {
            const response = await transaksiApi.getAll({
                status: 'masuk',
                per_page: 50,
            });
            setActiveTransaksis(response.data);
        } catch {
            toast({ type: 'error', title: 'Gagal memuat data' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchActive();
    }, []);

    const handleKeluar = async (transaksi: Transaksi) => {
        setProcessingId(transaksi.id_parkir);
        try {
            const response = await transaksiApi.keluar(transaksi.id_parkir);
            toast({
                type: 'success',
                title: 'Berhasil',
                message: `Kendaraan keluar. Biaya: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(response.data.biaya_total)}`,
            });
            void fetchActive();
        } catch (error: unknown) {
            const axiosError = error as {
                response?: { data?: { message?: string } };
            };
            toast({
                type: 'error',
                title: 'Gagal',
                message:
                    axiosError.response?.data?.message || 'Terjadi kesalahan',
            });
        } finally {
            setProcessingId(null);
        }
    };

    const columns = [
        {
            key: 'waktu_masuk',
            header: 'Waktu Masuk',
            render: (row: Transaksi) => (
                <span className="font-mono text-sm whitespace-nowrap">
                    {row.waktu_masuk
                        ? new Date(row.waktu_masuk).toLocaleString('id-ID')
                        : '-'}
                </span>
            ),
        },
        {
            key: 'plat_nomor',
            header: 'Plat Nomor',
            render: (row: Transaksi) => (
                <span className="font-mono font-medium">
                    {row.kendaraan?.plat_nomor || '-'}
                </span>
            ),
        },
        {
            key: 'jenis_kendaraan',
            header: 'Jenis',
            render: (row: Transaksi) => (
                <span
                    className={cn(
                        'rounded-full px-2 py-1 text-xs font-medium capitalize',
                        row.kendaraan?.jenis_kendaraan === 'motor' &&
                            'bg-blue-100 text-blue-700',
                        row.kendaraan?.jenis_kendaraan === 'mobil' &&
                            'bg-green-100 text-green-700',
                        row.kendaraan?.jenis_kendaraan === 'lainnya' &&
                            'bg-gray-100 text-gray-700',
                    )}
                >
                    {row.kendaraan?.jenis_kendaraan || '-'}
                </span>
            ),
        },
        {
            key: 'area',
            header: 'Area',
            render: (row: Transaksi) => row.area?.nama_area || '-',
        },
        {
            key: 'durasi',
            header: 'Durasi',
            render: (row: Transaksi) => {
                const masuk = new Date(row.waktu_masuk);
                const now = new Date();
                const diffMs = now.getTime() - masuk.getTime();
                const hours = Math.floor(diffMs / (1000 * 60 * 60));
                const minutes = Math.floor(
                    (diffMs % (1000 * 60 * 60)) / (1000 * 60),
                );
                return `${hours}j ${minutes}m`;
            },
        },
        {
            key: 'estimated_fee',
            header: 'Est. Biaya',
            render: (row: Transaksi) => (
                <span className="font-mono font-medium text-green-600">
                    {row.kendaraan && row.area ? 'Rp ...' : '-'}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Aksi',
            className: 'text-right',
            render: (row: Transaksi) => (
                <Button
                    size="sm"
                    onClick={() => handleKeluar(row)}
                    loading={processingId === row.id_parkir}
                    leftIcon={<CheckCircle className="h-4 w-4" />}
                >
                    Keluar
                </Button>
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
                        Kendaraan Keluar
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Proses kendaraan keluar dan hitung biaya parkir
                    </p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-slate-200 bg-white"
            >
                <div className="border-b border-slate-200 p-4">
                    <Input
                        placeholder="Cari plat nomor..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        leftIcon={<Search className="h-5 w-5 text-slate-400" />}
                    />
                </div>

                <Table
                    columns={columns}
                    data={activeTransaksis.filter(
                        (t) =>
                            t.kendaraan?.plat_nomor
                                ?.toLowerCase()
                                .includes(search.toLowerCase()) ||
                            t.kendaraan?.pemilik
                                ?.toLowerCase()
                                .includes(search.toLowerCase()),
                    )}
                    keyExtractor={(row) => row.id_parkir}
                    isLoading={isLoading}
                    emptyMessage="Tidak ada kendaraan yang sedang parkir"
                />
            </motion.div>

            {activeTransaksis.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-xl border border-slate-200 bg-white p-6"
                >
                    <h3 className="mb-4 font-semibold text-slate-900">
                        Ringkasan
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-lg bg-blue-50 p-4">
                            <p className="text-sm text-blue-600">
                                Total Kendaraan Aktif
                            </p>
                            <p className="text-2xl font-bold text-blue-900">
                                {activeTransaksis.length}
                            </p>
                        </div>
                        <div className="rounded-lg bg-green-50 p-4">
                            <p className="text-sm text-green-600">Motor</p>
                            <p className="text-2xl font-bold text-green-900">
                                {
                                    activeTransaksis.filter(
                                        (t) =>
                                            t.kendaraan?.jenis_kendaraan ===
                                            'motor',
                                    ).length
                                }
                            </p>
                        </div>
                        <div className="rounded-lg bg-purple-50 p-4">
                            <p className="text-sm text-purple-600">Mobil</p>
                            <p className="text-2xl font-bold text-purple-900">
                                {
                                    activeTransaksis.filter(
                                        (t) =>
                                            t.kendaraan?.jenis_kendaraan ===
                                            'mobil',
                                    ).length
                                }
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
