import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Working from '../components/Working';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';

function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      <Navbar/>
      <main className="flex-grow">
        <Hero/>
        <Features/>
        <Working/>
      </main>
      <Footer/>
      <CookieConsent/>
    </div>
  )
}

export default LandingPage;
