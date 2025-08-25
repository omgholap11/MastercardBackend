import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/src/assets/book-donation.png"
                alt="Seva Sahayog"
                className="w-10 h-10"
              />
              <h3 className="text-xl font-bold text-white">Seva Sahayog</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Connecting generous hearts with those in need. Together, we create
              meaningful change in our community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/donation"
                  className="text-gray-300 hover:text-primary transition-colors duration-200"
                >
                  Donate Now
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-primary transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-primary transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              Categories
            </h4>
            <ul className="space-y-2">
              <li className="text-gray-300">Food & Nutrition</li>
              <li className="text-gray-300">Clothes & Apparel</li>
              <li className="text-gray-300">Stationery & Books</li>
              <li className="text-gray-300">Furniture & Equipment</li>
              <li className="text-gray-300">Electronics</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              Get in Touch
            </h4>
            <div className="space-y-2">
              <p className="text-gray-300">
                <span className="font-medium">Email:</span> info@sevasahayog.org
              </p>
              <p className="text-gray-300">
                <span className="font-medium">Phone:</span> +91 9876543210
              </p>
              <p className="text-gray-300">
                <span className="font-medium">Address:</span> Mumbai,
                Maharashtra, India
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 Seva Sahayog Foundation. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="text-gray-300 hover:text-primary text-sm transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-300 hover:text-primary text-sm transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
