import { BarChart2, FileText, Receipt, Scan, User, ArrowRight } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Scan className="w-10 h-10 text-orange-500" />,
      title: "Scan Invoices",
      description: "Quickly scan physical invoices with your camera and convert them to digital format",
    },
    {
      icon: <FileText className="w-10 h-10 text-orange-500" />,
      title: "Organize Documents",
      description: "Categorize and organize your invoices with custom tags and folders",
    },
    {
      icon: <Receipt className="w-10 h-10 text-orange-500" />,
      title: "Track Expenses",
      description: "Monitor your spending patterns and track expenses across different categories",
    },
    {
      icon: <BarChart2 className="w-10 h-10 text-orange-500" />,
      title: "Analytics Dashboard",
      description: "Get insights into your spending with detailed analytics and reports",
    },
    {
      icon: <User className="w-10 h-10 text-orange-500" />,
      title: "Multi-User Access",
      description: "Share access with your team or accountant with customizable permissions",
    },
    {
      icon: <ArrowRight className="w-10 h-10 text-orange-500" />,
      title: "Export Data",
      description: "Export your data in multiple formats for accounting software integration",
    },
  ]

  return (
    <section className="py-20 px-4 md:px-8 bg-zinc-900" id="features">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Powerful <span className="text-yellow-400">Features</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Everything you need to manage your invoices efficiently in one platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-zinc-800 p-6 rounded-xl hover:bg-zinc-800/80 transition-colors border border-zinc-700 hover:border-yellow-400/50"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl text-white font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

