/**
 * authService.ts
 * Module quản lý xác thực & phiên đăng nhập hệ thống SQLAB
 * Cơ chế bảo mật: Mã hóa băm một chiều SHA-256 (Web Crypto API)
 * TUYỆT ĐỐI KHÔNG LƯU VĂN BẢN GỐC (Zero Plaintext) của tài khoản và mật khẩu
 */

// Danh sách mã băm SHA-256 của các biến thể hợp lệ của tên người dùng
// (Bao gồm dạng có dấu chuẩn Unicode NFC, dạng chữ thường, dạng không dấu và viết liền)
const VALID_USER_HASHES = new Set<string>([
  'b2c70599fa4aedb222012f21619b66e7538b52835230f26bad25ec0f5fdabbde', // Chuẩn hóa NFC chữ thường có dấu
  '45f6eec5940d6f9201ed0ee66c006f463243818394533370fb201c46e8cf1102', // Chuẩn hóa không dấu có khoảng cách
  'e5b751fcba314d80659c870048d7abdf85b121c233001829a82ab6d5e67401f6', // Viết liền không dấu
  '831c569f41e72030cc67880184fee7d5fda249e9d4563cc3667a43d03d872092'  // Dạng nguyên bản hoa-thường
]);

// Mã băm SHA-256 của mật khẩu bảo vệ
const VALID_PASS_HASH = '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5';

const STORAGE_KEYS = {
  TOKEN: 'sqlab_auth_token_v1',
  USER_DISPLAY: 'sqlab_auth_user_name_v1',
  AUTH_TIME: 'sqlab_auth_time_v1'
};

/**
 * Tính mã băm SHA-256 từ chuỗi văn bản sử dụng Web Crypto API chuẩn
 */
export async function computeSha256(text: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Loại bỏ dấu tiếng Việt để tăng tính tương thích khi người dùng gõ
 */
export function removeVietnameseAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd');
}

export interface AuthVerificationResult {
  success: boolean;
  errorMessage?: string;
  displayName?: string;
}

/**
 * Xác thực thông tin đăng nhập không để lộ thông tin gốc
 */
export async function verifyTeacherCredentials(
  user: string,
  pass: string
): Promise<AuthVerificationResult> {
  const rawUser = (user || '').trim();
  const rawPass = (pass || '').trim();

  if (!rawUser || !rawPass) {
    return {
      success: false,
      errorMessage: 'Vui lòng điền đầy đủ Tên đăng nhập và Mật khẩu.'
    };
  }

  // 1. Kiểm tra mật khẩu qua SHA-256 hash
  const passHash = await computeSha256(rawPass);
  if (passHash !== VALID_PASS_HASH) {
    return {
      success: false,
      errorMessage: 'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!'
    };
  }

  // 2. Chuẩn hóa và kiểm tra tên người dùng qua các biểu diễn hash
  const userNfcLower = rawUser.normalize('NFC').toLowerCase();
  const userNoAccent = removeVietnameseAccents(rawUser).toLowerCase();
  const userCompact = userNoAccent.replace(/\s+/g, '');

  const [hashNfcLower, hashNoAccent, hashCompact, hashRaw] = await Promise.all([
    computeSha256(userNfcLower),
    computeSha256(userNoAccent),
    computeSha256(userCompact),
    computeSha256(rawUser)
  ]);

  const isUserValid =
    VALID_USER_HASHES.has(hashNfcLower) ||
    VALID_USER_HASHES.has(hashNoAccent) ||
    VALID_USER_HASHES.has(hashCompact) ||
    VALID_USER_HASHES.has(hashRaw);

  if (!isUserValid) {
    return {
      success: false,
      errorMessage: 'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!'
    };
  }

  // Xác thực thành công
  return {
    success: true,
    displayName: rawUser
  };
}

/**
 * Kiểm tra trạng thái đã đăng nhập hay chưa
 */
export function isAuthenticated(): boolean {
  try {
    const sessionToken = sessionStorage.getItem(STORAGE_KEYS.TOKEN);
    if (sessionToken) return true;

    const localToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (localToken) return true;
  } catch (e) {
    console.error('Lỗi kiểm tra xác thực:', e);
  }
  return false;
}

/**
 * Lấy tên người dùng đã đăng nhập để hiển thị
 */
export function getAuthenticatedUser(): string {
  try {
    return (
      sessionStorage.getItem(STORAGE_KEYS.USER_DISPLAY) ||
      localStorage.getItem(STORAGE_KEYS.USER_DISPLAY) ||
      'Giáo viên'
    );
  } catch {
    return 'Giáo viên';
  }
}

/**
 * Thiết lập phiên đăng nhập thành công
 */
export function setAuthenticatedSession(rememberMe: boolean, displayName: string): void {
  const token = 'token_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
  const authTime = Date.now().toString();

  try {
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER_DISPLAY, displayName);
      localStorage.setItem(STORAGE_KEYS.AUTH_TIME, authTime);
    } else {
      sessionStorage.setItem(STORAGE_KEYS.TOKEN, token);
      sessionStorage.setItem(STORAGE_KEYS.USER_DISPLAY, displayName);
      sessionStorage.setItem(STORAGE_KEYS.AUTH_TIME, authTime);
    }
  } catch (e) {
    console.error('Lỗi lưu phiên đăng nhập:', e);
  }
}

/**
 * Đăng xuất và xóa phiên làm việc
 */
export function logoutTeacher(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DISPLAY);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TIME);

    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER_DISPLAY);
    sessionStorage.removeItem(STORAGE_KEYS.AUTH_TIME);
  } catch (e) {
    console.error('Lỗi khi đăng xuất:', e);
  }
}
