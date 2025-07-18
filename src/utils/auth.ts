// 🔐 Sistem Login/Auth Basic untuk Seraphine Hybrid V1
// Kita akan pakai localStorage untuk simulasikan token

export const loginUser = (username: string, password: string): boolean => {
  if (username === 'admin' && password === 'seraphine') {
    localStorage.setItem('seraphine_token', 'active');
    return true;
  }
  return false;
};

export const isAuthenticated = (): boolean => {
  return typeof window !== 'undefined' && localStorage.getItem('seraphine_token') === 'active';
};

export const logoutUser = () => {
  localStorage.removeItem('seraphine_token');
};