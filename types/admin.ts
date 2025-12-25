
export type AdminRole = 'super_admin' | 'admin';

export interface AdminProfile {
  id: string;
  email: string;
  full_name?: string;
  role: AdminRole;
  company_id?: string;
  created_at?: string;
}
