import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Plus, Building2, Loader2 } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { kendaraanApi, areaParkirApi, transaksiApi } from '../../lib/services';
import type { Kendaraan, AreaParkir } from '../../types';
import { cn } from '../../lib/utils';

export function MasukPage() {
    const { toast } = useToast();
    const [kendaraans, setKendaraans] = useState<Kendaraan[]>([]);
    const [areas, setAreas] = useState<AreaParkir[]>([]);
    const [isLoadingAreas, setIsLoadingAreas] = useState(true);
    const [selectedKendaraan, setSelectedKendaraan] =
        useState<Kendaraan | null>(null);

    const [formData, setFormData] = useState({
        plat_nomor: '',
        jenis_kendaraan: 'motor',
        warna: '',
        pemilik: '',
        id_area: '',
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const fetchKendaraans = async () => {
        try {
            const response = await kendaraanApi.getAll({ per_page: 100 });
            setKendaraans(response.data);
        } catch {
            toast({ type: 'error', title: 'Gagal memuat kendaraan' });
        }
    };

    const fetchAreas = async () => {
        try {
            const response = await areaParkirApi.getAll({ per_page: 100 });
            setAreas(response.data);
        } catch {
            toast({ type: 'error', title: 'Gagal memuat area' });
        } finally {
            setIsLoadingAreas(false);
        }
    };

    useEffect(() => {
        void fetchKendaraans();
        void fetchAreas();
    }, []);

    const handlePlatChange = (value: string) => {
        const upperValue = value.toUpperCase();
        setFormData({ ...formData, plat_nomor: upperValue });
        const found = kendaraans.find((k) => k.plat_nomor === upperValue);
        setSelectedKendaraan(found || null);
        if (found) {
            setFormData((prev) => ({
                ...prev,
                jenis_kendaraan: found.jenis_kendaraan,
                warna: found.warna,
                pemilik: found.pemilik,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors: Record<string, string> = {};
        if (!formData.plat_nomor.trim())
            errors.plat_nomor = 'Plat nomor wajib diisi';
        if (!formData.jenis_kendaraan)
            errors.jenis_kendaraan = 'Jenis kendaraan wajib dipilih';
        if (!formData.warna.trim()) errors.warna = 'Warna wajib diisi';
        if (!formData.pemilik.trim()) errors.pemilik = 'Pemilik wajib diisi';
        if (!formData.id_area) errors.id_area = 'Area parkir wajib dipilih';
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setSubmitting(true);
        try {
            await transaksiApi.masuk({
                plat_nomor: formData.plat_nomor,
                jenis_kendaraan: formData.jenis_kendaraan,
                warna: formData.warna,
                pemilik: formData.pemilik,
                id_area: parseInt(formData.id_area),
            });
            toast({
                type: 'success',
                title: 'Berhasil',
                message: 'Kendaraan berhasil masuk',
            });
            setFormData({
                plat_nomor: '',
                jenis_kendaraan: 'motor',
                warna: '',
                pemilik: '',
                id_area: '',
            });
            setSelectedKendaraan(null);
            void fetchAreas();
        } catch (error: unknown) {
            const axiosError = error as {
                response?: {
                    data?: {
                        message?: string;
                        errors?: Record<string, string[]>;
                    };
                };
            };
            if (axiosError.response?.data?.errors) {
                const newErrors: Record<string, string> = {};
                Object.entries(axiosError.response.data.errors).forEach(
                    ([key, val]) => {
                        newErrors[key] = val[0];
                    },
                );
                setFormErrors(newErrors);
            } else {
                toast({
                    type: 'error',
                    title: 'Gagal',
                    message:
                        axiosError.response?.data?.message ||
                        'Terjadi kesalahan',
                });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Kendaraan Masuk
                    </h1>
                    <p className="mt-1 text-slate-500">
                        Catat kendaraan yang masuk area parkir
                    </p>
                </div>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-3">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2"
                >
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                        <Car className="h-5 w-5 text-blue-500" />
                        Formulir Kendaraan Masuk
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                                label="Plat Nomor"
                                value={formData.plat_nomor}
                                onChange={(e) =>
                                    handlePlatChange(e.target.value)
                                }
                                error={formErrors.plat_nomor}
                                leftIcon={
                                    <Car className="h-5 w-5 text-slate-400" />
                                }
                                placeholder="B 1234 ABC"
                                maxLength={15}
                            />
                            <Select
                                label="Jenis Kendaraan"
                                value={formData.jenis_kendaraan}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        jenis_kendaraan: e.target.value,
                                    })
                                }
                                error={formErrors.jenis_kendaraan}
                                options={[
                                    { value: 'motor', label: 'Motor' },
                                    { value: 'mobil', label: 'Mobil' },
                                    { value: 'lainnya', label: 'Lainnya' },
                                ]}
                            />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                                label="Warna"
                                value={formData.warna}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        warna: e.target.value,
                                    })
                                }
                                error={formErrors.warna}
                                placeholder="Hitam"
                            />
                            <Input
                                label="Pemilik"
                                value={formData.pemilik}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        pemilik: e.target.value,
                                    })
                                }
                                error={formErrors.pemilik}
                                placeholder="Nama pemilik"
                            />
                        </div>
                        <Select
                            label="Area Parkir"
                            value={formData.id_area}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    id_area: e.target.value,
                                })
                            }
                            error={formErrors.id_area}
                            options={areas.map((a) => ({
                                value: String(a.id_area),
                                label: `${a.nama_area} (${a.tersedia}/${a.kapasitas})`,
                            }))}
                            placeholder="Pilih area parkir"
                            disabled={isLoadingAreas}
                        />

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="submit"
                                size="lg"
                                loading={submitting}
                                leftIcon={<Plus className="h-4 w-4" />}
                            >
                                Catat Masuk
                            </Button>
                        </div>
                    </form>

                    {selectedKendaraan && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4"
                        >
                            <p className="mb-2 text-sm font-medium text-blue-800">
                                Data kendaraan ditemukan:
                            </p>
                            <div className="grid gap-2 text-sm sm:grid-cols-2">
                                <span className="text-blue-700">
                                    Plat:{' '}
                                    <span className="font-mono">
                                        {selectedKendaraan.plat_nomor}
                                    </span>
                                </span>
                                <span className="text-blue-700">
                                    Jenis: {selectedKendaraan.jenis_kendaraan}
                                </span>
                                <span className="text-blue-700">
                                    Warna: {selectedKendaraan.warna}
                                </span>
                                <span className="text-blue-700">
                                    Pemilik: {selectedKendaraan.pemilik}
                                </span>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-xl border border-slate-200 bg-white p-6"
                >
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="flex items-center gap-2 font-semibold text-slate-900">
                            <Building2 className="h-5 w-5 text-green-500" />
                            Area Parkir
                        </h3>
                        {isLoadingAreas && (
                            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                        )}
                    </div>
                    <div className="max-h-96 space-y-2 overflow-y-auto">
                        {areas.map((area) => (
                            <motion.div
                                key={area.id_area}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className={cn(
                                    'rounded-lg border p-3 transition-colors',
                                    area.tersedia === 0
                                        ? 'border-red-200 bg-red-50'
                                        : 'border-slate-200 bg-slate-50 hover:bg-white',
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-900">
                                            {area.nama_area}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {area.tersedia} / {area.kapasitas}{' '}
                                            slot tersedia
                                        </p>
                                    </div>
                                    <div
                                        className={cn(
                                            'h-3 w-3 rounded-full',
                                            area.tersedia === 0
                                                ? 'bg-red-500'
                                                : area.tersedia < 5
                                                  ? 'bg-yellow-500'
                                                  : 'bg-green-500',
                                        )}
                                    />
                                </div>
                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${Math.min(100, (area.terisi / area.kapasitas) * 100)}%`,
                                        }}
                                        className={cn(
                                            'h-full rounded-full transition-all duration-500',
                                            area.tersedia === 0
                                                ? 'bg-red-500'
                                                : area.tersedia < 5
                                                  ? 'bg-yellow-500'
                                                  : 'bg-green-500',
                                        )}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
