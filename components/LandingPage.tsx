

import React, { useState } from 'react';
import { ArrowRightIcon, Bars3Icon, ChartBarIcon, EyeIcon, LifebuoyIcon, ShieldCheckIcon, UserPlusIcon, WalletIcon, XMarkIcon } from './Icons';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="text-gray-800 dark:text-gray-200">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
              <span className="text-xl font-bold text-gray-900 dark:text-white">INVEST EMPOWERMENT</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
                <nav className="flex items-center gap-8">
                <a onClick={() => scrollTo('how-it-works')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors">How It Works</a>
                <a onClick={() => scrollTo('about')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors">About Us</a>
                <a onClick={() => scrollTo('testimonials')} className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors">Testimonials</a>
                </nav>
                <button onClick={onGetStarted} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-5 rounded-lg transition-colors">
                Get Started
                <ArrowRightIcon className="w-4 h-4" />
                </button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Dropdown Menu */}
        <div className={`md:hidden absolute top-20 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-96 shadow-lg' : 'max-h-0'}`}>
            <div className="p-4 space-y-4">
                <a onClick={() => { scrollTo('how-it-works'); setIsMenuOpen(false); }} className="block text-center text-base font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors p-2 rounded-md">How It Works</a>
                <a onClick={() => { scrollTo('about'); setIsMenuOpen(false); }} className="block text-center text-base font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors p-2 rounded-md">About Us</a>
                <a onClick={() => { scrollTo('testimonials'); setIsMenuOpen(false); }} className="block text-center text-base font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors p-2 rounded-md">Testimonials</a>
                <button onClick={() => { onGetStarted(); setIsMenuOpen(false); }} className="w-full mt-2 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-lg transition-colors">
                    Get Started
                    <ArrowRightIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 text-center bg-blue-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              A New Beginning for Your Finances.
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A transparent, faith-based investment platform designed to help you recover, grow, and achieve financial stability with confidence and personal guidance.
            </p>
            <button onClick={onGetStarted} className="mt-8 inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg py-4 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl">
              Create Your Secure Investment
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Start Your Journey in 3 Simple Steps</h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">We make investing straightforward and secure.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-blue-50 dark:bg-gray-800/50 p-8 rounded-2xl border border-blue-100 dark:border-gray-700">
                <div className="flex justify-center items-center h-16 w-16 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full mx-auto mb-4">
                    <UserPlusIcon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">1. Create Your Account</h3>
                <p className="text-gray-600 dark:text-gray-400">Sign up securely in minutes and create your personal, password-protected investment.</p>
              </div>
              <div className="bg-blue-50 dark:bg-gray-800/50 p-8 rounded-2xl border border-blue-100 dark:border-gray-700">
                <div className="flex justify-center items-center h-16 w-16 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full mx-auto mb-4">
                    <WalletIcon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">2. Start with a Small Amount</h3>
                <p className="text-gray-600 dark:text-gray-400">Begin with an amount you're comfortable with to test the system and build your confidence.</p>
              </div>
              <div className="bg-blue-50 dark:bg-gray-800/50 p-8 rounded-2xl border border-blue-100 dark:border-gray-700">
                <div className="flex justify-center items-center h-16 w-16 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full mx-auto mb-4">
                    <ChartBarIcon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">3. Receive Your Profit</h3>
                <p className="text-gray-600 dark:text-gray-400">See your profit delivered directly to your account, ready to be withdrawn or reinvested.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pastor's Message Section */}
        <section id="about" className="py-20 bg-emerald-50 dark:bg-emerald-900/20">
           <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden p-8 sm:p-10">
                <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-6 mb-6">
                  <img src="https://i.imgur.com/T5S2pZf.jpg" alt="Pastor Jessica Allen" className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md" />
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">A Message from Pastor Jessica Allen</h2>
                    <p className="text-md text-emerald-700 dark:text-emerald-400 font-medium mt-1">Restoring Hope and Building a Secure Future Together</p>
                  </div>
                </div>
                <div className="text-gray-700 dark:text-gray-300 space-y-4 text-left leading-relaxed">
                  <p>"I know what it feels like to be hurt by scams. This platform is my prayer answered—a ministry of restoration to help you recover and grow. Unlike scammers, we are transparent and operate openly. Every transaction is traceable, and I personally guide everyone."</p>
                  <p>"Trust is earned. That’s why I encourage you to start small. My mission is to restore hope and financial stability. This is more than business—<strong className="text-gray-800 dark:text-white">it’s God’s work of restoration.</strong>"</p>
                </div>
              </div>
           </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Designed for Your Peace of Mind</h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Your security and success are our highest priorities.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center"><ShieldCheckIcon className="w-7 h-7"/></div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Secure & Private</h3>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">Your account is protected by a password, ensuring only you can access your investment.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center"><EyeIcon className="w-7 h-7"/></div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Full Transparency</h3>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">Track every transaction and see exactly where your money is and how it's performing.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center"><LifebuoyIcon className="w-7 h-7"/></div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Guidance</h3>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">You're not alone. Pastor Jessica and her team are here to support you at every step.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-blue-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Join Our Growing Community</h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Hear from members in pacific island countries who have found hope and success.</p>
                </div>
                <div className="space-y-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-300 italic mb-4">"After being scammed, I was scared to trust again. Pastor Jessica's platform is different. It’s real. I started small and saw my first profit in two days. I finally feel hopeful about my future."</p>
                        <div className="flex items-center gap-3">
                            <img src="https://images.pexels.com/photos/3769383/pexels-photo-3769383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Mary T." className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-white">Mary T.</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Port Moresby, Papua New Guinea</p>
                            </div>
                        </div>
                    </div>
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-300 italic mb-4">"I was looking for a reliable way to invest from Fiji and found this platform. It's so straightforward, and the support from Pastor Jessica is amazing. My small investment has already shown profit, and I feel secure knowing it's a legitimate, faith-driven initiative."</p>
                        <div className="flex items-center gap-3">
                            <img src="https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Ratu S." className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-white">Ratu S.</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Suva, Fiji</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-300 italic mb-4">"The transparency is what I love. I can see all my transactions and balances clearly in the app. The personal guidance from Pastor Jessica gave me the confidence to start investing again safely."</p>
                         <div className="flex items-center gap-3">
                            <img src="https://images.pexels.com/photos/819530/pexels-photo-819530.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="David K." className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-white">David K.</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Lae, Papua New Guinea</p>
                            </div>
                        </div>
                    </div>
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-300 italic mb-4">"Losing money to a scam was devastating. This platform has been a blessing for me and my family. The process is transparent, and seeing the profits come in has restored my confidence. It truly feels like a ministry of financial healing."</p>
                         <div className="flex items-center gap-3">
                            <img src="https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Grace V." className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-white">Grace V.</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Honiara, Solomon Islands</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-300 italic mb-4">"I'm not an expert in technology, but the app is so easy to use. I added a small amount, and everything was explained clearly. Seeing my profit appear exactly when they said it would has restored my faith in online platforms."</p>
                         <div className="flex items-center gap-3">
                            <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="John P." className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-white">John P.</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Mount Hagen, Papua New Guinea</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-300 italic mb-4">"What I appreciate most is the feeling of community and support. It doesn't feel like a cold, corporate thing. It feels like people who genuinely care about helping you succeed. This is more than just an investment; it's a blessing."</p>
                        <div className="flex items-center gap-3">
                            <img src="https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Sarah L." className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-white">Sarah L.</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Goroka, Papua New Guinea</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-300 italic mb-4">"It feels good to be part of an investment community that shares my values. The app is simple, and I can track everything easily. This is a trustworthy platform for anyone in the Pacific looking to grow their savings."</p>
                        <div className="flex items-center gap-3">
                            <img src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Tui F." className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-white">Tui F.</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Apia, Samoa</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        {/* Final CTA */}
        <section className="py-20 text-center bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
              Ready to Restore Your Financial Hope?
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join a trustworthy community dedicated to your growth and success. Your secure investment is just minutes away.
            </p>
            <button onClick={onGetStarted} className="mt-8 inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg py-4 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl">
              Get Started Now
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-black/50 text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; {new Date().getFullYear()} INVEST EMPOWERMENT. All Rights Reserved.</p>
            <p className="text-sm text-gray-400 mt-2">. .</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;