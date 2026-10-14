import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export function Unauthorized() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const role = user?.role || '';

    const getRoleDashboard = () => (user ? '/dashboard' : '/login');

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center"
            >
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100"
                >
                    <Lock className="h-8 w-8 text-red-500" />
                </motion.div>

                <h1 className="mb-2 text-2xl font-bold text-slate-900">
                    Akses Ditolak
                </h1>
                <p className="mb-6 text-slate-500">
                    Anda tidak memiliki izin untuk mengakses halaman ini.
                    Halaman ini hanya dapat diakses oleh role tertentu.
                </p>

                <div className="mb-6 rounded-lg bg-slate-50 p-4">
                    <p className="text-sm text-slate-600">
                        Role Anda:{' '}
                        <span className="font-medium capitalize">{role}</span>
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        onClick={() => window.history.back()}
                        variant="secondary"
                        leftIcon={<ArrowLeft className="h-4 w-4" />}
                    >
                        Kembali
                    </Button>
                    <Button
                        onClick={() => navigate(getRoleDashboard())}
                        leftIcon={<Home className="h-4 w-4" />}
                    >
                        Ke Dashboard
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
