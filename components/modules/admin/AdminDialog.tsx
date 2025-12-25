import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase/client';
import { Dialog, Button, Input, Label } from '../../ui/FormElements';
import { Mail, User, Shield, Building2 } from 'lucide-react';

const adminCreateSchema = z.object({
  full_name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password min 6 chars'),
  role: z.enum(['admin', 'super_admin']),
  company_id: z.string().optional()
});

type AdminCreateValues = z.infer<typeof adminCreateSchema>;

interface AdminDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminDialog: React.FC<AdminDialogProps> = ({ isOpen, onClose, onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AdminCreateValues>({
    resolver: zodResolver(adminCreateSchema),
    defaultValues: { role: 'admin' }
  });

  const onSubmit = async (values: AdminCreateValues) => {
    try {
      // 1. Create Supabase Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { full_name: values.full_name }
        }
      });

      if (authError) throw authError;

      // 2. Create entry in admins table (usually handled by trigger, but for manual override if needed)
      // Note: Assuming a trigger on auth.users inserts into public.admins
      // If no trigger, we update the profile manually
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('admins')
          .update({
            full_name: values.full_name,
            role: values.role,
            company_id: values.company_id?.toUpperCase()
          })
          .eq('id', authData.user.id);
        
        if (profileError) {
          // If update fails, the row might not exist yet if the trigger is slow
          // In real production, we'd use an edge function or more robust trigger
          toast.warning('Auth created, but profile update may require manual sync');
        }
      }

      toast.success('Admin provisioned successfully');
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Provisioning failed');
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Provision New Admin">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="full_name">Legal Name</Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input id="full_name" placeholder="ALEX MERCER" className="pl-11" {...register('full_name')} />
          </div>
          {errors.full_name && <p className="text-[10px] text-red-500 mt-1 font-black">{errors.full_name.message}</p>}
        </div>

        <div>
          <Label htmlFor="email">Access Identity (Email)</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input id="email" type="email" placeholder="ADMIN@DOTMENT.COM" className="pl-11" {...register('email')} />
          </div>
          {errors.email && <p className="text-[10px] text-red-500 mt-1 font-black">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="password">Security Code (Password)</Label>
          <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
          {errors.password && <p className="text-[10px] text-red-500 mt-1 font-black">{errors.password.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="role">Security Role</Label>
            <div className="relative">
              <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <select 
                {...register('role')}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-black dark:border-zinc-800 text-black dark:text-white rounded-none appearance-none outline-none text-xs font-black uppercase tracking-widest"
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor="company_id">Org Link</Label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input id="company_id" placeholder="DEPT-ID" className="pl-11" {...register('company_id')} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Abort
          </Button>
          <Button type="submit" loading={isSubmitting} variant="accent">
            Authorize Access
          </Button>
        </div>
      </form>
    </Dialog>
  );
};