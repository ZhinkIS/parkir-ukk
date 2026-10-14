import { motion } from 'framer-motion';
import { Menu, Bell, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
    onMenuClick: () => void;
    title: string;
}

export function Header({ onMenuClick, title }: HeaderProps) {
    const [darkMode, setDarkMode] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
            <div className="flex h-16 items-center justify-between px-6 lg:px-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:hidden"
                        aria-label="Buka menu"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-semibold text-slate-900 lg:text-2xl">
                        {title}
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        aria-label={darkMode ? 'Mode terang' : 'Mode gelap'}
                    >
                        {darkMode ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </button>

                    <div className="relative">
                        <button
                            onClick={() =>
                                setNotificationsOpen(!notificationsOpen)
                            }
                            className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                            aria-label="Notifikasi"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                        </button>

                        {notificationsOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white py-2 shadow-lg"
                            >
                                <div className="border-b border-slate-200 px-4 py-3">
                                    <h3 className="font-medium text-slate-900">
                                        Notifikasi
                                    </h3>
                                </div>
                                <div className="py-2">
                                    <p className="px-4 py-4 text-center text-sm text-slate-500">
                                        Tidak ada notifikasi baru
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
