import React from 'react';
import { Input, Label } from '../../ui/FormElements';
import { Plus, Trash2 } from 'lucide-react';

interface BlockRendererProps {
  block: any;
  onChange: (id: string, content: any) => void;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, onChange }) => {
  const updateContent = (field: string, value: any) => {
    onChange(block.id, { ...block.content, [field]: value });
  };

  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...(block.content.options || [])];
    newOptions[index] = value;
    updateContent('options', newOptions);
  };

  const addPollOption = () => {
    const newOptions = [...(block.content.options || []), ''];
    updateContent('options', newOptions);
  };

  const removePollOption = (index: number) => {
    const newOptions = (block.content.options || []).filter((_: any, i: number) => i !== index);
    updateContent('options', newOptions);
  };

  switch (block.type) {
    case 'header':
      return (
        <div className="space-y-4">
          <div>
            <Label>Section Title</Label>
            <Input 
              value={block.content.text || ''} 
              onChange={(e) => updateContent('text', e.target.value)}
              placeholder="Enter a bold header..."
              className="text-lg font-black uppercase tracking-tight"
            />
          </div>
        </div>
      );

    case 'text':
      return (
        <div className="space-y-4">
          <div>
            <Label>Body Content</Label>
            <textarea
              className="w-full px-4 py-3 bg-white border border-black rounded-none focus:ring-0 focus:border-brand-blue transition-all outline-none text-sm placeholder:text-slate-400 min-h-[150px]"
              value={block.content.body || ''}
              onChange={(e) => updateContent('body', e.target.value)}
              placeholder="Write your announcement or message here..."
            />
          </div>
        </div>
      );

    case 'poll':
      return (
        <div className="space-y-6">
          <div>
            <Label>Poll Question</Label>
            <Input 
              value={block.content.question || ''} 
              onChange={(e) => updateContent('question', e.target.value)}
              placeholder="What is your opinion on...?"
              className="font-bold"
            />
          </div>
          <div className="space-y-3">
            <Label>Options</Label>
            {(block.content.options || []).map((option: string, idx: number) => (
              <div key={idx} className="flex gap-2">
                <Input 
                  value={option} 
                  onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                />
                <button 
                  onClick={() => removePollOption(idx)}
                  className="p-3 border border-black hover:bg-red-50 text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button 
              onClick={addPollOption}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black hover:text-[#75E2FF] transition-colors mt-2"
            >
              <Plus className="w-3 h-3" />
              Add Option
            </button>
          </div>
        </div>
      );

    case 'image':
      return (
        <div className="space-y-4">
          <div>
            <Label>Image URL</Label>
            <Input 
              value={block.content.url || ''} 
              onChange={(e) => updateContent('url', e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>
          <div>
            <Label>Caption</Label>
            <Input 
              value={block.content.caption || ''} 
              onChange={(e) => updateContent('caption', e.target.value)}
              placeholder="Optional caption..."
            />
          </div>
        </div>
      );

    default:
      return <div className="p-4 bg-slate-100 text-xs">Unknown block type: {block.type}</div>;
  }
};