        import { NavLink, Outlet } from "react-router-dom";
        import { History, Zap, Download, Settings, LogOut ,User } from "lucide-react";

        export default function DashboardLayout() {
          const navigation = [
            { name: "Transactions", icon: History, href: "transactions" },
            {name: "Transaction Log", icon: History, href: "transactionlog"},
            {name: "Manage Accountant", icon: User, href: "manage-accountant"},
            { name: "Quick Actions", icon: Zap, href: "quick-actions" },
            { name: "Export", icon: Download, href: "export" },
            { name: "Settings", icon: Settings, href: "settings" },
          ];

          return (
            <div className="flex min-h-screen bg-white">
              {/* Sidebar */}
              <div className="hidden md:flex md:w-64 md:flex-col border-r border-gray-200 bg-white">
                <div className="flex flex-col flex-grow pt-6">
                  {/* Logo */}
                  <div className="px-4 pb-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-black">MatTaxPro</h1>
                    <p className="text-xs text-gray-500">v1.04</p>
                  </div>

                  {/* Navigation */}
                  <nav className="flex-1 px-2 space-y-1 mt-6">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.href}
                        to={item.href}
                        end
                        className={({ isActive }) =>
                          `group flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                            isActive
                              ? "bg-gray-100 text-black font-medium border-l-4 border-blue-500"
                              : "text-gray-700 hover:bg-gray-50"
                          }`
                        }
                      >
                        <item.icon
                          className="mr-3 h-5 w-5 text-gray-500 group-hover:text-blue-500"
                        />
                        {item.name}
                      </NavLink>
                    ))}
                  </nav>

                  {/* Logout Button */}
                  <div className="mt-auto">
                    <button
                      onClick={() => {
                        console.log("Logout clicked");
                      }}
                      className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg w-full transition-colors hover:cursor-pointer "
                    >
                      <LogOut className="mr-3 h-5 w-5 text-gray-500 group-hover:text-red-500" />
                      Logout  
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">© 2025 MatTaxPro.</p>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <main className="flex-1 overflow-auto bg-gray-50">
                <div className="p-6 md:p-8">
                  <Outlet /> 
                </div>
              </main>
            </div>
          );
        }