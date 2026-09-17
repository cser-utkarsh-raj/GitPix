import React from 'react';
import { TEMPLATE_PRESETS } from '../data/templates';
import { ProfileData } from '../types';
import { Sparkles, Check, X } from 'lucide-react';

interface TemplatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (data: Partial<ProfileData>) => void;
}

export const TemplatePicker: React.FC<TemplatePickerProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Choose Profile Preset</h2>
            <p className="text-xs text-slate-400">
              Select a pre-designed cool theme to instantly transform your README layout
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {TEMPLATE_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                onSelectTemplate(preset.data);
                onClose();
              }}
              className="group cursor-pointer bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/80 p-4 rounded-xl transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors">
                    {preset.name}
                  </h3>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full uppercase">
                    {preset.data.theme}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {preset.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
                <span className="text-slate-500">
                  {preset.data.selectedTech?.length || 0} Badges • {preset.data.headerType} Header
                </span>
                <span className="text-cyan-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Apply <Check className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-slate-800 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-slate-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
