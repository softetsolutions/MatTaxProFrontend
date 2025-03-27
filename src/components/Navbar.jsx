import { useState} from "react";
import { Menu, X, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)

    // Prevent scrolling when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }
  const onLoginClick = () =>{
    navigate("/login");
  }

  return (
    <>
      <nav className="sticky top-0 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 py-4 px-4 z-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <a href="/" className="flex items-center gap-2">
              <Receipt className="w-6 h-6 text-yellow-400" />
              <span className="font-bold text-xl">MatTaxPro</span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              {["Features", "How It Works", "Pricing"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-gray-300 hover:text-yellow-400 transition-colors relative group"
                >
                  {item}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={onLoginClick}
                className="hidden md:block hover:cursor-pointer px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
              >
                Login
              </button>

              {/* Hamburger menu button  */}
              <button
                className="md:hidden text-gray-300 hover:text-yellow-400 transition-colors"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 bg-zinc-900/95 backdrop-blur-sm z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-8">
            <a href="/" className="flex items-center gap-2">
              <Receipt className="w-6 h-6 text-yellow-400" />
              <span className="font-bold text-xl">MatTaxPro</span>
            </a>
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-yellow-400 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-6 mt-8">
            {["Features", "How It Works", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-gray-300 hover:text-yellow-400 transition-colors text-xl font-medium relative group"
                onClick={toggleMenu}
              >
                {item}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="mt-auto mb-8">
            <button
              onClick={() => {
                toggleMenu()
                onLoginClick()
              }}
              className="w-full hover:cursor-pointer px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors text-center"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar

