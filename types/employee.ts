
export interface Employee {
  id: string;
  email: string;
  full_name?: string;
  department?: string;
  location?: string;
  tags?: string[];
  phone?: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface EmployeeMetadata {
  [key: string]: any;
}
