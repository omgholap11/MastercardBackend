import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Bell, User, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Logo from "../../assets/book-donation.png";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, logout } = useAuth();


  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/");
    }
  };

  const getRoleDisplay = (role) => {
    if (role === 'donor') return '🎁 Donor';
    if (role === 'receiver') return '🤝 Receiver';
    return '';
  };

  const getRoleBadgeColor = (role) => {
    if (role === 'donor') return 'bg-green-100 text-green-800 border-green-200';
    if (role === 'receiver') return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <header className="bg-white shadow-md border-b border-accent sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={Logo}
              alt="Seva Sahayog Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
            />
            <span className="text-xl sm:text-2xl font-bold text-primary">
              Seva Sahayog
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-secondary hover:text-primary transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link
              to="/donation"
              className="text-secondary hover:text-primary transition-colors duration-200 font-medium"
            >
              Donate
            </Link>
            <Link
              to="/recipient"
              className="text-secondary hover:text-primary transition-colors duration-200 font-medium"
            >
              For Organizations
            </Link>
            <Link
              to="/contact"
              className="text-secondary hover:text-primary transition-colors duration-200 font-medium"
            >
              Contact
            </Link>
          </nav>

          {/* Right Section: Authentication-based content */}
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            ) : isAuthenticated ? (
              <>
                {/* Notifications Bell - Only for authenticated users */}
                <button className="hidden sm:block p-2 text-secondary hover:text-primary transition-colors duration-200">
                  <Bell className="w-6 h-6" />
                </button>

                {/* User Profile with Role Badge */}
                <div className="hidden sm:flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user?.role)}`}>
                    {getRoleDisplay(user?.role)}
                  </div>
                  <button className="p-2 text-secondary hover:text-primary transition-colors duration-200">
                    <User className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-secondary hover:text-red-600 transition-colors duration-200"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Login/Register Buttons for non-authenticated users */}
                <button
                  onClick={() => navigate('/auth/register')}
                  className="hidden sm:block px-4 py-2 text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-all duration-200 font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/auth/register')}
                  className="hidden sm:block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-200 font-medium"
                >
                  Register
                </button>
              </>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-secondary hover:text-primary transition-colors duration-200"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-accent shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-1 py-4">
              <Link
                to="/"
                className="text-secondary hover:text-primary hover:bg-accent transition-all duration-200 font-medium px-3 py-2 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/donation"
                className="text-secondary hover:text-primary hover:bg-accent transition-all duration-200 font-medium px-3 py-2 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Donate
              </Link>
              <Link
                to="/recipient"
                className="text-secondary hover:text-primary hover:bg-accent transition-all duration-200 font-medium px-3 py-2 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                For Organizations
              </Link>
              <Link
                to="/contact"
                className="text-secondary hover:text-primary hover:bg-accent transition-all duration-200 font-medium px-3 py-2 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>

              {/* Mobile-only actions */}
              <div className="pt-3 mt-3 border-t border-accent">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user?.role)}`}>
                        {getRoleDisplay(user?.role)}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button className="flex items-center gap-2 text-secondary hover:text-primary transition-colors duration-200">
                        <Bell className="w-5 h-5" />
                        <span className="text-sm font-medium">Notifications</span>
                      </button>
                      <button className="flex items-center gap-2 text-secondary hover:text-primary transition-colors duration-200">
                        <User className="w-5 h-5" />
                        <span className="text-sm font-medium">Profile</span>
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-secondary hover:text-red-600 transition-colors duration-200"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        navigate('/auth/register');
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-2 text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-all duration-200 font-medium"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        navigate('/auth/register');
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-200 font-medium"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
