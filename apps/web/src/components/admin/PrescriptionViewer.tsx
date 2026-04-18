'use client';
import { useState } from 'react';
import { ZoomIn, X, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface PrescriptionViewerProps {
  fileUrl: string;
  patientName: string;
}

export default function PrescriptionViewer({ fileUrl, patientName }: PrescriptionViewerProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const isPdf = fileUrl.toLowerCase().includes('.pdf');

  return (
    <>
      <div className="relative group bg-gray-100 rounded-xl overflow-hidden border border-gray-200 aspect-[3/4] max-h-[500px] flex items-center justify-center">
        {isPdf ? (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <span className="text-red-500 font-bold text-lg">PDF</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Prescription PDF</p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-brand-700 hover:underline font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Open in new tab
            </a>
          </div>
        ) : (
          <>
            <Image
              src={fileUrl}
              alt={`Prescription from ${patientName}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 500px"
            />
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors"
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow">
                <ZoomIn className="w-4 h-4" />
                Click to zoom
              </span>
            </button>
          </>
        )}
      </div>

      {!isPdf && (
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => setLightboxOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
            Zoom
          </button>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open original
          </a>
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>
          <div
            className="relative max-w-4xl max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={fileUrl}
              alt={`Prescription from ${patientName}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
