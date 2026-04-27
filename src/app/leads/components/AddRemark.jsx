import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const REMARK_TYPES = ['Call', 'Email', 'Meeting', 'WhatsApp', 'Note'];

export default function Remark({ open, onOpenChange, handleRemark, handleSubmitRemark }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-white border border-gray-200 text-gray-900 p-6 gap-0 [&>button]:text-gray-400 [&>button]:hover:text-gray-700">
        <DialogHeader className="mb-5">
          <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight">
            Add Remark
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Type */}
          <div className="space-y-2">
            <Label className="text-[11px] font-semibold tracking-widest text-gray-500 uppercase">
              Type
            </Label>
            <Select defaultValue="Call" onValueChange={v => handleRemark("type", v)}>
              <SelectTrigger className="w-full bg-white border border-gray-300 text-gray-900 h-11 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 text-gray-900 rounded-lg shadow-md">
                {REMARK_TYPES.map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                    className="text-gray-800 focus:bg-gray-100 focus:text-gray-900 cursor-pointer"
                  >
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Remark */}
          <div className="space-y-2">
            <Label className="text-[11px] font-semibold tracking-widest text-gray-500 uppercase">
              Remark
            </Label>
            <Textarea
              className="w-full bg-white border border-gray-300 text-gray-900 min-h-[110px] rounded-lg resize-y focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400 transition-colors placeholder:text-gray-400"
              placeholder=""
              onChange={(e) => handleRemark("remark", e.target.value)}
            />
          </div>

          {/* Next Follow-up */}
          <div className="space-y-2">
            <Label className="text-[11px] font-semibold tracking-widest text-gray-500 uppercase">
              Next Follow-Up
            </Label>
            <Input
            onChange={(e) => handleRemark("nextFollowUp", e.target.value)}
              type="datetime-local"
              className="w-full bg-white border border-gray-300 text-gray-600 h-11 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400 transition-colors [color-scheme:light]"
            />
          </div>

          {/* Submit */}
          <Button onClick={handleSubmitRemark} className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg transition-colors mt-1">
            Add Remark
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}