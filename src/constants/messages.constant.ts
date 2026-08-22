export const HTTP_MESSAGES = {
  SUCCESS: {
    FETCH_LIST: (resource: string) =>
      `Daftar data ${resource} berhasil diambil`,
    FETCH_DETAIL: (resource: string) => `Data ${resource} berhasil diambil`,
    CREATED: (resource: string) => `Data ${resource} berhasil ditambahkan`,
    UPDATED: (resource: string) => `Data ${resource} berhasil diperbarui`,
    DELETED: (resource: string) => `Data ${resource} berhasil dihapus`,
  },

  ERROR: {
    NOT_FOUND: (resource: string) => `Data ${resource} tidak ditemukan`,
    CONFLICT: (resource: string, field: string) =>
      `${resource} dengan ${field} tersebut sudah terdaftar`,
    BAD_REQUEST: "Permintaan data tidak valid atau parameter salah",
    UNAUTHENTICATED: "Silakan login terlebih dahulu untuk mengakses layanan",
    FORBIDDEN: "Akses ditolak: Anda tidak memiliki hak izin",
    INTERNAL_SERVER_ERROR: "Terjadi kesalahan internal pada server",
  },
} as const
