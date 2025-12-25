export type BlockType = 'text' | 'image' | 'poll' | 'header';

export interface ContentBlock {
  id: string;
  package_id: string;
  type: BlockType;
  content: Record<string, any>;
  sort_order: number;
}

export interface Package {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  created_at: string;
  global_styles?: Record<string, any>;
}