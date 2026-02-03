
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CartDrawer from "./cart/CartDrawer";
import { UserMenu } from "./UserMenu";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border"
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/nobg1.png"
              alt="TRUE DIAL"
              className="h-12 md:h-16 w-auto object-contain"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            <Link
              to="/shop"
              className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Shop
            </Link>
            <Link
              to="/about"
              className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Contact
            </Link>
            <UserMenu />
            <CartDrawer />
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <UserMenu />
            <CartDrawer />
            <button className="p-2" aria-label="Menu">
              <div className="w-5 h-px bg-foreground mb-1.5"></div>
              <div className="w-5 h-px bg-foreground"></div>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;