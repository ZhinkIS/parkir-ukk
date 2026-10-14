import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Download, Eye, X } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { transaksiApi } from '../../lib/services';
import type { Transaksi } from '../../types';
import { cn } from '../../lib/utils';

export function TransaksiPage() {
    const { toast } = useToast();
    const [transaksis, setTransaksis] = useState<Transaksi[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [statusFilter, setStatusFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [viewingDetail, setViewingDetail] = useState<Transaksi | null>(null);

    const fetchTransaksis = async () => {
        setIsLoading(true);
        try {
            const params: Record<string, string | number> = {
                page: currentPage,
                per_page: 15,
            };
            if (statusFilter) params.status = statusFilter;
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;
            if (search) params.search = search;

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
        void fetchTransaksis();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, statusFilter, startDate, endDate, search]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
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
            key: 'waktu_keluar',
            header: 'Waktu Keluar',
            render: (row: Transaksi) => (
                <span className="font-mono text-sm whitespace-nowrap">
                    {row.waktu_keluar
                        ? new Date(row.waktu_keluar).toLocaleString('id-ID')
                        : '<span class="text-slate-400">-</span>'}
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
            key: 'status',
            header: 'Status',
            render: (row: Transaksi) => (
                <span
                    className={cn(
                        'rounded-full px-2 py-1 text-xs font-medium',
                        row.status === 'masuk' &&
                            'bg-yellow-100 text-yellow-700',
                        row.status === 'keluar' &&
                            'bg-green-100 text-green-700',
                    )}
                >
                    {row.status}
                </span>
            ),
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
            key: 'actions',
            header: 'Detail',
            className: 'text-right',
            render: (row: Transaksi) => (
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setViewingDetail(row)}
                    leftIcon={<Eye className="h-4 w-4" />}
                >
                    Lihat
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
                        Riwayat Transaksi
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Lihat riwayat semua transaksi parkir
                    </p>
                </div>
                <Button
                    variant="outline"
                    leftIcon={<Download className="h-4 w-4" />}
                >
                    Export
                </Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-slate-200 bg-white p-4"
            >
                <div className="mb-4 flex flex-col gap-4 sm:flex-row">
                    <div className="flex-1">
                        <Input
                            placeholder="Cari plat nomor..."
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
                    <div className="flex flex-wrap gap-3">
                        <Select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            options={[
                                { value: '', label: 'Semua Status' },
                                { value: 'masuk', label: 'Masuk' },
                                { value: 'keluar', label: 'Keluar' },
                            ]}
                            placeholder="Filter Status"
                        />
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Dari tanggal"
                            leftIcon={
                                <Calendar className="h-5 w-5 text-slate-400" />
                            }
                        />
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Sampai tanggal"
                            leftIcon={
                                <Calendar className="h-5 w-5 text-slate-400" />
                            }
                        />
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearch('');
                                setStatusFilter('');
                                setStartDate('');
                                setEndDate('');
                                setCurrentPage(1);
                            }}
                            leftIcon={<Filter className="h-4 w-4" />}
                        >
                            Reset
                        </Button>
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={transaksis}
                    keyExtractor={(row) => row.id_parkir}
                    isLoading={isLoading}
                    emptyMessage="Tidak ada data transaksi"
                />

                <div className="border-t border-slate-200 pt-4">
                    <Pagination
                        currentPage={currentPage}
                        lastPage={lastPage}
                        onPageChange={setCurrentPage}
                        total={total}
                        perPage={15}
                    />
                </div>
            </motion.div>

            {viewingDetail && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setViewingDetail(null)}
                >
                    <motion.div
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-slate-200 p-6">
                            <h3 className="text-xl font-semibold text-slate-900">
                                Detail Transaksi
                            </h3>
                            <button
                                onClick={() => setViewingDetail(null)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="space-y-4 p-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm text-slate-500">
                                        No. Transaksi
                                    </p>
                                    <p className="font-mono font-medium">
                                        #{viewingDetail.id_parkir}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">
                                        Status
                                    </p>
                                    <span
                                        className={cn(
                                            'rounded-full px-2 py-1 text-xs font-medium',
                                            viewingDetail.status === 'masuk' &&
                                                'bg-yellow-100 text-yellow-700',
                                            viewingDetail.status === 'keluar' &&
                                                'bg-green-100 text-green-700',
                                        )}
                                    >
                                        {viewingDetail.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">
                                        Plat Nomor
                                    </p>
                                    <p className="font-mono font-medium">
                                        {viewingDetail.kendaraan?.plat_nomor ||
                                            '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">
                                        Jenis Kendaraan
                                    </p>
                                    <p className="capitalize">
                                        {viewingDetail.kendaraan
                                            ?.jenis_kendaraan || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">
                                        Warna
                                    </p>
                                    <p>
                                        {viewingDetail.kendaraan?.warna || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">
                                        Pemilik
                                    </p>
                                    <p>
                                        {viewingDetail.kendaraan?.pemilik ||
                                            '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">
                                        Area Parkir
                                    </p>
                                    <p>
                                        {viewingDetail.area?.nama_area || '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">
                                        Petugas
                                    </p>
                                    <p>
                                        {viewingDetail.user?.nama_lengkap ||
                                            '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">
                                        Waktu Masuk
                                    </p>
                                    <p>
                                        {viewingDetail.waktu_masuk
                                            ? new Date(
                                                  viewingDetail.waktu_masuk,
                                              ).toLocaleString('id-ID')
                                            : '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">
                                        Waktu Keluar
                                    </p>
                                    <p>
                                        {viewingDetail.waktu_keluar
                                            ? new Date(
                                                  viewingDetail.waktu_keluar,
                                              ).toLocaleString('id-ID')
                                            : '-'}
                                    </p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-sm text-slate-500">
                                        Durasi
                                    </p>
                                    <p>
                                        {viewingDetail.waktu_masuk &&
                                        viewingDetail.waktu_keluar
                                            ? (() => {
                                                  const m = new Date(
                                                      viewingDetail.waktu_masuk,
                                                  );
                                                  const k = new Date(
                                                      viewingDetail.waktu_keluar,
                                                  );
                                                  const d =
                                                      k.getTime() - m.getTime();
                                                  const h = Math.floor(
                                                      d / (1000 * 60 * 60),
                                                  );
                                                  const mi = Math.floor(
                                                      (d % (1000 * 60 * 60)) /
                                                          (1000 * 60),
                                                  );
                                                  return `${h} jam ${mi} menit`;
                                              })()
                                            : '-'}
                                    </p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-sm text-slate-500">
                                        Total Biaya
                                    </p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {formatCurrency(
                                            viewingDetail.biaya_total,
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
