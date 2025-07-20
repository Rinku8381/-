'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Chrome,
  Facebook,
  Shield,
  Code,
  Zap,
  Star,
  Crown,
  ArrowRight,
  Volume2,
  VolumeX,
  RefreshCw,
} from 'lucide-react';

interface LoginSystemProps {
  isVisible: boolean;
  onClose: () => void;
  onLoginSuccess?: (
    userType: 'free' | 'premium' | 'admin' | 'developer'
  ) => void;
}

interface LoginForm {
  email: string;
  password: string;
  phone: string;
  subscriptionCode: string;
  adminCode: string;
  remember: boolean;
}

const LoginSystem: React.FC<LoginSystemProps> = ({
  isVisible,
  onClose,
  onLoginSuccess,
}) => {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeTab, setActiveTab] = useState<
    'free' | 'premium' | 'admin' | 'developer'
  >('free');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
    phone: '',
    subscriptionCode: '',
    adminCode: '',
    remember: false,
  });
  const [loginStep, setLoginStep] = useState<'form' | 'processing' | 'success'>(
    'form'
  );
  const [synthAudioEnabled, setSynthAudioEnabled] = useState(true);
  const [portalEffect, setPortalEffect] = useState(false);

  const processingMessages = [
    'Initializing neural core...',
    'Authenticating user credentials...',
    'Establishing secure connection...',
    'Loading user profile...',
    'Synchronizing data...',
    'Welcome, Master.',
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    if (isVisible && synthAudioEnabled) {
      // Initialize synth audio
      if (audioRef.current) {
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(() => {
          // Auto-play might be blocked
        });
      }
    }
  }, [isVisible, synthAudioEnabled]);

  useEffect(() => {
    if (loginStep === 'processing') {
      const interval = setInterval(() => {
        setCurrentMessage(prev => (prev + 1) % processingMessages.length);
      }, 800);

      const timeout = setTimeout(() => {
        setLoginStep('success');
        setPortalEffect(true);

        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(activeTab);
          }
          // Redirect based on user type
          const dashboardPath =
            activeTab === 'premium' ||
            activeTab === 'admin' ||
            activeTab === 'developer'
              ? '/dashboard/premium'
              : '/dashboard/free';
          router.push(dashboardPath);
        }, 2000);
      }, 4800);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
    return undefined;
  }, [loginStep, activeTab, onLoginSuccess, router]);

  const handleInputChange = (
    field: keyof LoginForm,
    value: string | boolean
  ) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (
    loginType: 'email' | 'google' | 'facebook' | 'phone'
  ) => {
    setIsLoading(true);
    setLoginStep('processing');
    setCurrentMessage(0);

    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 5000));
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    handleLogin(provider);
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'free':
        return <User className='w-5 h-5' />;
      case 'premium':
        return <Crown className='w-5 h-5' />;
      case 'admin':
        return <Shield className='w-5 h-5' />;
      case 'developer':
        return <Code className='w-5 h-5' />;
      default:
        return <User className='w-5 h-5' />;
    }
  };

  const getTabColor = (tab: string) => {
    switch (tab) {
      case 'free':
        return 'cyan';
      case 'premium':
        return 'yellow';
      case 'admin':
        return 'red';
      case 'developer':
        return 'green';
      default:
        return 'cyan';
    }
  };

  if (!isVisible) return null;

  if (loginStep === 'processing') {
    return (
      <div className='fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center'>
        <audio ref={audioRef} loop>
          <source
            src='/assets/splash/SplashFuturisticSynthwave.mp3'
            type='audio/mpeg'
          />
        </audio>

        <div className='text-center space-y-8'>
          <div className='seraphine-plasma-orb w-24 h-24 mx-auto seraphine-beat-sync'></div>

          <div className='space-y-4'>
            <h2
              className='text-2xl font-bold text-cyan-400 seraphine-glitch'
              data-text='ACCESSING NEURAL NETWORK'
            >
              ACCESSING NEURAL NETWORK
            </h2>

            <div className='h-8'>
              <p className='text-cyan-300 font-mono typing-effect'>
                {processingMessages[currentMessage]}
              </p>
            </div>

            <div className='flex justify-center space-x-2'>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`seraphine-loading-dot ${
                    i <= currentMessage ? 'opacity-100' : 'opacity-30'
                  } delay-${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loginStep === 'success' && portalEffect) {
    return (
      <div className='fixed inset-0 z-50 bg-black flex items-center justify-center'>
        <div className='seraphine-portal-entry'></div>
        <div className='text-center text-cyan-400 font-bold text-xl z-10'>
          Welcome to Seraphine Hybrid V1.5
        </div>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 z-50 bg-black/90 backdrop-blur-sm'>
      <audio ref={audioRef} loop>
        <source
          src='/assets/splash/SplashFuturisticSynthwave.mp3'
          type='audio/mpeg'
        />
      </audio>

      <div className='seraphine-holo-panel h-full m-4 flex flex-col max-w-4xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-cyan-500/20'>
          <div className='flex items-center gap-4'>
            <div className='seraphine-plasma-orb w-12 h-12'></div>
            <div>
              <h2
                className='text-2xl font-bold text-cyan-400 seraphine-glitch'
                data-text='Neural Access Portal'
              >
                Neural Access Portal
              </h2>
              <p className='text-sm text-cyan-300/70'>
                Secure authentication system
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <button
              onClick={() => setSynthAudioEnabled(!synthAudioEnabled)}
              className='seraphine-neural-btn ghost p-2'
              title={synthAudioEnabled ? 'Disable Audio' : 'Enable Audio'}
            >
              {synthAudioEnabled ? (
                <Volume2 size={16} />
              ) : (
                <VolumeX size={16} />
              )}
            </button>
            <button
              onClick={onClose}
              className='seraphine-neural-btn ghost p-2'
              title='Close Login'
            >
              <Zap size={16} />
            </button>
          </div>
        </div>

        <div className='flex-1 overflow-hidden flex'>
          {/* Left Panel - Login Tabs */}
          <div className='w-80 border-r border-cyan-500/20 p-6'>
            <h3 className='text-lg font-semibold text-cyan-300 mb-6'>
              Access Level
            </h3>

            <div className='space-y-3'>
              {(['free', 'premium', 'admin', 'developer'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full p-4 rounded-lg border transition-all flex items-center gap-3 ${
                    activeTab === tab
                      ? `border-${getTabColor(tab)}-400 bg-${getTabColor(tab)}-400/10 text-${getTabColor(tab)}-300`
                      : 'border-cyan-500/20 text-cyan-400/70 hover:border-cyan-400/50'
                  }`}
                >
                  {getTabIcon(tab)}
                  <div className='text-left'>
                    <div className='font-semibold capitalize'>{tab} User</div>
                    <div className='text-xs opacity-70'>
                      {tab === 'free' && 'Basic features & daily limits'}
                      {tab === 'premium' &&
                        'Unlimited access & premium features'}
                      {tab === 'admin' && 'System administration access'}
                      {tab === 'developer' && 'Development & debugging tools'}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Features Preview */}
            <div className='mt-8'>
              <h4 className='text-sm font-semibold text-cyan-300 mb-4'>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{' '}
                Features
              </h4>

              <div className='space-y-2 text-xs text-cyan-300/70'>
                {activeTab === 'free' && (
                  <>
                    <div className='flex items-center gap-2'>
                      <Star className='w-3 h-3' />
                      <span>50 tokens daily</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Star className='w-3 h-3' />
                      <span>Basic AI image generation</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Star className='w-3 h-3' />
                      <span>2 images per generation</span>
                    </div>
                  </>
                )}

                {activeTab === 'premium' && (
                  <>
                    <div className='flex items-center gap-2'>
                      <Crown className='w-3 h-3 text-yellow-400' />
                      <span>Unlimited tokens</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Crown className='w-3 h-3 text-yellow-400' />
                      <span>Canvas AI Editor</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Crown className='w-3 h-3 text-yellow-400' />
                      <span>Custom model training</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Crown className='w-3 h-3 text-yellow-400' />
                      <span>Priority support</span>
                    </div>
                  </>
                )}

                {(activeTab === 'admin' || activeTab === 'developer') && (
                  <>
                    <div className='flex items-center gap-2'>
                      <Shield className='w-3 h-3 text-red-400' />
                      <span>System management</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Shield className='w-3 h-3 text-red-400' />
                      <span>User management</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Shield className='w-3 h-3 text-red-400' />
                      <span>Analytics dashboard</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className='flex-1 p-6'>
            <div className='max-w-md mx-auto'>
              <h3 className='text-xl font-bold text-cyan-300 mb-6 text-center'>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Login
              </h3>

              {/* Social Login (Free/Premium only) */}
              {(activeTab === 'free' || activeTab === 'premium') && (
                <div className='space-y-3 mb-6'>
                  <button
                    onClick={() => handleSocialLogin('google')}
                    disabled={isLoading}
                    className='seraphine-neural-btn w-full ghost p-3 flex items-center justify-center gap-3'
                  >
                    <Chrome className='w-5 h-5' />
                    <span>Continue with Google</span>
                  </button>

                  <button
                    onClick={() => handleSocialLogin('facebook')}
                    disabled={isLoading}
                    className='seraphine-neural-btn w-full ghost p-3 flex items-center justify-center gap-3'
                  >
                    <Facebook className='w-5 h-5' />
                    <span>Continue with Facebook</span>
                  </button>

                  <div className='flex items-center gap-4 my-6'>
                    <div className='flex-1 h-px bg-cyan-500/20'></div>
                    <span className='text-cyan-300/50 text-sm'>OR</span>
                    <div className='flex-1 h-px bg-cyan-500/20'></div>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className='space-y-4'>
                {/* Email */}
                <div>
                  <label className='block text-sm text-cyan-300 mb-2'>
                    <Mail className='w-4 h-4 inline mr-2' />
                    Email Address
                  </label>
                  <input
                    type='email'
                    value={loginForm.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    placeholder='neural.user@seraphine.ai'
                    className='w-full p-3 bg-black/50 border border-cyan-500/20 rounded text-cyan-300 placeholder-cyan-300/50 focus:border-cyan-400 focus:outline-none'
                  />
                </div>

                {/* Phone (Premium/Admin/Developer) */}
                {activeTab !== 'free' && (
                  <div>
                    <label className='block text-sm text-cyan-300 mb-2'>
                      <Phone className='w-4 h-4 inline mr-2' />
                      Phone Number
                    </label>
                    <input
                      type='tel'
                      value={loginForm.phone}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      placeholder='+1 (555) 123-4567'
                      className='w-full p-3 bg-black/50 border border-cyan-500/20 rounded text-cyan-300 placeholder-cyan-300/50 focus:border-cyan-400 focus:outline-none'
                    />
                  </div>
                )}

                {/* Password */}
                <div>
                  <label className='block text-sm text-cyan-300 mb-2'>
                    <Lock className='w-4 h-4 inline mr-2' />
                    Password
                  </label>
                  <div className='relative'>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={e =>
                        handleInputChange('password', e.target.value)
                      }
                      placeholder='Enter your password'
                      className='w-full p-3 bg-black/50 border border-cyan-500/20 rounded text-cyan-300 placeholder-cyan-300/50 focus:border-cyan-400 focus:outline-none pr-12'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400/70 hover:text-cyan-300'
                    >
                      {showPassword ? (
                        <EyeOff className='w-5 h-5' />
                      ) : (
                        <Eye className='w-5 h-5' />
                      )}
                    </button>
                  </div>
                </div>

                {/* Subscription Code (Premium only) */}
                {activeTab === 'premium' && (
                  <div>
                    <label className='block text-sm text-cyan-300 mb-2'>
                      <Star className='w-4 h-4 inline mr-2' />
                      Subscription Code
                    </label>
                    <input
                      type='text'
                      value={loginForm.subscriptionCode}
                      onChange={e =>
                        handleInputChange('subscriptionCode', e.target.value)
                      }
                      placeholder='PREMIUM-XXXX-XXXX'
                      className='w-full p-3 bg-black/50 border border-yellow-500/20 rounded text-yellow-300 placeholder-yellow-300/50 focus:border-yellow-400 focus:outline-none'
                    />
                  </div>
                )}

                {/* Admin Code (Admin/Developer only) */}
                {(activeTab === 'admin' || activeTab === 'developer') && (
                  <div>
                    <label className='block text-sm text-cyan-300 mb-2'>
                      <Shield className='w-4 h-4 inline mr-2' />
                      {activeTab === 'admin' ? 'Admin' : 'Developer'} Code
                    </label>
                    <input
                      type='password'
                      value={loginForm.adminCode}
                      onChange={e =>
                        handleInputChange('adminCode', e.target.value)
                      }
                      placeholder={`${activeTab.toUpperCase()}-SECURE-CODE`}
                      className='w-full p-3 bg-black/50 border border-red-500/20 rounded text-red-300 placeholder-red-300/50 focus:border-red-400 focus:outline-none'
                    />
                  </div>
                )}

                {/* Remember Me */}
                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    id='remember'
                    checked={loginForm.remember}
                    onChange={e =>
                      handleInputChange('remember', e.target.checked)
                    }
                    className='accent-cyan-400'
                  />
                  <label
                    htmlFor='remember'
                    className='text-sm text-cyan-300/70'
                  >
                    Remember this device
                  </label>
                </div>

                {/* Login Button */}
                <button
                  onClick={() => handleLogin('email')}
                  disabled={isLoading}
                  className='seraphine-neural-btn w-full p-3 flex items-center justify-center gap-2'
                >
                  {isLoading ? (
                    <RefreshCw className='w-5 h-5 animate-spin' />
                  ) : (
                    <>
                      <span>Access Neural Network</span>
                      <ArrowRight className='w-5 h-5' />
                    </>
                  )}
                </button>

                {/* Forgot Password */}
                <div className='text-center'>
                  <button className='text-sm text-cyan-400/70 hover:text-cyan-300'>
                    Forgot your neural access code?
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSystem;
