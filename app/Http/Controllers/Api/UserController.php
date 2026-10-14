<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Models\TbUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = TbUser::query()->latest('id_user');

        if ($request->filled('search')) {
            $search = $request->string('search');

            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate($request->get('per_page', 15));

        return UserResource::collection($users);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:100',
            'username' => 'required|string|max:50|unique:tb_user,username',
            'password' => 'required|string|min:6',
            'role' => 'required|string|in:admin,petugas,owner',
        ]);

        $user = TbUser::create($validated);

        LogAktivitasController::log($request->user()->id_user, "Menambah user {$user->username}");

        return (new UserResource($user))->response()->setStatusCode(201);
    }

    public function show(TbUser $user): UserResource
    {
        return new UserResource($user);
    }

    public function update(Request $request, TbUser $user): UserResource
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:100',
            'username' => 'required|string|max:50|unique:tb_user,username,'.$user->id_user.',id_user',
            'role' => 'required|string|in:admin,petugas,owner',
            'password' => 'nullable|string|min:6',
        ]);

        $data = [
            'nama_lengkap' => $validated['nama_lengkap'],
            'username' => $validated['username'],
            'role' => $validated['role'],
        ];

        if (! empty($validated['password'])) {
            $data['password'] = $validated['password'];
        }

        $user->update($data);

        LogAktivitasController::log($request->user()->id_user, "Mengupdate user {$user->username}");

        return new UserResource($user);
    }

    public function destroy(Request $request, TbUser $user): JsonResponse
    {
        if ($request->user()->id_user === $user->id_user) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus akun sendiri',
            ], 400);
        }

        $username = $user->username;
        $user->delete();

        LogAktivitasController::log($request->user()->id_user, "Menghapus user {$username}");

        return response()->json(['success' => true, 'message' => 'User dihapus']);
    }
}
