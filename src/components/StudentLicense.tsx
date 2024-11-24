import { useState, useRef, useEffect } from 'react';
import { Student } from '../types';
import { User, Upload, X } from 'lucide-react';
import { ageGroups } from '../lib/ageGroups';
import { QRCodeSVG } from 'qrcode.react';
import JsBarcode from 'jsbarcode';
import SignaturePad from 'react-signature-canvas';

interface StudentLicenseProps {
  student: Student;
}

export function StudentLicense({ student }: StudentLicenseProps) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const signaturePadRef = useRef<any>(null);
  const barcodeRef = useRef<SVGSVGElement>(null);
  const age = new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear();
  const ageGroup = ageGroups.calculateAgeGroup(student.dateOfBirth);

  // Generate barcode when component mounts
  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, student.id, {
        format: "CODE128",
        width: 1,
        height: 30,
        displayValue: false
      });
    }
  }, [student.id]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setSignature(null);
    }
  };

  const handleSignatureSave = () => {
    if (signaturePadRef.current) {
      setSignature(signaturePadRef.current.toDataURL());
    }
  };

  return (
    <div className="license-card border-2 border-blue-600 bg-white rounded-lg overflow-hidden">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none rotate-[-30deg] print:opacity-10">
        <h1 className="text-3xl font-bold text-gray-800">Ikhtiyar DZ</h1>
      </div>

      <div className="flex h-full p-3">
        {/* Left side - Photo */}
        <div className="w-[25mm] flex flex-col justify-start">
          <div className="relative w-[23mm] h-[28mm] bg-gray-100 border border-gray-200 rounded overflow-hidden">
            {photo ? (
              <div className="relative w-full h-full">
                <img
                  src={photo}
                  alt="Student"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setPhoto(null)}
                  className="absolute -top-1 -right-1 p-0.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 print:hidden"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 print:hidden">
                <User className="w-6 h-6 text-gray-400" />
                <span className="text-[8px] text-gray-500 mt-1">Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Right side - Info */}
        <div className="flex-1 pl-2 flex flex-col justify-between">
          {/* Header */}
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold text-blue-600">Ikhtiyar DZ</h3>
            <div className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-medium">
              {student.selectedSport.toUpperCase()}
            </div>
          </div>

          {/* Main Info */}
          <div className="mt-1 space-y-0.5">
            <p className="text-xs font-semibold">{student.name}</p>
            <p className="text-[10px] text-gray-600">{student.schoolName}</p>
            
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
              <div className="text-[10px]">
                <span className="text-gray-500">Age:</span>
                <span className="ml-1 font-medium">{age} years</span>
              </div>
              <div className="text-[10px]">
                <span className="text-gray-500">Group:</span>
                <span className="ml-1 font-medium">{ageGroup}</span>
              </div>
              <div className="text-[10px]">
                <span className="text-gray-500">DOB:</span>
                <span className="ml-1 font-medium">
                  {new Date(student.dateOfBirth).toLocaleDateString()}
                </span>
              </div>
              <div className="text-[10px]">
                <span className="text-gray-500">Status:</span>
                <span className="ml-1 font-medium capitalize">{student.status}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-1 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <QRCodeSVG
                value={`https://ikhtiyar-dz.vercel.app/student/${student.id}`}
                size={20}
              />
              <svg ref={barcodeRef} className="h-4 w-16" />
            </div>
            
            <div className="flex justify-between items-center mt-1">
              <div className="text-[8px] text-gray-500">ID: {student.id.slice(0, 8)}</div>
              <div className="text-[8px] text-gray-500">
                {new Date().toLocaleDateString()}
              </div>
            </div>

            {signature ? (
              <img
                src={signature}
                alt="Signature"
                className="h-6 mt-0.5"
              />
            ) : (
              <div className="print:hidden mt-0.5">
                <SignaturePad
                  ref={signaturePadRef}
                  canvasProps={{
                    className: 'border rounded w-full h-8'
                  }}
                />
                <div className="flex justify-end gap-1 mt-0.5">
                  <button
                    onClick={handleSignatureClear}
                    className="text-[8px] text-red-600 hover:text-red-700"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleSignatureSave}
                    className="text-[8px] text-blue-600 hover:text-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 