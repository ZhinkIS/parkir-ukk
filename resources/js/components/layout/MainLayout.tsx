import { ReactNode, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { X } from 'lucide-react';

interface MainLayoutProps {
    title: string;
    children?: ReactNode;
}

export function MainLayout({ title, children }: MainLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />

            <div className="flex min-h-screen flex-col lg:pl-64">
                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                    title={title}
                />

                <AnimatePresence mode="wait">
                    <motion.main
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1 p-4 lg:p-8"
                    >
                        {children ?? <Outlet />}
                    </motion.main>
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                        aria-hidden="true"
                    />
                )}
                {sidebarOpen && (
                    <motion.aside
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 300,
                        }}
                        className="fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white lg:hidden"
                    >
                        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
                            <span className="text-lg font-bold text-slate-900">
                                Menu
                            </span>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                                aria-label="Tutup menu"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <Sidebar />
                    </motion.aside>
                )}
            </AnimatePresence>
        </div>
    );
}
