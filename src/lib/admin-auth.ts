import { cookies } from 'next/headers';

export function isAdminAuthenticated(): boolean {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) return false;

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const expected = Buffer.from(`admin:${adminPassword}`).toString('base64');
  return token === expected;
}
