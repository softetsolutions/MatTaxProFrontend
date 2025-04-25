import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { LogOut } from "lucide-react";
import { routeMapping, iconMapping } from "../../utils/constant";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { fetchAndUpdatePendingInvitationsCount } from "../../utils/invitationHelper";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [pendingInvitationsCount, setPendingInvitationsCount] = useState(0);

  const navigation = jwtDecode(
    localStorage.getItem("userToken")
  ).allowedRoutes.filter((item) => Object.keys(routeMapping).includes(item));

  useEffect(() => {
    fetchAndUpdatePendingInvitationsCount(setPendingInvitationsCount);
    const interval = setInterval(
      () => fetchAndUpdatePendingInvitationsCount(setPendingInvitationsCount),
      30000
    );
    return () => clearInterval(interval);
  }, []);

  console.log("navigation", navigation);

  const handleLogOut = async () => {
    try {
      // Simulate authentication
      let user = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (user.status !== 200) {
        toast.fail("Error logging out");
        throw new Error("Error logging out");
      }
      localStorage.removeItem("userToken");
      toast.success("Wohha logged out successfully!");
      navigate("/");
    } catch (e) {
      toast.error("Please try again.");
      console.error(e);
    }
  };

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
            {navigation.map((item) => {
              const Icon = iconMapping(item);
              const isInvitation = item === "invitations";

              return (
                <NavLink
                  key={item}
                  to={item}
                  end
                  className={({ isActive }) => {
                    const baseClasses =
                      "group flex items-center px-4 py-3 text-sm rounded-lg transition-colors";
                    const isBin = item === "bin";

                    const activeClass = isBin
                      ? "text-red-600 hover:bg-gray-50 border-l-4 border-blue-500 bg-gray-100"
                      : "bg-gray-100 text-black font-medium border-l-4 border-blue-500";

                    const inactiveClass = isBin
                      ? "text-red-600 hover:bg-gray-50"
                      : "text-gray-700 hover:bg-gray-50";

                    return `${baseClasses} ${
                      isActive ? activeClass : inactiveClass
                    }`;
                  }}
                >
                  <div className="flex items-center">
                    <div className="relative w-5 mr-3">
                      {Icon && (
                        <Icon
                          className={`h-5 w-5 ${
                            item === "bin"
                              ? "text-current group-hover:text-current"
                              : "text-gray-500 group-hover:text-blue-500"
                          }`}
                        />
                      )}
                      {isInvitation && pendingInvitationsCount > 0 && (
                        <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white px-1">
                          {pendingInvitationsCount}
                        </span>
                      )}
                    </div>
                    <span>{routeMapping[item]}</span>
                  </div>
                </NavLink>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="mt-auto">
            <button
              onClick={handleLogOut}
              className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg w-full transition-colors hover:cursor-pointer"
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
