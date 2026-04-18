'use client';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, ArrowRight, RotateCcw, ShieldCheck } from 'lucide-react';
import { useSendOtp, useVerifyOtp } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const phoneSchema = z.object({
  phone: z.string().regex(/^01[3-9]\d{8}$/, 'Enter a valid BD phone number'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'Enter 6-digit OTP'),
  name: z.string().optional(),
});

type PhoneForm = z.infer<typeof phoneSchema>;
type OtpForm = z.infer<typeof otpSchema>;

export default function LoginPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();

  const phoneForm = useForm<PhoneForm>({ resolver: zodResolver(phoneSchema) });
  const otpForm = useForm<OtpForm>({ resolver: zodResolver(otpSchema) });

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleSendOtp = async (data: PhoneForm) => {
    const result = await sendOtp.mutateAsync(data.phone);
    setPhone(data.phone);
    setIsNewUser(result.isNewUser);
    setStep('otp');
    setResendTimer(60);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const handleOtpInput = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.slice(0, 6).split('');
      const newDigits = [...otpDigits];
      digits.forEach((d, i) => { if (index + i < 6) newDigits[index + i] = d; });
      setOtpDigits(newDigits);
      otpForm.setValue('otp', newDigits.join(''));
      inputRefs.current[Math.min(index + digits.length, 5)]?.focus();
      return;
    }
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);
    otpForm.setValue('otp', newDigits.join(''));
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (data: OtpForm) => {
    await verifyOtp.mutateAsync({ phone, otp: otpDigits.join(''), name: data.name });
  };

  const handleResend = async () => {
    await sendOtp.mutateAsync(phone);
    setOtpDigits(['', '', '', '', '', '']);
    setResendTimer(60);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-brand-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-brand-800">Pharmaci</span>
          </div>
          <p className="text-gray-500 text-sm">Bangladesh's trusted online pharmacy</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {step === 'phone' ? (
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-7 h-7 text-brand-700" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome!</h1>
                <p className="text-gray-500 mt-1 text-sm">Enter your phone to continue</p>
              </div>

              <form onSubmit={phoneForm.handleSubmit(handleSendOtp)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-600 font-medium">
                      🇧🇩 +88
                    </div>
                    <input
                      {...phoneForm.register('phone')}
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      className={cn(
                        'flex-1 px-4 py-3 border border-gray-200 rounded-r-xl text-sm outline-none transition-colors',
                        'focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
                        phoneForm.formState.errors.phone && 'border-red-400',
                      )}
                    />
                  </div>
                  {phoneForm.formState.errors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {phoneForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={sendOtp.isPending}
                  className="w-full bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  {sendOtp.isPending ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send OTP <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-6">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-brand-700 hover:underline">Terms</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-brand-700 hover:underline">Privacy Policy</Link>
              </p>
            </div>
          ) : (
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-7 h-7 text-brand-700" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Enter OTP</h1>
                <p className="text-gray-500 mt-1 text-sm">
                  Sent to <span className="font-semibold text-gray-700">{phone}</span>
                </p>
                {process.env.NODE_ENV === 'development' && (
                  <span className="inline-block mt-2 bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded">
                    Dev mode: use <strong>123456</strong>
                  </span>
                )}
              </div>

              <form onSubmit={otpForm.handleSubmit(handleVerify)} className="space-y-5">
                {/* OTP Boxes */}
                <div className="flex gap-2 justify-center">
                  {otpDigits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpInput(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={cn(
                        'w-11 h-13 text-center text-xl font-bold border-2 rounded-xl transition-all outline-none',
                        digit ? 'border-brand-500 bg-brand-50' : 'border-gray-200',
                        'focus:border-brand-600 focus:ring-2 focus:ring-brand-100',
                      )}
                    />
                  ))}
                </div>

                {isNewUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      {...otpForm.register('name')}
                      type="text"
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={verifyOtp.isPending || otpDigits.join('').length !== 6}
                  className="w-full bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  {verifyOtp.isPending ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Verify & Continue'
                  )}
                </button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => { setStep('phone'); setOtpDigits(['', '', '', '', '', '']); }}
                    className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    ← Change number
                  </button>
                  {resendTimer > 0 ? (
                    <span className="text-gray-400">Resend in {resendTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={sendOtp.isPending}
                      className="text-brand-700 hover:text-brand-800 font-medium flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Resend OTP
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
