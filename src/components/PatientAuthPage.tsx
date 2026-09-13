import React, { useState } from 'react';
import { 
  Heart, 
  ArrowLeft, 
  User, 
  Mail, 
  Lock, 
  LogIn, 
  UserPlus, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  Clock, 
  Smile, 
  LogOut,
  Flower2,
  AlertCircle,
  Brain,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TextSize, ContrastTheme, Language, NavigationTab } from '../types';
import { soundEffects, speakText } from '../utils/audio';

interface PatientAuthPageProps {
  onNavigate: (tab: NavigationTab) => void;
  textSize: TextSize;
  contrastTheme: ContrastTheme;
  language: Language;
}

export const PatientAuthPage: React.FC<PatientAuthPageProps> = ({
  onNavigate,
  textSize,
  contrastTheme,
  language,
}) => {
  const { currentUser, userProfile, signInPatient, signUpPatient, logOutPatient, routines, memories } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [patientName, setPatientName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isHighContrast = contrastTheme === 'high-contrast';
  const isXL = textSize === 'extra-large';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        if (!patientName.trim()) {
          setErrorMsg(
            language === 'hi' 
              ? 'कृपया मरीज या बुजुर्ग का नाम दर्ज करें।' 
              : language === 'bn' 
              ? 'অনুগ্রহ করে রোগীর নাম লিখুন।' 
              : language === 'as' 
              ? 'অনুগ্ৰহ কৰি ৰোগীৰ নাম লিখক।' 
              : 'Please enter the patient or elder’s name.'
          );
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg(
            language === 'hi'
              ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।'
              : language === 'bn'
              ? 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।'
              : 'Password must be at least 6 characters long.'
          );
          setIsSubmitting(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMsg(
            language === 'hi'
              ? 'दोनों पासवर्ड एक जैसे नहीं हैं।'
              : language === 'bn'
              ? 'পাসওয়ার্ড দুটি মিলছে না।'
              : 'Passwords do not match.'
          );
          setIsSubmitting(false);
          return;
        }

        await signUpPatient(email.trim(), password, patientName.trim());
        soundEffects.playGentleChime();
        setSuccessMsg(
          language === 'hi'
            ? `स्वागत है, ${patientName.trim()} जी! आपका अकाउंट बन चुका है और डेटा सुरक्षित है।`
            : language === 'bn'
            ? `স্বাগতম, ${patientName.trim()}! আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।`
            : `Welcome, ${patientName.trim()}! Your patient account is ready and cloud-synced.`
        );
        speakText(
          language === 'hi' 
            ? `स्वागत है ${patientName} जी। आपका अकाउंट बन गया है।` 
            : `Welcome ${patientName}. You are successfully registered.`,
          language
        );
      } else {
        await signInPatient(email.trim(), password);
        soundEffects.playGentleChime();
        setSuccessMsg(
          language === 'hi' 
            ? 'सफलतापूर्वक साइन इन हो गए हैं!' 
            : 'Signed in successfully!'
        );
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      let friendly = 'Authentication failed. Please check your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendly = language === 'hi' 
          ? 'गलत ईमेल या पासवर्ड। कृपया दोबारा जांचें।' 
          : 'Incorrect email or password. Please try again.';
      } else if (err.code === 'auth/email-already-in-use') {
        friendly = language === 'hi'
          ? 'इस ईमेल से पहले ही अकाउंट मौजूद है। कृपया साइन इन करें।'
          : 'An account with this email already exists. Please Sign In.';
      } else if (err.code === 'auth/invalid-email') {
        friendly = language === 'hi' ? 'कृपया सही ईमेल पता डालें।' : 'Please enter a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        friendly = language === 'hi' ? 'पासवर्ड 6 अक्षरों से बड़ा होना चाहिए।' : 'Password is too weak.';
      }
      setErrorMsg(friendly);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    soundEffects.playSoftTap();
    await logOutPatient();
    setSuccessMsg('');
    setErrorMsg('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 transition-all duration-300">
      
      {/* Top Navigation & Back Button */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={() => {
            soundEffects.playSoftTap();
            onNavigate('dashboard');
          }}
          className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl font-black text-sm sm:text-base border-2 transition-all hover:-translate-x-1 active:scale-95 cursor-pointer shadow-xs ${
            isHighContrast
              ? 'bg-slate-900 border-emerald-400 text-emerald-300 hover:bg-slate-800'
              : 'bg-white hover:bg-emerald-50 border-emerald-300 text-[#1A5B3B] hover:border-emerald-400'
          }`}
          aria-label="Back to Dashboard"
        >
          <ArrowLeft className="w-5 h-5 text-emerald-700" />
          <span>
            {language === 'hi' ? 'मुख्य पृष्ठ पर वापस जाएं' : language === 'bn' ? 'ড্যাশবোর্ডে ফিরে যান' : 'Back to Dashboard'}
          </span>
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Firebase Cloud Storage</span>
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Friendly Reassurance & Benefits Card (5 cols) */}
        <div 
          className={`lg:col-span-5 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between border shadow-lg relative overflow-hidden ${
            isHighContrast
              ? 'bg-slate-950 border-emerald-400 text-white'
              : 'bg-gradient-to-br from-[#EAF5ED] via-[#DCF0E2] to-[#CEEAD6] border-emerald-300/80 text-[#163E24]'
          }`}
        >
          {/* Gentle background accent */}
          <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />

          <div>
            <div className="w-14 h-14 rounded-2xl bg-white/90 text-[#1A5B3B] flex items-center justify-center shadow-md mb-5 border border-emerald-200">
              <Heart className="w-7 h-7 fill-[#1A5B3B]" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-white/80 border border-emerald-300 text-xs font-black text-emerald-800 uppercase tracking-wider mb-2">
              Dementia-Friendly Cloud
            </span>

            <h1 className={`font-black tracking-tight text-slate-900 ${isXL ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
              {language === 'hi' 
                ? 'मरीज खाता एवं सुरक्षित डेटा' 
                : language === 'bn'
                ? 'রোগী অ্যাকাউন্ট ও ক্লাউড ডেটা'
                : 'Patient Account & Cloud Sync'}
            </h1>

            <p className="mt-3 text-sm sm:text-base font-semibold text-slate-700 leading-relaxed">
              {language === 'hi'
                ? 'अपना खाता बनाकर आप अपनी सभी दवाइयाँ, दिनचर्या, परिवार के फ़ोटो और खेल का रिकॉर्ड हमेशा सुरक्षित रख सकते हैं।'
                : language === 'bn'
                ? 'অ্যাকাউন্টে সাইন ইন করলে আপনার ওষুধ, রুটিন এবং পারিবারিক স্মৃতি সবসময় ক্লাউডে সংরক্ষিত থাকবে।'
                : 'Signing in securely saves your medication routines, family memory book pictures, and gentle brain game progress to your private Firebase account.'}
            </p>

            {/* Benefit Highlights */}
            <div className="mt-6 space-y-3.5">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 border border-emerald-200/80 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900">
                    {language === 'hi' ? 'दवाइयों की दिनचर्या' : 'Daily Medication & Routine'}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {language === 'hi' ? 'हर दिन की टिक और रिमाइंडर हमेशा याद रहेंगे।' : 'Completed tasks and daily reminders sync across devices.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 border border-emerald-200/80 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Smile className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900">
                    {language === 'hi' ? 'पारिवारिक मेमोरी बुक' : 'Family Memory Album'}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {language === 'hi' ? 'परिवार के चेहरे और आवाज़ें हमेशा साथ रहें।' : 'Cherished faces, stories, and voice memories saved securely.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/70 border border-emerald-200/80 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-slate-900">
                    {language === 'hi' ? 'सहानुभूतिपूर्ण वेलबीइंग' : 'Cognitive Engagement'}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    {language === 'hi' ? 'बिना तनाव के खिलते हुए फूलों का रिकॉर्ड।' : 'Zero-anxiety flower garden progression with caregiver metrics.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-emerald-200/80 text-xs font-bold text-emerald-900/80 flex items-center justify-between">
            <span>Project ID: monorom-sih</span>
            <span className="text-emerald-700 font-black">256-Bit Encrypted</span>
          </div>
        </div>

        {/* Right Column: Sign In / Sign Up Card (7 cols) */}
        <div 
          className={`lg:col-span-7 rounded-[32px] p-6 sm:p-10 border shadow-xl flex flex-col justify-between ${
            isHighContrast
              ? 'bg-slate-950 border-amber-400 text-white'
              : 'bg-white border-emerald-200/90 text-slate-900'
          }`}
        >
          {/* If Patient is Already Logged In */}
          {currentUser ? (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider mb-2 border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Active Session</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {language === 'hi' ? 'मरीज प्रोफ़ाइल सक्रिय है' : 'Patient Account Active'}
                </h2>
                <p className="text-sm font-medium text-slate-600 mt-1">
                  You are logged into your personalized cloud-synced Memoryom profile.
                </p>
              </div>

              {/* Patient Badge Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-mint-50 border-2 border-emerald-300 flex items-center gap-5 shadow-xs">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white text-3xl font-black flex items-center justify-center shadow-md">
                  {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : '🌸'}
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                    Patient Name
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    {userProfile?.displayName || 'Beloved Patient'}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5">
                    {currentUser.email}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-full border border-emerald-200">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Cloud Storage Connected</span>
                  </div>
                </div>
              </div>

              {/* Realtime stats from Firestore */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                    {language === 'hi' ? 'सक्रिय दिनचर्या' : 'Synced Routines'}
                  </span>
                  <p className="text-2xl font-black text-emerald-800 mt-1">
                    {routines.length} <span className="text-xs font-bold text-slate-500">reminders</span>
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                    {language === 'hi' ? 'मेमोरी बुक सदस्य' : 'Family Memories'}
                  </span>
                  <p className="text-2xl font-black text-emerald-800 mt-1">
                    {memories.length} <span className="text-xs font-bold text-slate-500">people</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playSoftTap();
                    onNavigate('dashboard');
                  }}
                  className="flex-1 py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-base transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{language === 'hi' ? 'डैशबोर्ड पर जाएं' : 'Go to Dashboard'}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="py-4 px-6 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-black text-sm transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{language === 'hi' ? 'साइन आउट करें' : 'Sign Out'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Sign In / Sign Up Form */
            <div>
              {/* Pill Switcher */}
              <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playSoftTap();
                    setMode('signin');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className={`py-3 rounded-xl font-black text-sm sm:text-base transition-all cursor-pointer ${
                    mode === 'signin'
                      ? 'bg-white text-emerald-900 shadow-sm border border-emerald-300'
                      : 'text-slate-600 hover:text-emerald-900'
                  }`}
                >
                  {language === 'hi' ? 'साइन इन (Sign In)' : language === 'bn' ? 'সাইন ইন (Sign In)' : 'Sign In'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playSoftTap();
                    setMode('signup');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className={`py-3 rounded-xl font-black text-sm sm:text-base transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-white text-emerald-900 shadow-sm border border-emerald-300'
                      : 'text-slate-600 hover:text-emerald-900'
                  }`}
                >
                  {language === 'hi' ? 'नया खाता बनाएं (Sign Up)' : language === 'bn' ? 'নতুন অ্যাকাউন্ট (Sign Up)' : 'New Patient Sign Up'}
                </button>
              </div>

              {/* Title & subtitle */}
              <div className="mb-5">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {mode === 'signin'
                    ? (language === 'hi' ? 'मरीज साइन इन' : language === 'bn' ? 'রোগী সাইন ইন' : 'Patient Sign In')
                    : (language === 'hi' ? 'मरीज नया खाता (Sign Up)' : language === 'bn' ? 'নতুন রোগীর অ্যাকাউন্ট' : 'Register New Patient')}
                </h2>
                <p className="text-xs sm:text-sm font-medium text-slate-600 mt-1">
                  {mode === 'signin'
                    ? 'Enter your registered email and password to access cloud routines & memories.'
                    : 'Create a permanent account to sync medication routines and family albums.'}
                </p>
              </div>

              {/* Feedback banners */}
              {errorMsg && (
                <div className="mb-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-bold flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* The Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-emerald-900 mb-1.5">
                      {language === 'hi' ? 'मरीज का नाम (Patient / Senior Name)' : 'Patient or Senior Name'}
                    </label>
                    <div className="relative">
                      <User className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                      <input
                        type="text"
                        required
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="e.g. Eleanor Vance or Dadi Ji"
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none text-slate-900 font-bold text-sm sm:text-base transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-emerald-900 mb-1.5">
                    {language === 'hi' ? 'ईमेल पता (Email Address)' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="patient@family.com"
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none text-slate-900 font-bold text-sm sm:text-base transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-emerald-900 mb-1.5">
                    {language === 'hi' ? 'पासवर्ड (Password - कम से कम 6 अक्षर)' : 'Password (At least 6 characters)'}
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none text-slate-900 font-bold text-sm sm:text-base transition-all"
                    />
                  </div>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-emerald-900 mb-1.5">
                      {language === 'hi' ? 'पासवर्ड दोबारा लिखें (Confirm Password)' : 'Confirm Password'}
                    </label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none text-slate-900 font-bold text-sm sm:text-base transition-all"
                      />
                    </div>
                  </div>
                )}

                <p className="text-xs text-slate-500 font-semibold pt-1">
                  🌿 {language === 'hi' 
                    ? 'सभी डेटा सुरक्षित फायरबेस डेटाबेस (monorom-sih) में स्टोर होता है।' 
                    : 'All patient details are stored in your secure Firebase project (monorom-sih).'}
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-black text-base sm:text-lg transition-all shadow-md active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer mt-3"
                >
                  {isSubmitting ? (
                    <span>{language === 'hi' ? 'कनेक्ट हो रहा है...' : 'Connecting to Firebase Cloud...'}</span>
                  ) : mode === 'signin' ? (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>{language === 'hi' ? 'साइन इन करें' : 'Sign In to Account'}</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>{language === 'hi' ? 'नया मरीज खाता बनाएं' : 'Create Patient Account'}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
