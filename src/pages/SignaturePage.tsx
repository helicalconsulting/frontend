import { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import {
  PenTool,
  Home,
  Eraser,
  Save,
  Upload,
  CheckCircle2,
} from 'lucide-react';

export function SignaturePage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const isDark = document.documentElement.classList.contains('dark');
    ctx.strokeStyle = isDark ? '#f8fafc' : '#1e293b';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  }, [getPos]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing, getPos]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setIsSaved(false);
  };

  const saveSignature = () => {
    if (!hasSignature) return;
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        title="Capture Signature"
        subtitle="Digital signature for high-value transaction approvals"
      />

      <div className="p-6 flex justify-center">
        <div className="w-full max-w-lg">
          {/* Signature Card */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
            {/* Blue Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-center">
              <PenTool className="h-8 w-8 text-white mx-auto mb-2" />
              <h3 className="text-lg font-bold text-white">Capture Signature</h3>
            </div>

            <div className="p-6 space-y-5">
              {/* Sign Below Label */}
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <PenTool className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Sign Below</span>
              </div>

              {/* Canvas */}
              <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/50 overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="w-full h-56 cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>

              {/* Alternative Upload */}
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Alternative: Upload Image
                  </span>
                </div>
                <label className="flex items-center gap-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <span className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1 text-xs font-medium dark:text-gray-200">
                    Browse...
                  </span>
                  <span className="text-gray-400 dark:text-gray-500 text-xs">No file selected.</span>
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              </div>

              {/* Saved confirmation */}
              {isSaved && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-4 py-3 animate-in">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Signature saved successfully!</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  <Home className="h-4 w-4" />
                  Home
                </Button>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={clearCanvas}>
                    <Eraser className="h-4 w-4" />
                    Clear
                  </Button>
                  <Button
                    variant="default"
                    disabled={!hasSignature}
                    onClick={saveSignature}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600"
                  >
                    <Save className="h-4 w-4" />
                    Save Signature
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
