import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { employeeSchema, EmployeeFormValues } from '../../../lib/schemas/employee';
import { supabase } from '../../../lib/supabase/client';
import { Employee } from '../../../types/employee';
import { Dialog, Button, Input, Label } from '../../ui/FormElements';
import { Mail, User, MapPin, Briefcase } from 'lucide-react';

interface EmployeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee?: Employee | null;
}

export const EmployeeDialog: React.FC<EmployeeDialogProps> = ({ isOpen, onClose, onSuccess, employee }) => {
  const isEdit = !!employee;
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
  });

  useEffect(() => {
    if (employee) {
      reset({
        full_name: employee.full_name || '',
        email: employee.email || '',
        department: employee.department || '',
        location: employee.location || '',
      });
    } else {
      reset({
        full_name: '',
        email: '',
        department: '',
        location: '',
      });
    }
  }, [employee, reset, isOpen]);

  const onSubmit = async (values: EmployeeFormValues) => {
    try {
      if (isEdit && employee) {
        const { error } = await supabase
          .from('employees')
          .update(values)
          .eq('id', employee.id);
        if (error) throw error;
        toast.success('Employee updated successfully');
      } else {
        const { error } = await supabase
          .from('employees')
          .insert([values]);
        if (error) throw error;
        toast.success('Employee added successfully');
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while saving.');
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Employee' : 'Add New Employee'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <div className="relative group">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input id="full_name" placeholder="John Doe" className="pl-11" {...register('full_name')} />
          </div>
          {errors.full_name && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.full_name.message}</p>}
        </div>

        <div>
          <Label htmlFor="email">Work Email</Label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input id="email" type="email" placeholder="john@company.com" className="pl-11" {...register('email')} />
          </div>
          {errors.email && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="department">Department</Label>
            <div className="relative group">
              <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <Input id="department" placeholder="Engineering" className="pl-11" {...register('department')} />
            </div>
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <div className="relative group">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <Input id="location" placeholder="New York" className="pl-11" {...register('location')} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isEdit ? 'Save Changes' : 'Create Employee'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};