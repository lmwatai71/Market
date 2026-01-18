import React, { useState } from 'react';
import { User as UserType } from '../types';
import { MOCK_USER, APP_NAME, APPROVED_LOCATIONS, findNearestLocation, getIslandFromLocation } from '../constants';
import { Mail, Lock, User, MapPin, ArrowRight, ShieldCheck, Crosshair } from 'lucide-react';
import PhoneVerification from './PhoneVerification';

interface AuthViewProps {
  onLogin: (user: UserType) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingUser, setPendingUser] = useState<UserType | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearest = findNearestLocation(latitude, longitude);
        if (nearest) {
          setFormData(prev => ({ ...prev, location: nearest }));
          setError(''); // Clear any previous errors
        } else {
          setError("You seem to be outside our service area.");
        }
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        setError("Unable to retrieve your location. Please select manually.");
        setIsLocating(false);
      },
      { enableHighAccuracy: false, timeout: 5000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setLoadingText('Authenticating...');

    // Simulate Security Checks
    setTimeout(() => {
      setLoadingText('Checking location eligibility...');
      
      setTimeout(() => {
         // Finalize Auth Logic
         setIsLoading(false);
         setLoadingText('');
         
         let userAttempt: UserType | null = null;

         if (isLogin) {
           // Mock Login
           if (formData.email && formData.password) {
                userAttempt = { ...MOCK_USER, id: 'u_login_' + Date.now() };
           } else {
               setError('Please enter email and password.');
               return;
           }
         } else {
           // Sign Up
           if (formData.email && formData.password && formData.name && formData.location) {
             const detectedIsland = getIslandFromLocation(formData.location);
             
             userAttempt = {
               id: `u_${Date.now()}`,
               name: formData.name,
               location: formData.location,
               rating: 5.0,
               profilePhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`,
               verified: false,
               createdAt: new Date().toISOString(),
               island: detectedIsland
             };
           } else {
             setError('Please fill in all required fields, including location.');
             return;
           }
         }

         if (userAttempt) {
           // Trigger Verification Flow
           setPendingUser(userAttempt);
           setIsVerifying(true);
         }
      }, 1200); // Wait for "location check"
    }, 800); // Wait for "authenticating"
  };

  const handleVerificationSuccess = (phoneNumber: string) => {
    if (pendingUser) {
      const verifiedUser = {
        ...pendingUser,
        verified: true,
      };
      onLogin(verifiedUser);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-cloud flex flex-col justify-center items-center p-4">
        <PhoneVerification 
          onVerified={handleVerificationSuccess}
          onCancel={() => {
             setIsVerifying(false);
             setPendingUser(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cloud flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-mist relative">
        
        {/* Secure Launch Badge */}
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1 text-[10px] text-white font-bold border border-white/30 z-10">
           <ShieldCheck size={10} /> SECURE MODE
        </div>

        {/* Header Section */}
        <div className="bg-gradient-to-r from-kai to-lau p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2 relative z-10">{APP_NAME}</h1>
          <p className="text-white/80 text-sm relative z-10">
            {isLogin ? 'Welcome back to the marketplace' : 'Join our Hawaiʻi community'}
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-lava/40" size={20} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-mist focus:border-kai focus:ring-2 focus:ring-kai/20 outline-none transition text-lava"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required={!isLogin}
                  />
                </div>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3 top-3 text-lava/40 z-10" size={20} />
                  <select
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-mist focus:border-kai focus:ring-2 focus:ring-kai/20 outline-none transition text-lava bg-white appearance-none"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required={!isLogin}
                  >
                    <option value="" disabled>Select Location</option>
                    {APPROVED_LOCATIONS.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  
                  {/* Geolocation Button */}
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={isLocating}
                    className="absolute right-2 p-2 text-kai hover:bg-kai/10 rounded-lg transition"
                    title="Detect my location"
                  >
                    <Crosshair size={20} className={isLocating ? "animate-spin" : ""} />
                  </button>
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-lava/40" size={20} />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-mist focus:border-kai focus:ring-2 focus:ring-kai/20 outline-none transition text-lava"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-lava/40" size={20} />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-mist focus:border-kai focus:ring-2 focus:ring-kai/20 outline-none transition text-lava"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            {error && <p className="text-alaea text-sm text-center animate-pulse">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-kai text-white font-semibold py-3 rounded-xl hover:bg-kai/90 transition shadow-md flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {loadingText}
                </div>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-lava/60 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="ml-1 text-kai font-semibold hover:underline"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;