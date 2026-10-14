import { useEffect } from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';

export function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading: authLoading } = useAuth();
    const { toast } = useToast();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{
        username?: string;
        password?: string;
    }>({});
    const [isLoading, setIsLoading] = useState(false);

    const from =
        (location.state as { from?: Location })?.from?.pathname || '/dashboard';

    // Lock body scroll while on login page
    useEffect(() => {
        const originalStyle = window.document.body.style.overflow;
        const originalHeight = window.document.body.style.height;
        window.document.body.style.overflow = 'hidden';
        window.document.body.style.height = '100vh';
        return () => {
            window.document.body.style.overflow = originalStyle;
            window.document.body.style.height = originalHeight;
        };
    }, []);

    const validate = () => {
        const newErrors: { username?: string; password?: string } = {};
        if (!username.trim()) newErrors.username = 'Username wajib diisi';
        if (!password.trim()) newErrors.password = 'Password wajib diisi';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        try {
            await login(username, password);
            toast({
                type: 'success',
                title: 'Login Berhasil',
                message: 'Selamat datang kembali!',
            });
            void navigate(from, { replace: true });
        } catch (error: unknown) {
            const axiosError = error as {
                response?: {
                    data?: {
                        errors?: { username?: string[]; password?: string[] };
                    };
                };
            };
            if (axiosError.response?.data?.errors) {
                setErrors({
                    username: axiosError.response.data.errors.username?.[0],
                    password: axiosError.response.data.errors.password?.[0],
                });
            } else {
                toast({
                    type: 'error',
                    title: 'Login Gagal',
                    message: 'Username atau password salah',
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    // High-quality parked cars & motorcycles image from Unsplash
    const parkingImage =
        'https://images.unsplash.com/photo-1506520958913-5b20165e268a?w=1200&q=80';

    return (
        <div className="relative flex h-screen w-full overflow-hidden">
            {/* LEFT SIDE - Parking Image (Dominant 70% on desktop) */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="relative hidden lg:block lg:w-[70%]"
                aria-hidden="true"
            >
                <div className="absolute inset-0">
                    <img
                        src={parkingImage}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="eager"
                    />
                    {/* Subtle gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/30 via-transparent to-transparent" />
                </div>
            </motion.div>

            {/* MOBILE BACKGROUND IMAGE - Full screen, behind everything */}
            <div className="fixed inset-0 -z-10 lg:hidden" aria-hidden="true">
                <img
                    src={parkingImage}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="eager"
                />
                {/* Heavy dark overlay + blur effect */}
                <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xl" />
            </div>

            {/* RIGHT SIDE - Form Container (30% on desktop) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="relative flex w-full items-center justify-center p-6 lg:w-[30%] lg:px-10"
            >
                <div className="w-full max-w-md">
                    {/* Logo/Title */}
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            ParkirPro
                        </h1>
                        <p className="mt-2 text-base text-slate-500">
                            Masuk untuk melanjutkan
                        </p>
                    </div>

                    {/* White Card Container - Clean & Minimal */}
                    <div className="rounded-[40px] bg-white p-8 shadow-xl ring-1 ring-slate-200 lg:shadow-2xl">
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                            noValidate
                        >
                            {/* Username Field */}
                            <div>
                                <label
                                    htmlFor="username"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Username
                                </label>
                                <div className="relative">
                                    <User
                                        className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400"
                                        aria-hidden="true"
                                    />
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                            if (errors.username)
                                                setErrors({
                                                    ...errors,
                                                    username: undefined,
                                                });
                                        }}
                                        placeholder="Masukkan username"
                                        autoComplete="username"
                                        disabled={isLoading || authLoading}
                                        className={`h-12 w-full rounded-xl border bg-white pr-4 pl-12 text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 ${errors.username ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : 'border-slate-200 hover:border-slate-300'} `}
                                        aria-invalid={
                                            errors.username ? 'true' : 'false'
                                        }
                                        aria-describedby={
                                            errors.username
                                                ? 'username-error'
                                                : undefined
                                        }
                                    />
                                </div>
                                {errors.username && (
                                    <p
                                        id="username-error"
                                        className="mt-1.5 text-sm text-red-500"
                                        role="alert"
                                    >
                                        {errors.username}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400"
                                        aria-hidden="true"
                                    />
                                    <input
                                        id="password"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (errors.password)
                                                setErrors({
                                                    ...errors,
                                                    password: undefined,
                                                });
                                        }}
                                        placeholder="Masukkan password"
                                        autoComplete="current-password"
                                        disabled={isLoading || authLoading}
                                        className={`h-12 w-full rounded-xl border bg-white pr-14 pl-12 text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 ${errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : 'border-slate-200 hover:border-slate-300'} `}
                                        aria-invalid={
                                            errors.password ? 'true' : 'false'
                                        }
                                        aria-describedby={
                                            errors.password
                                                ? 'password-error'
                                                : undefined
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                                        aria-label={
                                            showPassword
                                                ? 'Sembunyikan password'
                                                : 'Tampilkan password'
                                        }
                                        aria-pressed={showPassword}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p
                                        id="password-error"
                                        className="mt-1.5 text-sm text-red-500"
                                        role="alert"
                                    >
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Login Button */}
                            <Button
                                type="submit"
                                className="h-12 w-full rounded-xl text-base font-semibold shadow-sm transition-all duration-200 hover:shadow-md"
                                size="lg"
                                loading={isLoading || authLoading}
                            >
                                {isLoading || authLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    'Masuk'
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Footer note - Updated */}
                    <p className="mt-6 text-center text-xs text-slate-400">
                        Website ini dibuat oleh Muh.Mufli Khalid Lapa
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
