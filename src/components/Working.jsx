import { ArrowDown } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Scan Your Invoice",
      description:
        "Use your phone camera to scan invoices or upload digital copies",
      icon: "📸",
    },
    {
      step: "02",
      title: "AI Processing",
      description: "Smart extraction and categorization of invoice data",
      icon: "🤖",
    },
    {
      step: "03",
      title: "Manage & Track",
      description: "Real-time expense tracking and report generation",
      icon: "📊",
    },
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-black" id="how-it-works">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-gray-400 text-xl mt-4 max-w-2xl mx-auto">
            Transform your invoice management in three simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-16 md:gap-8">
          {/* Steps */}
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group flex flex-col items-center"
            >
              {/* Card Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-yellow-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 -z-10 scale-90 group-hover:scale-110"></div>

              {/* Step Card */}
              <div className="relative z-10 w-full max-w-sm bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-4 border border-gray-800 group-hover:border-orange-500/50 shadow-[0_0_15px_rgba(0,0,0,0.2)] group-hover:shadow-[0_10px_25px_rgba(249,115,22,0.2)]">
                {/* Subtle Pattern Overlay */}
                <div className="absolute inset-0 rounded-2xl opacity-10 mix-blend-soft-light overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
                </div>

                {/* Icon Container */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    {" "}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-full animate-ping opacity-75" />
                    {/* Icon Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-md opacity-80"></div>
                    {/* Icon Container */}
                    <div className="relative w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl backdrop-blur-lg transition-transform duration-300 group-hover:scale-110 shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                      <span className="text-white drop-shadow-md">
                        {step.icon}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-12 text-center relative">
                  {/* Step Number */}
                  <div className="text-orange-500/10 text-7xl font-bold absolute -top-2 left-1/2 -translate-x-1/2 w-full transition-all duration-300 group-hover:text-orange-500/15">
                    {step.step}
                  </div>

                  {/* Title with Gradient */}
                  <h3 className="text-2xl font-semibold mb-3 relative">
                    <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent group-hover:from-yellow-200 group-hover:to-orange-100 transition-all duration-300">
                      {step.title}
                    </span>
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {step.description}
                  </p>

                  {/* Glowing Line */}
                  <div className="h-1 w-12 mx-auto mt-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-50 group-hover:w-24 group-hover:opacity-100 transition-all duration-300"></div>
                </div>
              </div>

              {/* Mobile Arrows */}
              {index < steps.length - 1 && (
                <div className="md:hidden pt-12 flex flex-col items-center">
                  <ArrowDown className="text-orange-500 w-10 h-10 animate-bounce" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
