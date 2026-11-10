import React, { useRef, useState, useEffect } from 'react';
import { Pen, Square, Eraser, RotateCcw } from 'lucide-react';

export const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<'pen' | 'rect' | 'eraser'>('pen');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#2B2118';
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPos({ x, y });

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (tool === 'pen') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'pen') {
      ctx.strokeStyle = '#2B2118';
      ctx.lineWidth = 2;
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.clearRect(x - 10, y - 10, 20, 20);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (tool === 'rect' && startPos) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.strokeStyle = '#2B2118';
      ctx.lineWidth = 2;
      ctx.strokeRect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
    }
    setStartPos(null);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="h-10 px-3 border-b border-divider flex items-center justify-between bg-white flex-shrink-0">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setTool('pen')}
            className={`p-1.5 rounded-[4px] border ${
              tool === 'pen'
                ? 'border-ink bg-[#FFF7F1] text-ink'
                : 'border-transparent text-muted hover:text-ink'
            }`}
            title="Pen Tool"
          >
            <Pen size={14} />
          </button>
          <button
            onClick={() => setTool('rect')}
            className={`p-1.5 rounded-[4px] border ${
              tool === 'rect'
                ? 'border-ink bg-[#FFF7F1] text-ink'
                : 'border-transparent text-muted hover:text-ink'
            }`}
            title="Rectangle / Architecture Box"
          >
            <Square size={14} />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-1.5 rounded-[4px] border ${
              tool === 'eraser'
                ? 'border-ink bg-[#FFF7F1] text-ink'
                : 'border-transparent text-muted hover:text-ink'
            }`}
            title="Eraser"
          >
            <Eraser size={14} />
          </button>
        </div>

        <button
          onClick={handleClear}
          className="text-[11px] font-mono text-muted hover:text-ink flex items-center space-x-1 px-2 py-1 rounded hover:bg-[#FFF7F1]"
        >
          <RotateCcw size={12} />
          <span>Clear Canvas</span>
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative cursor-crosshair bg-white">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="w-full h-full block"
        />
      </div>
    </div>
  );
};

