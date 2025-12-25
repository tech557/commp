import React, { useState, useEffect } from 'react';
import { ContentBlock, BlockType } from '../../../types/package';
import { BlockRenderer } from './BlockRenderer';
import { supabase } from '../../../lib/supabase/client';
import { toast } from 'sonner';
import { 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Plus, 
  Save, 
  Type, 
  AlignLeft, 
  BarChart2, 
  Image as ImageIcon,
  GripVertical
} from 'lucide-react';
import { Button } from '../../ui/FormElements';

interface BlockEditorProps {
  packageId: string;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({ packageId }) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBlocks();
  }, [packageId]);

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('package_id', packageId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setBlocks(data || []);
    } catch (err: any) {
      toast.error('Failed to load blocks');
    } finally {
      setLoading(false);
    }
  };

  const addBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      package_id: packageId,
      type,
      content: type === 'poll' ? { question: '', options: ['', ''] } : {},
      sort_order: blocks.length
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id).map((b, i) => ({ ...b, sort_order: i })));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;

    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    
    // Update sort orders
    const reordered = newBlocks.map((b, i) => ({ ...b, sort_order: i }));
    setBlocks(reordered);
  };

  const updateBlockContent = (id: string, content: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      
      // Delete existing blocks and insert new ones to maintain simple sync
      // Better production approach: upsert + delete missing IDs
      const { error: deleteError } = await supabase
        .from('content_blocks')
        .delete()
        .eq('package_id', packageId);

      if (deleteError) throw deleteError;

      if (blocks.length > 0) {
        // Remove IDs if they are local UUIDs not yet in DB, or let DB handle if using upsert
        // Since we deleted all, we just insert.
        const blocksToInsert = blocks.map(({ id, ...rest }) => ({
          ...rest,
          package_id: packageId
        }));

        const { error: insertError } = await supabase
          .from('content_blocks')
          .insert(blocksToInsert);

        if (insertError) throw insertError;
      }

      toast.success('Campaign content saved');
      fetchBlocks(); // Refresh to get DB IDs
    } catch (err: any) {
      toast.error('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-4 border-black border-t-[#75E2FF] animate-spin mb-4" />
        <span className="text-[10px] font-black uppercase tracking-widest text-black">Syncing Editor State</span>
      </div>
    );
  }

  return (
    <div className="relative pb-32">
      {/* Header with Save */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          Canvas Content <span className="w-1 h-1 rounded-full bg-slate-300" /> {blocks.length} Blocks
        </h3>
        <Button 
          variant="accent" 
          onClick={saveChanges} 
          loading={saving}
          className="shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        {blocks.length === 0 ? (
          <div className="py-24 border-2 border-dashed border-slate-200 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-slate-50 flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Canvas is empty</p>
            <p className="text-slate-400 text-xs mt-1">Add your first content block from the toolbar below.</p>
          </div>
        ) : (
          blocks.map((block, index) => (
            <div 
              key={block.id} 
              className="bg-white border-2 border-black animate-in fade-in slide-in-from-bottom-4 duration-300"
            >
              <div className="px-4 py-2 border-b border-black bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-slate-300" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-1.5">
                    {block.type === 'header' && <Type className="w-3 h-3 text-indigo-600" />}
                    {block.type === 'text' && <AlignLeft className="w-3 h-3 text-emerald-600" />}
                    {block.type === 'poll' && <BarChart2 className="w-3 h-3 text-orange-600" />}
                    {block.type === 'image' && <ImageIcon className="w-3 h-3 text-blue-600" />}
                    {block.type}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => moveBlock(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 hover:bg-white border border-transparent hover:border-black transition-all disabled:opacity-30"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => moveBlock(index, 'down')}
                    disabled={index === blocks.length - 1}
                    className="p-1.5 hover:bg-white border border-transparent hover:border-black transition-all disabled:opacity-30"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-slate-300 mx-1" />
                  <button 
                    onClick={() => removeBlock(block.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-600 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-8">
                <BlockRenderer block={block} onChange={updateBlockContent} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Toolbar */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-black p-2 flex items-center gap-1 shadow-[8px_8px_0px_0px_rgba(117,226,255,0.4)]">
          <ToolbarButton icon={Type} label="Header" onClick={() => addBlock('header')} />
          <ToolbarButton icon={AlignLeft} label="Text" onClick={() => addBlock('text')} />
          <ToolbarButton icon={BarChart2} label="Poll" onClick={() => addBlock('poll')} />
          <ToolbarButton icon={ImageIcon} label="Image" onClick={() => addBlock('image')} />
        </div>
      </div>
    </div>
  );
};

const ToolbarButton = ({ icon: Icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 text-white hover:text-[#75E2FF] transition-colors group"
  >
    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
    <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">{label}</span>
  </button>
);