import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Car,
    Users,
    Tag,
    Building2,
    DollarSign,
    TrendingUp,
    FileText,
    AlertCircle,
    RefreshCw,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { dashboardApi } from '../lib/services';
import { useToast } from '../components/ui/Toast';
import type { DashboardStats } from '../types';

interface StatCardConfig {
    name: string;
    key: string;
    icon: React.ElementType;
    color: string;
    href: string;
    isCurrency?: boolean;
}

const statCardConfig: Record<'admin' | 'petugas' | 'owner', StatCardConfig[]> =
    {
        admin: [
            {
                name: 'Total User',
                key: 'total_users',
                icon: Users,
                color: 'bg-blue-500',
                href: '/dashboard/users',
            },
            {
                name: 'Tarif Aktif',
                key: 'total_tarif',
                icon: Tag,
                color: 'bg-green-500',
                href: '/dashboard/tarif',
            },
            {
                name: 'Area Parkir',
                key: 'total_area_parkir',
                icon: Building2,
                color: 'bg-purple-500',
                href: '/dashboard/areas',
            },
            {
                name: 'Kendaraan',
                key: 'total_kendaraan',
                icon: Car,
                color: 'bg-orange-500',
                href: '/dashboard/kendaraan',
            },
        ],
        petugas: [
            {
                name: 'Kendaraan Masuk',
                key: 'kendaraan_masuk_today',
                icon: Car,
                color: 'bg-blue-500',
                href: '/dashboard/masuk',
            },
            {
                name: 'Kendaraan Keluar',
                key: 'kendaraan_keluar_today',
                icon: Car,
                color: 'bg-green-500',
                href: '/dashboard/keluar',
            },
            {
                name: 'Parkir Aktif',
                key: 'parkir_aktif',
                icon: Building2,
                color: 'bg-yellow-500',
                href: '/dashboard/keluar',
            },
            {
                name: 'Pendapatan Hari Ini',
                key: 'pendapatan_today',
                icon: DollarSign,
                color: 'bg-purple-500',
                href: '/dashboard/transaksi',
                isCurrency: true,
            },
        ],
        owner: [
            {
                name: 'Total Pendapatan',
                key: 'total_pendapatan',
                icon: DollarSign,
                color: 'bg-green-500',
                href: '/dashboard/reports',
                isCurrency: true,
            },
            {
                name: 'Transaksi Bulan Ini',
                key: 'transaksi_bulan_ini',
                icon: FileText,
                color: 'bg-blue-500',
                href: '/dashboard/reports',
            },
            {
                name: 'Rata-rata/Hari',
                key: 'rata_rata_per_hari',
                icon: TrendingUp,
                color: 'bg-purple-500',
                href: '/dashboard/reports',
                isCurrency: true,
            },
            {
                name: 'Area Terpadat',
                key: 'area_terpadat',
                icon: Building2,
                color: 'bg-orange-500',
                href: '/dashboard/reports',
            },
        ],
    };

// Dummy activity data for the recent activity table - matching LogAktivitas page format
const recentActivities = [
    {
        time: '16/10/2026, 08.30.12',
        user: { name: 'Ahmad Santoso', role: 'admin' },
        activity: 'Menambahkan user baru: Budi Wijaya (Petugas)',
    },
    {
        time: '16/10/2026, 08.15.45',
        user: { name: 'Siti Rahayu', role: 'admin' },
        activity: 'Mengubah tarif motor dari Rp 3.000/jam ke Rp 3.500/jam',
    },
    {
        time: '16/10/2026, 07.58.20',
        user: { name: 'Ahmad Santoso', role: 'admin' },
        activity: 'Menghapus area parkir "Area C - Basement"',
    },
    {
        time: '16/10/2026, 07.42.10',
        user: { name: 'Dewi Lestari', role: 'petugas' },
        activity: 'Mencetak struk transaksi #TRX-20261016-0045',
    },
    {
        time: '16/10/2026, 07.30.00',
        user: { name: 'Ahmad Santoso', role: 'admin' },
        activity: 'Login ke sistem (Admin Dashboard)',
    },
];

