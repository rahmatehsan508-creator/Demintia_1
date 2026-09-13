import React, { useState } from 'react';
import { 
  Heart, 
  X, 
  User, 
  Mail, 
  Lock, 
  LogIn, 
  UserPlus, 
  LogOut, 
  CloudCheck, 
  ShieldCheck,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TextSize, ContrastTheme, Language } from '../types';
import { soundEffects } from '../utils/audio';

interface PatientAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  textSize: TextSize;
  contrastTheme: ContrastTheme;
  language: Language;
}

export const PatientAuthModal: React.FC<PatientAuthModalProps> = ({
  isOpen,
  onClose,
  textSize,
  contrastTheme,
  language,
}) => {
  const { currentUser, userProfile, signInPatient, signUpPatient, logOutPatient } = useAuth();
  
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [patientName, setPatientName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isHighContrast = contrastTheme === 'high-contrast';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        if (!patientName.trim()) {
          setErrorMsg('Please enter your name.');
          setIsSubmitting(false);
          return;
        }
        await signUpPatient(email.trim(), password, patientName.trim());
        soundEffects.playGentleChime();
        onClose();
      } else {
        await signInPatient(email.trim(), password);
        soundEffects.playGentleChime();
        onClose();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let friendly = 'Could not complete sign in. Please verify your details.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendly = 'Incorrect email or password. Please try again.';
      } else if (err.code === 'auth/email-already-in-use') {
        friendly = 'An account with this email already exists. Try signing in instead.';
      } else if (err.code === 'auth/weak-password') {
        friendly = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        friendly = 'Please enter a valid email address.';
      }
      setErrorMsg(friendly);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogOut = async () => {
    soundEffects.playSoftTap();
    await logOutPatient();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-all"
      role="dialog"
      aria-modal="true"
      aria-labelledby="patient-auth-title"
    >
      <div
        className={`w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl transition-all border ${
          isHighContrast
            ? 'bg-slate-950 border-amber-400 text-white'
            : 'bg-white border-emerald-200 text-slate-900'
        } ${textSize === 'extra-large' ? 'text-lg' : 'text-base'}`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <h2 id="patient-auth-title" className="text-xl sm:text-2xl font-black text-[#1A5B3B]">
                {currentUser ? 'Patient Profile' : mode === 'signin' ? 'Patient Sign In' : 'New Patient Sign Up'}
              </h2>
              <span className="text-xs font-bold text-emerald-700/80">
                Connected to Cloud Firebase
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Already Logged In: Show Profile & Sign Out Option */}
        {currentUser ? (
          <div className="py-6 space-y-5">
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-2xl font-black">
                {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : '🌸'}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-emerald-800">
                  Signed in as
                </p>
                <h3 className="text-xl font-black text-slate-900">
                  {userProfile?.displayName || 'Beloved Patient'}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {currentUser.email}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs sm:text-sm text-sky-900 space-y-1">
              <div className="flex items-center gap-2 font-black text-sky-950">
                <CloudCheck className="w-4 h-4 text-sky-600" />
                <span>Cloud Sync Active</span>
              </div>
              <p>Your daily routines, memory book stories, and game scores are securely stored in your personal cloud account.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleLogOut}
                className="w-full py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-black flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-md"
              >
                <span>Continue Home</span>
              </button>
            </div>
          </div>
        ) : (
          /* Sign In or Sign Up Form */
          <form onSubmit={handleSubmit} className="py-5 space-y-4">
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-emerald-50 border border-emerald-200 mb-2">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftTap();
                  setMode('signin');
                  setErrorMsg('');
                }}
                className={`py-2 rounded-xl text-sm font-black transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-white text-emerald-800 shadow-xs border border-emerald-300/80'
                    : 'text-slate-600 hover:text-emerald-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftTap();
                  setMode('signup');
                  setErrorMsg('');
                }}
                className={`py-2 rounded-xl text-sm font-black transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-emerald-800 shadow-xs border border-emerald-300/80'
                    : 'text-slate-600 hover:text-emerald-800'
                }`}
              >
                New Patient Sign Up
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-emerald-900 mb-1">
                  Patient or Senior's Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Eleanor Vance or Dadi Ji"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-slate-900 font-medium text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-emerald-900 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@family.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-slate-900 font-medium text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-emerald-900 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-slate-900 font-medium text-sm"
                />
              </div>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              🌿 Logging in enables seamless cloud saving of routines, family pictures, and cognitive activities.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-black text-base transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <span>Connecting to Cloud...</span>
              ) : mode === 'signin' ? (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In to Memoryom</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Patient Account</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
