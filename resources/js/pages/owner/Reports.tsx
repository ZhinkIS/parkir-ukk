import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Download,
    TrendingUp,
    DollarSign,
    FileText,
    Filter,
    Car,
} from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { transaksiApi } from '../../lib/services';
import type { Transaksi } from '../../types';
import { cn } from '../../lib/utils';

export function ReportsPage() {
    const { toast } = useToast();
    const [summary, setSummary] = useState({
        totalPendapatan: 0,
        totalTransaksi: 0,
        rataRataHarian: 0,
        kendaraanMasuk: 0,
    });
    const [transaksis, setTransaksis] = useState<Transaksi[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingSummary, setIsLoadingSummary] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchSummary = async () => {
        setIsLoadingSummary(true);
        try {
            const params: Record<string, string> = {};
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;

            // Get all transactions for summary
            const response = await transaksiApi.getAll({
                ...params,
                per_page: 1000,
                status: 'keluar',
            });
            const data = response.data;

            const totalPendapatan = data.reduce(
                (sum, t) => sum + t.biaya_total,
                0,
            );
            const totalTransaksi = data.length;
            const uniqueDays = new Set(
                data.map((t) => t.waktu_keluar?.split('T')[0]),
            ).size;
            const rataRataHarian =
                uniqueDays > 0 ? totalPendapatan / uniqueDays : 0;
            const kendaraanMasuk = data.length; // Simplified

            setSummary({
                totalPendapatan,
                totalTransaksi,
                rataRataHarian,
                kendaraanMasuk,
            });
        } catch {
            toast({ type: 'error', title: 'Gagal memuat ringkasan' });
        } finally {
            setIsLoadingSummary(false);
        }
    };

    const fetchTransaksis = async () => {
        setIsLoading(true);
        try {
            const params: Record<string, string | number> = {
                page: currentPage,
                per_page: 15,
                status: 'keluar',
            };
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;

            const response = await transaksiApi.getAll(params);
            setTransaksis(response.data);
            setLastPage(response.meta.last_page);
            setTotal(response.meta.total);
        } catch {
            toast({ type: 'error', title: 'Gagal memuat data' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchSummary();
        void fetchTransaksis();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, startDate, endDate]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const handleFilter = () => {
        setCurrentPage(1);
    };

    const columns = [
        {
            key: 'waktu_keluar',
            header: 'Waktu Keluar',
            render: (row: Transaksi) => (
                <span className="font-mono text-sm whitespace-nowrap">
                    {row.waktu_keluar
                        ? new Date(row.waktu_keluar).toLocaleString('id-ID')
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
            key: 'durasi',
            header: 'Durasi',
            render: (row: Transaksi) => {
                if (!row.waktu_masuk || !row.waktu_keluar) return '-';
                const masuk = new Date(row.waktu_masuk);
                const keluar = new Date(row.waktu_keluar);
                const diffMs = keluar.getTime() - masuk.getTime();
                const hours = Math.floor(diffMs / (1000 * 60 * 60));
                const minutes = Math.floor(
                    (diffMs % (1000 * 60 * 60)) / (1000 * 60),
                );
                return `${hours}j ${minutes}m`;
            },
        },
        {
            key: 'biaya_total',
            header: 'Biaya',
            render: (row: Transaksi) => (
                <span className="font-mono font-medium text-green-600">
                    {formatCurrency(row.biaya_total)}
                </span>
            ),
        },
        {
            key: 'area',
            header: 'Area',
            render: (row: Transaksi) => row.area?.nama_area || '-',
        },
        {
            key: 'petugas',
            header: 'Petugas',
            render: (row: Transaksi) => row.user?.nama_lengkap || '-',
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
                        Laporan Transaksi
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Rekap pendapatan dan statistik parkir
                    </p>
                </div>
                <Button
                    variant="outline"
                    leftIcon={<Download className="h-4 w-4" />}
                >
                    Export Laporan
                </Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-slate-200 bg-white p-4"
            >
                <div className="mb-4 flex flex-col gap-4 sm:flex-row">
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        leftIcon={
                            <Calendar className="h-5 w-5 text-slate-400" />
                        }
                        placeholder="Dari tanggal"
                    />
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        leftIcon={
                            <Calendar className="h-5 w-5 text-slate-400" />
                        }
                        placeholder="Sampai tanggal"
                    />
                    <Button
                        onClick={handleFilter}
                        leftIcon={<Filter className="h-4 w-4" />}
                    >
                        Terapkan Filter
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-slate-200 bg-white p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Total Pendapatan
                                </p>
                                <p className="mt-1 text-2xl font-bold text-slate-900">
                                    {isLoadingSummary
                                        ? '...'
                                        : formatCurrency(
                                              summary.totalPendapatan,
                                          )}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="rounded-xl border border-slate-200 bg-white p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Total Transaksi
                                </p>
                                <p className="mt-1 text-2xl font-bold text-slate-900">
                                    {isLoadingSummary
                                        ? '...'
                                        : summary.totalTransaksi.toLocaleString(
                                              'id-ID',
                                          )}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-xl border border-slate-200 bg-white p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Rata-rata/Hari
                                </p>
                                <p className="mt-1 text-2xl font-bold text-slate-900">
                                    {isLoadingSummary
                                        ? '...'
                                        : formatCurrency(
                                              summary.rataRataHarian,
                                          )}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                                <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="rounded-xl border border-slate-200 bg-white p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Kendaraan Keluar
                                </p>
                                <p className="mt-1 text-2xl font-bold text-slate-900">
                                    {isLoadingSummary
                                        ? '...'
                                        : summary.kendaraanMasuk.toLocaleString(
                                              'id-ID',
                                          )}
                                </p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                                <Car className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-slate-200 bg-white"
            >
                <div className="border-b border-slate-200 p-4">
                    <h3 className="font-semibold text-slate-900">
                        Detail Transaksi
                    </h3>
                </div>

                <Table
                    columns={columns}
                    data={transaksis}
                    keyExtractor={(row) => row.id_parkir}
                    isLoading={isLoading}
                    emptyMessage="Tidak ada data transaksi"
                />

                <div className="border-t border-slate-200 px-4 py-4">
                    <Pagination
                        currentPage={currentPage}
                        lastPage={lastPage}
                        onPageChange={setCurrentPage}
                        total={total}
                        perPage={15}
                    />
                </div>
            </motion.div>
        </div>
    );
}
