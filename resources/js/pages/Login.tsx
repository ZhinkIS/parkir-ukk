import { useEffect } from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

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

    // Prevent body scroll on login page
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

    return (
        <div className="relative flex h-screen w-full overflow-hidden">
            {/* LEFT SIDE - Parking Background (65%) - Using img tag for reliable rendering */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="relative hidden lg:block lg:w-[65%]"
                aria-hidden="true"
            >
                <img
                    src="/images/parkir-background.jpg"
                    alt="Parking Background"
                    className="h-full w-full object-cover"
                />
            </motion.div>

            {/* MOBILE BACKGROUND - Full screen, behind everything */}
            <div className="fixed inset-0 -z-10 lg:hidden" aria-hidden="true">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(/images/bg-parkir.jpg)' }}
                />
                {/* Heavy dark overlay for mobile readability */}
                <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xl" />
            </div>

            {/* RIGHT SIDE - Form Container (35%) - Centered vertically */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="relative flex h-full flex-col items-center justify-center bg-white px-8 lg:w-[35%]"
            >
                <div className="w-full max-w-md">
                    {/* Logo/Title - Centered horizontally */}
                    <div className="mb-8 flex flex-col items-center text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            ParkirPro
                        </h1>
                        <p className="mt-2 text-base text-slate-500">
                            Masuk untuk melanjutkan
                        </p>
                    </div>

                    {/* Form Card - Smooth rounded corners, softer shadow */}
                    <div className="rounded-[32px] border border-gray-100 bg-white p-8 shadow-lg">
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                            noValidate
                        >
                            {/* Username Field - with SVG icon inside */}
                            <div>
                                <label
                                    htmlFor="username"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Username
                                </label>
                                <div className="relative">
                                    <svg
                                        className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    <Input
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
                                        className={`h-12 w-full rounded-xl border bg-white pr-4 pl-10 text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 ${errors.username ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : 'border-slate-200 hover:border-slate-300'} `}
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

                            {/* Password Field - with SVG icon inside */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <svg
                                        className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                    <Input
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
                                        className={`h-12 w-full rounded-xl border bg-white pr-12 pl-10 text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 ${errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : 'border-slate-200 hover:border-slate-300'} `}
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
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
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
                                Masuk
                            </Button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
