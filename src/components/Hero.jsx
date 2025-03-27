import { ArrowRight } from "lucide-react";
import hero from "../assets/hero.mp4";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 px-4 md:px-8 bg-black text-white overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70 z-0" />
      <div className="absolute inset-0 bg-[url('/path/to/texture.png')] opacity-10 z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Column */}
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Manage Your <span className="text-yellow-400">Invoices</span> With Ease
            </h1>
            <p className="text-lg text-gray-300">
              Scan, track, and organize all your invoices in one place. Save time and never lose a receipt again.
            </p>
            <div className="pt-4">
              <button
                onClick= {() => navigate("/login")}
                className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-yellow-500/30 hover:cursor-pointer hover:-translate-y-1 focus:outline-none focus:ring-2"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:w-1/2 relative">
            <div className="relative w-full aspect-[1.2] mx-auto">
              <video
                src={hero}
                autoPlay
                muted
                playsInline
                className="w-full h-full rounded-2xl shadow-2xl shadow-yellow-500/20 border border-yellow-500/10 object-cover"
              />
              {/* Badge */}
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black p-4 rounded-xl font-bold shadow-lg">
                Save 30% Time
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
