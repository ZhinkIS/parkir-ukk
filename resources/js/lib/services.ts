import type { AxiosResponse } from 'axios';
import api from '../lib/api';
import type {
    User,
    Tarif,
    AreaParkir,
    Kendaraan,
    Transaksi,
    LogAktivitas,
    DashboardStats,
    PaginatedResponse,
    ApiResponse,
    LoginResponse,
} from '../types';

const handleResponse = <T>(response: AxiosResponse<T>): T => response.data;

export const authApi = {
    login: (username: string, password: string) =>
        api
            .post<LoginResponse>('/login', { username, password })
            .then(handleResponse),
    logout: () => api.post<ApiResponse<null>>('/logout').then(handleResponse),
    me: () => api.get<ApiResponse<User>>('/user').then(handleResponse),
};

export const tarifApi = {
    getAll: (params?: { page?: number; per_page?: number; search?: string }) =>
        api
            .get<PaginatedResponse<Tarif>>('/tarif', { params })
            .then(handleResponse),
    create: (data: { jenis_kendaraan: string; tarif_per_jam: number }) =>
        api.post<{ data: Tarif }>('/tarif', data).then(handleResponse),
    update: (id: number, data: { tarif_per_jam: number }) =>
        api.put<{ data: Tarif }>(`/tarif/${id}`, data).then(handleResponse),
    delete: (id: number) =>
        api.delete<ApiResponse<null>>(`/tarif/${id}`).then(handleResponse),
};

export const areaParkirApi = {
    getAll: (params?: { page?: number; per_page?: number; search?: string }) =>
        api
            .get<PaginatedResponse<AreaParkir>>('/area-parkir', { params })
            .then(handleResponse),
    create: (data: { nama_area: string; kapasitas: number }) =>
        api
            .post<{ data: AreaParkir }>('/area-parkir', data)
            .then(handleResponse),
    update: (id: number, data: { nama_area: string; kapasitas: number }) =>
        api
            .put<{ data: AreaParkir }>(`/area-parkir/${id}`, data)
            .then(handleResponse),
    delete: (id: number) =>
        api
            .delete<ApiResponse<null>>(`/area-parkir/${id}`)
            .then(handleResponse),
};

export const kendaraanApi = {
    getAll: (params?: { page?: number; per_page?: number; search?: string }) =>
        api
            .get<PaginatedResponse<Kendaraan>>('/kendaraan', { params })
            .then(handleResponse),
    create: (data: {
        plat_nomor: string;
        jenis_kendaraan: string;
        warna: string;
        pemilik: string;
    }) =>
        api.post<{ data: Kendaraan }>('/kendaraan', data).then(handleResponse),
    update: (
        id: number,
        data: {
            plat_nomor: string;
            jenis_kendaraan: string;
            warna: string;
            pemilik: string;
        },
    ) =>
        api
            .put<{ data: Kendaraan }>(`/kendaraan/${id}`, data)
            .then(handleResponse),
    delete: (id: number) =>
        api.delete<ApiResponse<null>>(`/kendaraan/${id}`).then(handleResponse),
};

export const transaksiApi = {
    getAll: (params?: {
        page?: number;
        per_page?: number;
        status?: string;
        start_date?: string;
        end_date?: string;
        search?: string;
    }) =>
        api
            .get<PaginatedResponse<Transaksi>>('/transaksi', { params })
            .then(handleResponse),
    masuk: (data: {
        plat_nomor: string;
        jenis_kendaraan: string;
        warna: string;
        pemilik: string;
        id_area: number;
    }) =>
        api
            .post<{ data: Transaksi }>('/transaksi/masuk', data)
            .then(handleResponse),
    keluar: (id: number) =>
        api
            .post<{ data: Transaksi }>(`/transaksi/${id}/keluar`)
            .then(handleResponse),
    struk: (id: number) =>
        api
            .get<{ data: Transaksi }>(`/transaksi/${id}/struk`)
            .then(handleResponse),
};

export const logAktivitasApi = {
    getAll: (params?: {
        page?: number;
        per_page?: number;
        user_id?: number;
        start_date?: string;
        end_date?: string;
        search?: string;
    }) =>
        api
            .get<PaginatedResponse<LogAktivitas>>('/log-aktivitas', { params })
            .then(handleResponse),
};

export const userApi = {
    getAll: (params?: { page?: number; per_page?: number; search?: string }) =>
        api
            .get<PaginatedResponse<User>>('/users', { params })
            .then(handleResponse),
    create: (data: {
        nama_lengkap: string;
        username: string;
        password: string;
        role: string;
    }) => api.post<{ data: User }>('/users', data).then(handleResponse),
    update: (
        id: number,
        data: { nama_lengkap: string; username: string; role: string },
    ) => api.put<{ data: User }>(`/users/${id}`, data).then(handleResponse),
    delete: (id: number) =>
        api.delete<ApiResponse<null>>(`/users/${id}`).then(handleResponse),
};

export const dashboardApi = {
    getStats: () =>
        api
            .get<{ success: boolean; data: DashboardStats }>('/dashboard/stats')
            .then(handleResponse),
};
