
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Keyboard, Zap, TrendingUp, Target, Gamepad2, ArrowRight, Monitor } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useIsMobileOrTablet } from '@/hooks/use-mobile';

const Index = () => {
  const { state } = useApp();
  const featuresAnimation = useScrollAnimation();
  const isMobileOrTablet = useIsMobileOrTablet();

  return (
    <>
      {/* Mobile/Tablet Restriction Dialog */}
      <AlertDialog open={isMobileOrTablet} onOpenChange={() => {}}>
        <AlertDialogContent className="sm:max-w-md border-white bg-black text-white font-mono">
          <AlertDialogHeader className="text-center space-y-6 p-6">
            <div className="flex justify-center">
              <div className="p-3 border border-white rounded-sm">
                <Monitor className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="space-y-4 text-center">
              <AlertDialogTitle className="text-xl font-bold tracking-wide text-white text-center">
                [ Desktop Recommended ]
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base leading-relaxed text-gray-300 text-center mx-auto max-w-xs">
                For the best typing experience, we recommend using a desktop with a full keyboard!
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      <div className={`min-h-screen transition-all duration-700 font-mono ${
        state.theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
      }`}>
      {/* Header */}
      <header className="border-b border-current p-4 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 group">
            <Keyboard className="w-8 h-8 animate-float" />
            <h1 className="text-3xl font-bold tracking-tight animate-slide-in-left">Tpix</h1>
          </div>
          <nav className="flex items-center space-x-8">
            <Link 
              to="/practice" 
              className="relative group px-4 py-2 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">[ practice ]</span>
              <div className="absolute inset-0 border border-current opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link 
              to="/dashboard" 
              className="relative group px-4 py-2 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">[ dashboard ]</span>
              <div className="absolute inset-0 border border-current opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8">
        <div className="text-center py-12 lg:py-16 space-y-8">
          <div className="space-y-6">
            <h2 className="text-5xl lg:text-7xl font-bold leading-tight animate-slide-in-up">
              <span className="block animate-slide-in-left [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
                Master the art of typing.
              </span>
              <span className="block animate-slide-in-right [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards] mt-4">
                One keystroke at a time.
              </span>
            </h2>
          </div>
          
          <p className="text-xl lg:text-2xl opacity-70 max-w-3xl mx-auto leading-relaxed animate-slide-in-up [animation-delay:0.8s] opacity-0 [animation-fill-mode:forwards]">
            Tpix is a minimalist typing practice application designed to help you achieve 
            your maximum typing potential through focused, distraction-free training.
          </p>

          <div className="space-y-4 animate-slide-in-up [animation-delay:1s] opacity-0 [animation-fill-mode:forwards]">
            <Link 
              to="/practice" 
              className="group inline-flex items-center justify-center space-x-3 px-10 py-5 border-2 border-current hover:bg-current transition-all duration-300 text-xl font-medium relative overflow-hidden"
            >
              <span className="relative z-10 group-hover:text-black dark:group-hover:text-white transition-colors duration-300 text-center">[ start practicing ]</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 group-hover:text-black dark:group-hover:text-white transition-all duration-300" />
              <div className="absolute inset-0 bg-current transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>
            
            <div className="text-base opacity-50 animate-float">
              No registration required • Start immediately
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="py-12 space-y-12" ref={featuresAnimation.ref}>
          <div className="border border-current relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="relative p-8 md:p-12 lg:p-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                <div className="group/item space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Target className="w-14 h-14 icon-hover-glow cursor-pointer" />
                    </div>
                    <h3 className="text-2xl font-bold text-center">
                      <span className={`transition-all duration-300 ${
                        featuresAnimation.isVisible ? 'typing-animation heading' : 'inline-block'
                      }`}>
                        Focused Practice
                      </span>
                    </h3>
                  </div>
                  <div className="opacity-70 text-base leading-relaxed text-center">
                    <div className={`transition-all duration-700 delay-200 ${
                      featuresAnimation.isVisible ? 'typing-animation no-caret' : 'w-0 overflow-hidden'
                    }`}>
                      Distraction-free environment with real-time feedback on speed, accuracy, and hand distribution for optimal learning.
                    </div>
                  </div>
                </div>
                
                <div className="group/item space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <TrendingUp className="w-14 h-14 icon-hover-glow cursor-pointer" />
                    </div>
                    <h3 className="text-2xl font-bold text-center">
                      <span className={`transition-all duration-300 delay-300 ${
                        featuresAnimation.isVisible ? 'typing-animation heading' : 'inline-block'
                      }`}>
                        Progress Tracking
                      </span>
                    </h3>
                  </div>
                  <div className="opacity-70 text-base leading-relaxed text-center">
                    <div className={`transition-all duration-700 delay-500 ${
                      featuresAnimation.isVisible ? 'typing-animation no-caret' : 'w-0 overflow-hidden'
                    }`}>
                      Detailed analytics and progress charts to monitor your improvement over time with personalized insights.
                    </div>
                  </div>
                </div>
                
                <div className="group/item space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Gamepad2 className="w-14 h-14 icon-hover-glow cursor-pointer" />
                    </div>
                    <h3 className="text-2xl font-bold text-center">
                      <span className={`transition-all duration-300 delay-600 ${
                        featuresAnimation.isVisible ? 'typing-animation heading' : 'inline-block'
                      }`}>
                        Multiple Modes
                      </span>
                    </h3>
                  </div>
                  <div className="opacity-70 text-base leading-relaxed text-center">
                    <div className={`transition-all duration-700 delay-800 ${
                      featuresAnimation.isVisible ? 'typing-animation no-caret' : 'w-0 overflow-hidden'
                    }`}>
                      Practice with different topics, random text generation, and various keyboard layouts for comprehensive training.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gaming Section */}
          <div className="border-t border-current pt-12 animate-slide-in-up [animation-delay:0.8s] opacity-0 [animation-fill-mode:forwards]">
            <div className="text-center mb-8">
              <h3 className="text-4xl font-bold mb-4">The Only Game</h3>
              <p className="opacity-70 text-lg">Challenge yourself with this interactive typing experience</p>
            </div>
            <div className="space-y-6">
              <div className="group border border-current p-6 hover:border-2 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Gamepad2 className="w-6 h-6 group-hover:animate-glow-pulse" />
                      <h4 className="text-2xl font-bold">Typing Racer</h4>
                    </div>
                    <p className="opacity-70 text-base leading-relaxed">
                      Drive down the highway and type words to avoid crashes. Multiple difficulty modes available 
                      for beginners to advanced typists. Race against time and improve your reflexes.
                    </p>
                  </div>
                  <Link 
                    to="/game"
                    className="group/btn flex items-center justify-center space-x-2 px-8 py-4 border border-current hover:bg-current transition-all duration-300 relative overflow-hidden"
                  >
                    <span className="relative z-10 group-hover/btn:text-black dark:group-hover/btn:text-white transition-colors duration-300 text-center">[ play ]</span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:text-black dark:group-hover/btn:text-white transition-all duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="border-t border-current pt-12 text-center animate-slide-in-up [animation-delay:1s] opacity-0 [animation-fill-mode:forwards]">
            <div className="space-y-6">
              <h3 className="text-4xl lg:text-5xl font-bold">Ready to improve your typing?</h3>
              <p className="text-xl opacity-70 max-w-2xl mx-auto">
                Join thousands of users who have already improved their typing skills with Tpix
              </p>
              <Link 
                to="/practice" 
                className="group inline-flex items-center justify-center space-x-3 px-12 py-6 border-2 border-current hover:bg-current transition-all duration-300 text-xl font-medium relative overflow-hidden"
              >
                <span className="relative z-10 group-hover:text-black dark:group-hover:text-white transition-colors duration-300 text-center">[ start now ]</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 group-hover:text-black dark:group-hover:text-white transition-all duration-300" />
                <div className="absolute inset-0 bg-current transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
              <div className="text-base opacity-50">
                Free forever • No credit card required
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-current py-8 mt-12 animate-fade-in [animation-delay:1.2s] opacity-0 [animation-fill-mode:forwards]">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex items-center space-x-3">
              <Keyboard className="w-6 h-6 animate-float" />
              <span className="text-lg font-medium">© 2025 Tpix. All rights reserved.</span>
            </div>
            <div className="flex space-x-8">
              <button 
                onClick={() => console.log('Privacy clicked')}
                className="relative group px-3 py-2 hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10">[ privacy ]</span>
                <div className="absolute inset-0 border border-current opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button 
                onClick={() => console.log('Terms clicked')}
                className="relative group px-3 py-2 hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10">[ terms ]</span>
                <div className="absolute inset-0 border border-current opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button 
                onClick={() => console.log('Contact clicked')}
                className="relative group px-3 py-2 hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10">[ contact ]</span>
                <div className="absolute inset-0 border border-current opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
    </>
  );
};

export default Index;
