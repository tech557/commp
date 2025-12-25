import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase/client';
import { Dialog, Button, Input, Label } from '../../ui/FormElements';
import { Type, Link } from 'lucide-react';

const packageSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
});

type PackageFormValues = z.infer<typeof packageSchema>;

interface PackageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (packageId: string) => void;
}

export const PackageDialog: React.FC<PackageDialogProps> = ({ isOpen, onClose, onSuccess }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
  });

  const title = watch('title');

  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [title, setValue]);

  const onSubmit = async (values: PackageFormValues) => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .insert([{
          title: values.title,
          slug: values.slug,
          status: 'draft'
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Package created successfully');
      onSuccess(data.id);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create package');
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Create New Package">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="title">Package Title</Label>
          <div className="relative group">
            <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input id="title" placeholder="e.g. Q1 Town Hall Update" className="pl-11" {...register('title')} />
          </div>
          {errors.title && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.title.message}</p>}
        </div>

        <div>
          <Label htmlFor="slug">Public URL Slug</Label>
          <div className="relative group">
            <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input id="slug" placeholder="q1-town-hall-update" className="pl-11" {...register('slug')} />
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 ml-1">
            The unique identifier used in the shareable link.
          </p>
          {errors.slug && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.slug.message}</p>}
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Create & Start Editing
          </Button>
        </div>
      </form>
    </Dialog>
  );
};