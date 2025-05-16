import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Working from '../components/Working';
import Footer from '../components/Footer';

function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar/>
      <main className="flex-grow">
        <Hero/>
        <Features/>
        <Working/>
      </main>
      <Footer/>
    </div>
  )
}

export default LandingPage;
