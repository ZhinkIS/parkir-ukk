import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Tag,
    Building2,
    Car,
    ListChecks,
    LogOut,
    FileText,
    BarChart2,
    ReceiptText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

const navigation = {
    admin: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Manajemen User', href: '/dashboard/users', icon: Users },
        { name: 'Tarif Parkir', href: '/dashboard/tarif', icon: Tag },
        { name: 'Area Parkir', href: '/dashboard/areas', icon: Building2 },
        { name: 'Data Kendaraan', href: '/dashboard/kendaraan', icon: Car },
        { name: 'Log Aktivitas', href: '/dashboard/logs', icon: ListChecks },
    ],
    petugas: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Kendaraan Masuk', href: '/dashboard/masuk', icon: Car },
        { name: 'Kendaraan Keluar', href: '/dashboard/keluar', icon: Car },
        { name: 'Cetak Struk', href: '/dashboard/struk', icon: ReceiptText },
        {
            name: 'Riwayat Transaksi',
            href: '/dashboard/transaksi',
            icon: ListChecks,
        },
    ],
    owner: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        {
            name: 'Laporan Transaksi',
            href: '/dashboard/reports',
            icon: BarChart2,
        },
        {
            name: 'Rincian Transaksi',
            href: '/dashboard/transaksi',
            icon: FileText,
        },
    ],
};

export function Sidebar() {
    const { user, logout, hasRole } = useAuth();
    const location = useLocation();

    const getNavItems = () => {
        if (hasRole(['admin'])) return navigation.admin;
        if (hasRole(['petugas'])) return navigation.petugas;
        if (hasRole(['owner'])) return navigation.owner;
        return [];
    };

    const navItems = getNavItems();

    return (
        <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-all duration-300">
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                        <Car className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-900">
                        ParkirApp
                    </span>
                </div>
            </div>

            <nav
                className="flex-1 space-y-1 overflow-y-auto px-4 py-6"
                aria-label="Main navigation"
            >
                {navItems.map((item) => {
                    const isActive =
                        location.pathname === item.href ||
                        (item.href !== '/dashboard' &&
                            location.pathname.startsWith(item.href));

                    return (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive: active }) =>
                                cn(
                                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
                                    active
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                                )
                            }
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 20,
                                }}
                            >
                                <item.icon
                                    className={cn(
                                        'h-5 w-5',
                                        isActive
                                            ? 'text-blue-500'
                                            : 'text-slate-400',
                                    )}
                                />
                            </motion.div>
                            <span>{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="border-t border-slate-200 p-4">
                <div className="mb-3 flex items-center gap-3 px-3 py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                        <span className="text-sm font-medium text-slate-700">
                            {user?.nama_lengkap?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">
                            {user?.nama_lengkap}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">
                            {user?.role}
                        </p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium',
                        'text-slate-600 transition-colors hover:bg-slate-50 hover:text-red-600',
                    )}
                >
                    <LogOut className="h-5 w-5" />
                    <span>Keluar</span>
                </button>
            </div>
        </aside>
    );
}