export function Dashboard() {
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const role = user?.role || 'admin';
    const config =
        statCardConfig[role as keyof typeof statCardConfig] ||
        statCardConfig.admin;

    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await dashboardApi.getStats();
            console.log('Dashboard stats response:', response);
            setStats(response.data);
        } catch (err: unknown) {
            const axiosError = err as {
                response?: { status: number; data?: { message?: string } };
                message?: string;
            };
            console.error('Failed to fetch dashboard stats:', axiosError);
            if (axiosError.response?.status === 401) {
                setError('Sesi berakhir. Silakan login ulang.');
                toast({
                    type: 'error',
                    title: 'Sesi Berakhir',
                    message: 'Silakan login ulang untuk memuat data dashboard',
                });
                // Redirect to login after a short delay
                setTimeout(() => logout(), 2000);
            } else {
                setError(
                    axiosError.response?.data?.message ||
                        axiosError.message ||
                        'Gagal memuat data dashboard',
                );
                toast({
                    type: 'error',
                    title: 'Gagal Memuat Data',
                    message:
                        axiosError.response?.data?.message ||
                        'Terjadi kesalahan saat mengambil statistik',
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchStats();
    }, []);

    const formatValue = (
        value: number | string,
        isCurrency?: boolean,
    ): string => {
        if (isCurrency && typeof value === 'number') {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(value);
        }
        if (typeof value === 'number') {
            return new Intl.NumberFormat('id-ID').format(value);
        }
        return String(value);
    };

    const renderStatCard = (card: StatCardConfig, index: number) => {
        const roleStats = stats?.[role as keyof DashboardStats];
        const statValue = roleStats?.[card.key as keyof typeof roleStats];
        const displayValue = isLoading
            ? '...'
            : error
              ? '!'
              : formatValue(
                    (statValue ?? 0) as number | string,
                    card.isCurrency,
                );

        return (
            <motion.div
                key={card.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.4,
                    delay: 0.1 + index * 0.1,
                }}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">
                            {card.name}
                        </p>
                        <p className="mt-1 text-2xl font-bold text-slate-900">
                            {displayValue}
                        </p>
                        {error && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                <AlertCircle className="h-3 w-3" />
                                Gagal memuat
                            </p>
                        )}
                    </div>
                    <div
                        className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-xl',
                            card.color,
                        )}
                    >
                        <card.icon className="h-6 w-6 text-white" />
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Selamat datang, {user?.nama_lengkap} ({user?.role})
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span
                        className={cn(
                            'rounded-full px-3 py-1 text-sm font-medium',
                            role === 'admin' && 'bg-purple-100 text-purple-700',
                            role === 'petugas' && 'bg-blue-100 text-blue-700',
                            role === 'owner' && 'bg-green-100 text-green-700',
                        )}
                    >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
                {config.map((card, index) => renderStatCard(card, index))}
            </motion.div>

            {/* Error state banner */}
            {error && !isLoading && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4"
                >
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600" />
                        <p className="text-sm text-amber-800">{error}</p>
                    </div>
                    <button
                        onClick={fetchStats}
                        className="flex items-center gap-2 rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-200"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Coba Lagi
                    </button>
                </motion.div>
            )}

            {/* Recent Activity Log Card - Replaces "Akses Cepat" */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="rounded-xl border border-slate-200 bg-white p-6"
            >
                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                    Log Aktivitas Terbaru
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr className="border-b border-slate-200">
                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-slate-500 uppercase">
                                    WAKTU
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-slate-500 uppercase">
                                    USER
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-slate-500 uppercase">
                                    AKTIVITAS
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {recentActivities.map((activity, index) => (
                                <tr
                                    key={index}
                                    className="transition-colors hover:bg-slate-50"
                                >
                                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-slate-600">
                                        {activity.time}
                                    </td>
                                    <td className="px-4 py-3 text-slate-900">
                                        <p className="font-medium">
                                            {activity.user.name}
                                        </p>
                                        <p className="text-xs text-slate-500 capitalize">
                                            {activity.user.role}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3 text-slate-700">
                                        {activity.activity}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
