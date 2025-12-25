import { z } from 'zod';

export const employeeSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid work email address'),
  department: z.string().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;