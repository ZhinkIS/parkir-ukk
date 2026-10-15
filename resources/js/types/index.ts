export interface User {
    id_user: number;
    nama_lengkap: string;
    username: string;
    role: 'admin' | 'petugas' | 'owner';
    created_at?: string;
    updated_at?: string;
}

export interface Tarif {
    id_tarif: number;
    jenis_kendaraan: 'motor' | 'mobil' | 'lainnya';
    tarif_per_jam: number;
    created_at?: string;
    updated_at?: string;
}

export interface AreaParkir {
    id_area: number;
    nama_area: string;
    kapasitas: number;
    terisi: number;
    tersedia: number;
    created_at?: string;
    updated_at?: string;
}

export interface Kendaraan {
    id_kendaraan: number;
    plat_nomor: string;
    jenis_kendaraan: 'motor' | 'mobil' | 'lainnya';
    warna: string;
    pemilik: string;
    created_at?: string;
    updated_at?: string;
}

export interface Transaksi {
    id_parkir: number;
    id_kendaraan: number;
    id_user: number;
    id_area: number;
    waktu_masuk: string;
    waktu_keluar: string | null;
    biaya_total: number;
    status: 'masuk' | 'keluar';
    kendaraan?: Kendaraan;
    user?: User;
    area?: AreaParkir;
    created_at?: string;
    updated_at?: string;
}

export interface LogAktivitas {
    id_log: number;
    id_user: number;
    aktivitas: string;
    waktu_aktivitas: string;
    user?: User;
    created_at?: string;
    updated_at?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: Record<string, string[]>;
}

export interface DashboardStats {
    admin: {
        total_users: number;
        total_tarif: number;
        total_area_parkir: number;
        total_kendaraan: number;
    };
    petugas: {
        kendaraan_masuk_today: number;
        kendaraan_keluar_today: number;
        parkir_aktif: number;
        pendapatan_today: number;
    };
    owner: {
        total_pendapatan: number;
        transaksi_bulan_ini: number;
        rata_rata_per_hari: number;
        area_terpadat: string;
    };
}
