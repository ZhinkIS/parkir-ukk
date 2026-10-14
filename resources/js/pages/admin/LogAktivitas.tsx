import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Download } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { logAktivitasApi } from '../../lib/services';
import type { LogAktivitas } from '../../types';

export function LogAktivitasPage() {
    const { toast } = useToast();

    const [logs, setLogs] = useState<LogAktivitas[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const params: Record<string, string | number> = {
                page: currentPage,
                per_page: 15,
            };
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;
            if (search) params.search = search;
            const response = await logAktivitasApi.getAll(params);
            setLogs(response.data);
            setLastPage(response.meta.last_page);
            setTotal(response.meta.total);
        } catch {
            toast({ type: 'error', title: 'Gagal memuat data' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchLogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, startDate, endDate, search]);

    const handleFilter = () => {
        setCurrentPage(1);
    };

    const columns = [
        {
            key: 'waktu_aktivitas',
            header: 'Waktu',
            render: (row: LogAktivitas) => (
                <span className="font-mono text-sm whitespace-nowrap">
                    {row.waktu_aktivitas
                        ? new Date(row.waktu_aktivitas).toLocaleString('id-ID')
                        : '-'}
                </span>
            ),
        },
        {
            key: 'user',
            header: 'User',
            render: (row: LogAktivitas) => (
                <div>
                    <p className="font-medium">
                        {row.user?.nama_lengkap || 'Unknown'}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">
                        {row.user?.role || '-'}
                    </p>
                </div>
            ),
        },
        {
            key: 'aktivitas',
            header: 'Aktivitas',
            render: (row: LogAktivitas) => (
                <span className="text-slate-700">{row.aktivitas}</span>
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
                        Log Aktivitas
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Riwayat aktivitas semua user
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
                            placeholder="Cari aktivitas..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            leftIcon={
                                <Search className="h-5 w-5 text-slate-400" />
                            }
                        />
                    </div>
                    <div className="flex gap-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Dari Tanggal
                            </label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                leftIcon={
                                    <Calendar className="h-5 w-5 text-slate-400" />
                                }
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Sampai Tanggal
                            </label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                leftIcon={
                                    <Calendar className="h-5 w-5 text-slate-400" />
                                }
                            />
                        </div>
                        <Button
                            onClick={handleFilter}
                            leftIcon={<Filter className="h-4 w-4" />}
                        >
                            Filter
                        </Button>
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={logs}
                    keyExtractor={(row) => row.id_log}
                    isLoading={isLoading}
                    emptyMessage="Tidak ada log aktivitas"
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
        </div>
    );
}
