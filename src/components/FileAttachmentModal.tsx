import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { X, Upload, FileText, Image, FileSpreadsheet, Eye, Trash2 } from 'lucide-react';
import type { Attachment } from '@/types';

interface FileAttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachments: Attachment[];
  title?: string;
}

const fileIcons: Record<string, typeof FileText> = {
  pdf: FileText,
  jpg: Image,
  png: Image,
  jpeg: Image,
  xlsx: FileSpreadsheet,
  xls: FileSpreadsheet,
  doc: FileText,
  docx: FileText,
};

const fileColors: Record<string, string> = {
  pdf: 'text-red-500 bg-red-50',
  jpg: 'text-blue-500 bg-blue-50',
  png: 'text-blue-500 bg-blue-50',
  jpeg: 'text-blue-500 bg-blue-50',
  xlsx: 'text-emerald-500 bg-emerald-50',
  xls: 'text-emerald-500 bg-emerald-50',
  doc: 'text-blue-600 bg-blue-50',
  docx: 'text-blue-600 bg-blue-50',
};

export function FileAttachmentModal({ isOpen, onClose, attachments, title = 'File Attachments' }: FileAttachmentModalProps) {
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4 rounded-2xl border border-gray-200 bg-white shadow-2xl animate-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">{title}</h3>
              <p className="text-xs text-gray-500">{attachments.length} files attached</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Upload Area */}
        <div className="px-6 py-4">
          <div
            className={`rounded-xl border-2 border-dashed p-8 text-center transition-all ${
              isDragging
                ? 'border-blue-400 bg-blue-50/50'
                : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                Drag & drop files here or{' '}
                <span className="cursor-pointer text-blue-600 hover:text-blue-700 font-semibold">
                  Browse
                </span>
              </p>
              <p className="text-xs text-gray-400">Max size 5MB (PDF, JPG, PNG, XLSX)</p>
            </div>
          </div>
        </div>

        {/* Attached Documents */}
        <div className="px-6 pb-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Attached Documents
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {attachments.map((file) => {
              const IconComp = fileIcons[file.fileType] || FileText;
              const colorClass = fileColors[file.fileType] || 'text-gray-500 bg-gray-50';

              return (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-3 transition-all hover:border-gray-200 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colorClass}`}>
                      <IconComp className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.fileName}</p>
                      <p className="text-xs text-gray-400">
                        {file.fileSize} • Uploaded {file.uploadDate} by {file.uploadedBy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="default">
            <Upload className="h-4 w-4" />
            Upload Files
          </Button>
        </div>
      </div>
    </div>
  );
}
