import { User, Briefcase, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";

export default function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    console.log(`Selected role: ${role}`);
    navigate(`/register/${role}`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
     <Header/>
      {/* Content */}
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
            {/* Header with gradient */}
            <div className="h-2 bg-gradient-to-r from-yellow-500 to-orange-500"></div>

            <div className="p-8">
              <Link to="/login" className="inline-flex items-center text-sm text-gray-400 hover:text-yellow-400 mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to login
              </Link>

              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
                <p className="text-gray-400">Select your account type to get started</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 ">
                {/* User Role Card */}
                <button
                  onClick={() => handleRoleSelect("user")}
                  className="group p-6 bg-zinc-800 rounded-xl border border-zinc-700 hover:border-yellow-400/50 transition-all flex flex-col items-center text-center hover:cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-yellow-400/20 flex items-center justify-center mb-4 group-hover:bg-yellow-400/30 transition-colors">
                    <User className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Personal User</h3>
                  <p className="text-sm text-gray-400">Manage your personal or small business invoices and receipts</p>
                </button>

                {/* Accountant Role Card */}
                <button
                  onClick={() => handleRoleSelect("accountant")}
                  className="group p-6 bg-zinc-800 rounded-xl border border-zinc-700 hover:border-orange-400/50 transition-all flex flex-col items-center text-center hover:cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors">
                    <Briefcase className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Accountant</h3>
                  <p className="text-sm text-gray-400">
                    Professional access to manage multiple client accounts and advanced features
                  </p>
                </button>
              </div>

              <div className="mt-8 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50 text-sm text-gray-400">
                <p className="ml-8">
                  Already have an account?{" "}
                  <Link to="/login" className="text-yellow-400 hover:underline">
                    Sign in instead
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Elements */}
      <div className="hidden lg:block fixed bottom-0 left-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 z-0"></div>
      <div className="hidden lg:block fixed top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 z-0"></div>
    </div>
  );
}
