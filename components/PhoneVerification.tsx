import React, { useState } from 'react';
import { Smartphone, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { sendVerificationCode, verifyVerificationCode } from '../services/verificationService';

interface PhoneVerificationProps {
  onVerified: (phoneNumber: string) => void;
  onCancel: () => void;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({ onVerified, onCancel }) => {
  const [step, setStep] = useState<'PHONE' | 'CODE'>('PHONE');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await sendVerificationCode(phoneNumber);
      setStep('CODE');
    } catch (err) {
      setError('Failed to send code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const isValid = await verifyVerificationCode(phoneNumber, code);
      if (isValid) {
        onVerified(phoneNumber);
      } else {
        setError('Incorrect code. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg border border-mist overflow-hidden animate-in zoom-in-95 duration-200">
      <div className="bg-gradient-to-r from-kai to-lau p-4 flex items-center justify-center">
         <ShieldCheck className="text-white w-8 h-8" />
         <h3 className="ml-2 text-white font-serif font-bold text-lg">Security Check</h3>
      </div>
      
      <div className="p-6">
        {step === 'PHONE' ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <p className="text-center text-lava/70 text-sm">
              To protect your account, we need to verify your phone number before proceeding.
            </p>
            <div className="space-y-2">
              <label className="text-xs font-bold text-lava uppercase tracking-wide">Phone Number</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-3 text-lava/40" size={20} />
                <input
                  type="tel"
                  placeholder="(808) 555-0123"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-mist focus:border-kai focus:ring-2 focus:ring-kai/20 outline-none transition text-lava text-lg"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
            {error && <p className="text-alaea text-xs text-center font-medium">{error}</p>}
            
            <div className="flex gap-2 mt-2">
              <button 
                type="button" 
                onClick={onCancel}
                className="flex-1 py-3 text-lava/60 font-medium hover:bg-mist/30 rounded-xl transition"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 bg-kai text-white font-bold py-3 rounded-xl hover:bg-kai/90 transition shadow-md flex items-center justify-center gap-2"
              >
                {isLoading ? <RefreshCw className="animate-spin" size={20} /> : <>Send Code <ArrowRight size={18} /></>}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-4">
             <p className="text-center text-lava/70 text-sm">
              Enter the 6-digit code sent to <span className="font-bold text-kai">{phoneNumber}</span>
            </p>
            <div className="space-y-2">
              <label className="text-xs font-bold text-lava uppercase tracking-wide">Verification Code</label>
              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                className="w-full text-center py-3 rounded-xl border border-mist focus:border-kai focus:ring-2 focus:ring-kai/20 outline-none transition text-lava text-2xl tracking-[0.5em] font-mono"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>
            {error && <p className="text-alaea text-xs text-center font-medium">{error}</p>}
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-kai text-white font-bold py-3 rounded-xl hover:bg-kai/90 transition shadow-md flex items-center justify-center gap-2"
            >
              {isLoading ? <RefreshCw className="animate-spin" size={20} /> : <>Verify & Continue <ArrowRight size={18} /></>}
            </button>
            <button 
              type="button"
              onClick={() => setStep('PHONE')}
              className="w-full text-xs text-kai font-medium hover:underline py-2"
            >
              Change Phone Number
            </button>
          </form>
        )}
      </div>
      <div className="bg-mist/10 p-3 text-center border-t border-mist">
        <p className="text-[10px] text-lava/50">
          Piko Market uses secure SMS verification to prevent scams. Your number is never shared.
        </p>
      </div>
    </div>
  );
};

export default PhoneVerification;