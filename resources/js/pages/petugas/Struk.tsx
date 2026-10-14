import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Printer } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { transaksiApi } from '../../lib/services';
import type { Transaksi } from '../../types';
import { cn } from '../../lib/utils';

export function StrukPage() {
    const { toast } = useToast();
    const [transaksis, setTransaksis] = useState<Transaksi[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [printingId, setPrintingId] = useState<number | null>(null);
    const [selectedTransaksi, setSelectedTransaksi] =
        useState<Transaksi | null>(null);

    const fetchTransaksis = async () => {
        setIsLoading(true);
        try {
            const response = await transaksiApi.getAll({
                page: currentPage,
                per_page: 10,
                status: 'keluar',
                search,
            });
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
    }, [currentPage, search]);

    const handlePrint = async (transaksi: Transaksi) => {
        setPrintingId(transaksi.id_parkir);
        try {
            const response = await transaksiApi.struk(transaksi.id_parkir);
            setSelectedTransaksi(response.data);

            // Wait for modal to open then print
            setTimeout(() => {
                window.print();
                setSelectedTransaksi(null);
            }, 300);
        } catch {
            toast({
                type: 'error',
                title: 'Gagal',
                message: 'Gagal memuat struk',
            });
        } finally {
            setPrintingId(null);
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
            key: 'actions',
            header: 'Aksi',
            className: 'text-right',
            render: (row: Transaksi) => (
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePrint(row)}
                    loading={printingId === row.id_parkir}
                    leftIcon={<Printer className="h-4 w-4" />}
                >
                    Cetak
                </Button>
            ),
        },
    ];

    // Print styles
    useEffect(() => {
        if (selectedTransaksi) {
            const printContent = `
        <div style="font-family: Arial, sans-serif; max-width: 300px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 20px;">PARKIR APP</h2>
            <p style="margin: 5px 0; font-size: 12px;">Sistem Parkir Terintegrasi</p>
            <hr style="border: 0; border-top: 1px dashed #000; margin: 10px 0;">
          </div>
          <div style="font-size: 13px; line-height: 1.8;">
            <div style="display: flex; justify-content: space-between;"><span>No. Transaksi</span><strong>#${selectedTransaksi.id_parkir}</strong></div>
            <div style="display: flex; justify-content: space-between;"><span>Plat Nomor</span><strong>${selectedTransaksi.kendaraan?.plat_nomor || '-'}</strong></div>
            <div style="display: flex; justify-content: space-between;"><span>Jenis</span><span>${selectedTransaksi.kendaraan?.jenis_kendaraan || '-'}</span></div>
            <div style="display: flex; justify-content: space-between;"><span>Warna</span><span>${selectedTransaksi.kendaraan?.warna || '-'}</span></div>
            <div style="display: flex; justify-content: space-between;"><span>Pemilik</span><span>${selectedTransaksi.kendaraan?.pemilik || '-'}</span></div>
            <hr style="border: 0; border-top: 1px dashed #000; margin: 10px 0;">
            <div style="display: flex; justify-content: space-between;"><span>Masuk</span><span>${selectedTransaksi.waktu_masuk ? new Date(selectedTransaksi.waktu_masuk).toLocaleString('id-ID') : '-'}</span></div>
            <div style="display: flex; justify-content: space-between;"><span>Keluar</span><span>${selectedTransaksi.waktu_keluar ? new Date(selectedTransaksi.waktu_keluar).toLocaleString('id-ID') : '-'}</span></div>
            <div style="display: flex; justify-content: space-between;"><span>Durasi</span><span>${
                selectedTransaksi.waktu_masuk && selectedTransaksi.waktu_keluar
                    ? (() => {
                          const m = new Date(selectedTransaksi.waktu_masuk);
                          const k = new Date(selectedTransaksi.waktu_keluar);
                          const d = k.getTime() - m.getTime();
                          const h = Math.floor(d / (1000 * 60 * 60));
                          const mi = Math.floor(
                              (d % (1000 * 60 * 60)) / (1000 * 60),
                          );
                          return `${h}j ${mi}m`;
                      })()
                    : '-'
            }</span></div>
            <div style="display: flex; justify-content: space-between;"><span>Area</span><span>${selectedTransaksi.area?.nama_area || '-'}</span></div>
            <div style="display: flex; justify-content: space-between;"><span>Petugas</span><span>${selectedTransaksi.user?.nama_lengkap || '-'}</span></div>
            <hr style="border: 0; border-top: 1px dashed #000; margin: 10px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold;"><span>TOTAL BIAYA</span><span>${formatCurrency(selectedTransaksi.biaya_total)}</span></div>
          </div>
          <div style="text-align: center; margin-top: 20px; font-size: 11px; color: #666;">
            <p>Terima kasih telah parkir di sini</p>
            <p>${new Date().toLocaleString('id-ID')}</p>
          </div>
        </div>
      `;

            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
          <html>
            <head>
              <title>Struk Parkir #${selectedTransaksi.id_parkir}</title>
              <style>
                @media print {
                  body { margin: 0; padding: 20px; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body onload="window.print(); window.close();">
              ${printContent}
            </body>
          </html>
        `);
                printWindow.document.close();
            }
        }
    }, [selectedTransaksi]);

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Cetak Struk
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Riwayat transaksi keluar dan cetak struk parkir
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
                    data={transaksis}
                    keyExtractor={(row) => row.id_parkir}
                    isLoading={isLoading}
                    emptyMessage="Tidak ada transaksi keluar"
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
        </div>
    );
}
