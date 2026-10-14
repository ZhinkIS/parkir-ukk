import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AuthProvider, { useAuth } from './context/AuthContext';
import { ToastContainer } from './components/ui/Toast';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Unauthorized } from './pages/Unauthorized';
import { MainLayout } from './components/layout/MainLayout';
import { UsersPage } from './pages/admin/Users';
import { TarifPage } from './pages/admin/Tarif';
import { AreaParkirPage } from './pages/admin/AreaParkir';
import { KendaraanPage } from './pages/admin/Kendaraan';
import { LogAktivitasPage } from './pages/admin/LogAktivitas';
import { MasukPage } from './pages/petugas/Masuk';
import { KeluarPage } from './pages/petugas/Keluar';
import { StrukPage } from './pages/petugas/Struk';
import { TransaksiPage as PetugasTransaksiPage } from './pages/petugas/Transaksi';
import { ReportsPage } from './pages/owner/Reports';
import { OwnerTransaksiPage } from './pages/owner/Transaksi';
import '../css/app.css';

function TransaksiRoute() {
    const { hasRole } = useAuth();

    if (hasRole(['owner'])) {
        return (
            <MainLayout title="Data Transaksi">
                <OwnerTransaksiPage />
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Riwayat Transaksi">
            <PetugasTransaksiPage />
        </MainLayout>
    );
}

function AppRoutes() {
    const { isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <MainLayout title="Dashboard">
                            <Dashboard />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* Admin Routes */}
            <Route
                path="/dashboard/users"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <MainLayout title="Manajemen User">
                            <UsersPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/tarif"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <MainLayout title="Tarif Parkir">
                            <TarifPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/areas"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <MainLayout title="Area Parkir">
                            <AreaParkirPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/kendaraan"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <MainLayout title="Data Kendaraan">
                            <KendaraanPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/logs"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <MainLayout title="Log Aktivitas">
                            <LogAktivitasPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* Petugas Routes */}
            <Route
                path="/dashboard/masuk"
                element={
                    <ProtectedRoute allowedRoles={['petugas', 'admin']}>
                        <MainLayout title="Kendaraan Masuk">
                            <MasukPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/keluar"
                element={
                    <ProtectedRoute allowedRoles={['petugas', 'admin']}>
                        <MainLayout title="Kendaraan Keluar">
                            <KeluarPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/struk"
                element={
                    <ProtectedRoute allowedRoles={['petugas', 'admin']}>
                        <MainLayout title="Cetak Struk">
                            <StrukPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* Owner Routes */}
            <Route
                path="/dashboard/reports"
                element={
                    <ProtectedRoute allowedRoles={['owner', 'admin']}>
                        <MainLayout title="Laporan Transaksi">
                            <ReportsPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* Shared transaksi route: petugas/admin see riwayat, owner sees rincian */}
            <Route
                path="/dashboard/transaksi"
                element={
                    <ProtectedRoute
                        allowedRoles={['petugas', 'admin', 'owner']}
                    >
                        <TransaksiRoute />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <ToastContainer>
                <AuthProvider>
                    <AnimatePresence mode="wait">
                        <AppRoutes />
                    </AnimatePresence>
                </AuthProvider>
            </ToastContainer>
        </BrowserRouter>
    );
}
