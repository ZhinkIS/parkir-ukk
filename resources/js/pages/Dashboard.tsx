import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
    Car,
    Users,
    Tag,
    Building2,
    DollarSign,
    Clock,
    TrendingUp,
    FileText,
} from 'lucide-react';
import { cn } from '../lib/utils';

const statCards = {
    admin: [
        {
            name: 'Total User',
            value: '12',
            icon: Users,
            color: 'bg-blue-500',
            href: '/dashboard/users',
        },
        {
            name: 'Tarif Aktif',
            value: '3',
            icon: Tag,
            color: 'bg-green-500',
            href: '/dashboard/tarif',
        },
        {
            name: 'Area Parkir',
            value: '3',
            icon: Building2,
            color: 'bg-purple-500',
            href: '/dashboard/areas',
        },
        {
            name: 'Kendaraan',
            value: '156',
            icon: Car,
            color: 'bg-orange-500',
            href: '/dashboard/kendaraan',
        },
    ],
    petugas: [
        {
            name: 'Kendaraan Masuk',
            value: '23',
            icon: Car,
            color: 'bg-blue-500',
            href: '/dashboard/masuk',
        },
        {
            name: 'Kendaraan Keluar',
            value: '18',
            icon: Car,
            color: 'bg-green-500',
            href: '/dashboard/keluar',
        },
        {
            name: 'Parkir Aktif',
            value: '5',
            icon: Building2,
            color: 'bg-yellow-500',
            href: '/dashboard/keluar',
        },
        {
            name: 'Pendapatan Hari Ini',
            value: 'Rp 1.250.000',
            icon: DollarSign,
            color: 'bg-purple-500',
            href: '/dashboard/transaksi',
        },
    ],
    owner: [
        {
            name: 'Total Pendapatan',
            value: 'Rp 45.000.000',
            icon: DollarSign,
            color: 'bg-green-500',
            href: '/dashboard/reports',
        },
        {
            name: 'Transaksi Bulan Ini',
            value: '1.234',
            icon: FileText,
            color: 'bg-blue-500',
            href: '/dashboard/reports',
        },
        {
            name: 'Rata-rata/Hari',
            value: 'Rp 1.500.000',
            icon: TrendingUp,
            color: 'bg-purple-500',
            href: '/dashboard/reports',
        },
        {
            name: 'Area Terpadat',
            value: 'Area A - 85%',
            icon: Building2,
            color: 'bg-orange-500',
            href: '/dashboard/reports',
        },
    ],
};

const quickActions = {
    admin: [
        {
            name: 'Kelola User',
            href: '/dashboard/users',
            icon: Users,
            color: 'bg-purple-100 text-purple-600',
        },
        {
            name: 'Atur Tarif',
            href: '/dashboard/tarif',
            icon: Tag,
            color: 'bg-green-100 text-green-600',
        },
        {
            name: 'Kelola Area',
            href: '/dashboard/areas',
            icon: Building2,
            color: 'bg-blue-100 text-blue-600',
        },
        {
            name: 'Data Kendaraan',
            href: '/dashboard/kendaraan',
            icon: Car,
            color: 'bg-orange-100 text-orange-600',
        },
    ],
    petugas: [
        {
            name: 'Input Masuk',
            href: '/dashboard/masuk',
            icon: Car,
            color: 'bg-blue-100 text-blue-600',
        },
        {
            name: 'Proses Keluar',
            href: '/dashboard/keluar',
            icon: Car,
            color: 'bg-green-100 text-green-600',
        },
        {
            name: 'Cetak Struk',
            href: '/dashboard/struk',
            icon: FileText,
            color: 'bg-purple-100 text-purple-600',
        },
        {
            name: 'Riwayat',
            href: '/dashboard/transaksi',
            icon: Clock,
            color: 'bg-orange-100 text-orange-600',
        },
    ],
    owner: [
        {
            name: 'Laporan Harian',
            href: '/dashboard/reports',
            icon: FileText,
            color: 'bg-blue-100 text-blue-600',
        },
        {
            name: 'Laporan Bulanan',
            href: '/dashboard/reports',
            icon: FileText,
            color: 'bg-green-100 text-green-600',
        },
        {
            name: 'Export Data',
            href: '/dashboard/reports',
            icon: TrendingUp,
            color: 'bg-purple-100 text-purple-600',
        },
        {
            name: 'Statistik',
            href: '/dashboard/reports',
            icon: TrendingUp,
            color: 'bg-orange-100 text-orange-600',
        },
    ],
};

export function Dashboard() {
    const { user } = useAuth();
    const role = user?.role || 'admin';
    const cards = statCards[role as keyof typeof statCards] || statCards.admin;
    const actions =
        quickActions[role as keyof typeof quickActions] || quickActions.admin;

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
                {cards.map((card, index) => (
                    <motion.div
                        key={card.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                        className="cursor-pointer rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    {card.name}
                                </p>
                                <p className="mt-1 text-2xl font-bold text-slate-900">
                                    {card.value}
                                </p>
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
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="rounded-xl border border-slate-200 bg-white p-6"
            >
                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                    Akses Cepat
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {actions.map((item, index) => (
                        <motion.a
                            key={item.name}
                            href={item.href}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.3,
                                delay: 0.2 + index * 0.05,
                            }}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 transition-colors hover:bg-slate-50"
                        >
                            <div
                                className={cn(
                                    'flex h-10 w-10 items-center justify-center rounded-lg',
                                    item.color,
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                            </div>
                            <span className="font-medium text-slate-700">
                                {item.name}
                            </span>
                        </motion.a>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
