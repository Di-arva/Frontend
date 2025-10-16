import { useState, useRef, useEffect } from "react";
import { X, CheckCircle, Download, Pen, AlertCircle } from "lucide-react";

const TermsModal = ({ isOpen, onClose, onAccept }) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [signature, setSignature] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const pdfContainerRef = useRef(null);
  const [canAccept, setCanAccept] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setHasScrolled(false);
      setSignature("");
      setCanAccept(false);
      clearSignature();
    }
  }, [isOpen]);

  const handleScroll = (e) => {
    const element = e.target;
    const scrollPercentage = 
      (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
    
    if (scrollPercentage > 80 && !hasScrolled) {
      setHasScrolled(true);
    }
  };

  // Canvas signature functions
  useEffect(() => {
    if (canvasRef.current && isOpen) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#1e3a8a';
    }
  }, [isOpen]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(
      e.clientX - rect.left || e.touches[0].clientX - rect.left,
      e.clientY - rect.top || e.touches[0].clientY - rect.top
    );
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.lineTo(
      e.clientX - rect.left || e.touches[0].clientX - rect.left,
      e.clientY - rect.top || e.touches[0].clientY - rect.top
    );
    ctx.stroke();
    setCanAccept(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setCanAccept(false);
    }
  };

  const handleAccept = () => {
    if (hasScrolled && canAccept) {
      const canvas = canvasRef.current;
      const signatureData = canvas.toDataURL();
      onAccept(signatureData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Terms and Conditions</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* PDF Viewer Section */}
        <div 
          ref={pdfContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 bg-gray-50"
        >
          {/* PDF Embed */}
          <div className="bg-white rounded-lg shadow-sm mb-6 min-h-[400px] flex items-center justify-center">
            <iframe
              src="/terms-and-conditions.pdf"
              className="w-full h-[500px] rounded-lg"
              title="Terms and Conditions PDF"
            />
            {/* Fallback if PDF doesn't load */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-gray-400 text-sm">Loading PDF...</p>
            </div>
          </div>

          {/* Download Option */}
          <div className="flex justify-center mb-6">
            <a
              href="/terms-and-conditions.pdf"
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-900 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
          </div>

          {/* Scroll Indicator */}
          {!hasScrolled && (
            <div className="flex items-center justify-center gap-2 text-amber-700 bg-amber-50 rounded-lg p-3 mb-4">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">Please scroll through the entire document</p>
            </div>
          )}

          {hasScrolled && (
            <div className="flex items-center justify-center gap-2 text-green-700 bg-green-50 rounded-lg p-3 mb-4">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm">Document reviewed</p>
            </div>
          )}

          {/* Signature Section */}
          <div className={`transition-opacity duration-300 ${hasScrolled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Pen className="w-5 h-5 text-blue-900" />
                  <h3 className="text-lg font-semibold text-gray-900">Your Signature</h3>
                </div>
                <button
                  onClick={clearSignature}
                  className="text-sm text-blue-900 hover:text-blue-700 underline"
                  disabled={!hasScrolled}
                >
                  Clear
                </button>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 mb-4">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={200}
                  className="w-full h-48 cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>
              
              <p className="text-xs text-gray-600 text-center">
                Draw your signature above using your mouse or touch screen
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-white flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleAccept}
            disabled={!hasScrolled || !canAccept}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              hasScrolled && canAccept
                ? 'bg-blue-900 text-white hover:bg-blue-800 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Accept & Sign
          </button>
        </div>
      </div>
    </div>
  );
};

// Usage example component
const TermsCheckbox = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [signatureData, setSignatureData] = useState(null);

  const handleAccept = (signature) => {
    setAcceptedTerms(true);
    setSignatureData(signature);
  };

  return (
    <div className="p-8">
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 max-w-2xl">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            checked={acceptedTerms}
            readOnly
            className="sr-only"
          />
          
          <label className="cursor-pointer flex-shrink-0 mt-0.5">
            {acceptedTerms ? (
              <CheckCircle className="w-6 h-6 text-green-600 fill-current" />
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-gray-400" />
            )}
          </label>
          
          <div className="flex-1">
            <span className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">
                To proceed, please read and sign our{" "}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="text-blue-900 underline hover:opacity-80"
                >
                  Terms and Conditions
                </button>
                .
              </span>
              <p className="mt-2 text-gray-600">
                It's important that you read and understand them before continuing to use our services.
              </p>
              {acceptedTerms && (
                <p className="mt-2 text-green-700 font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Terms accepted and signed
                </p>
              )}
            </span>
          </div>
        </div>
      </div>

      <TermsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccept={handleAccept}
      />
    </div>
  );
};

export default TermsCheckbox;