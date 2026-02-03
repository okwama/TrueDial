import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="section-container section-padding">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img
                src="/nobg1.png"
                alt="TRUE DIAL"
                className="h-12 md:h-16 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm font-light opacity-70 leading-relaxed max-w-xs">
              Timeless watches with classic design. New & pre-owned pieces. Honest condition. Fair pricing.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-6 opacity-50">Navigate</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/shop" className="text-sm font-light opacity-70 hover:opacity-100 transition-opacity">
                Shop Collection
              </Link>
              <Link to="/about" className="text-sm font-light opacity-70 hover:opacity-100 transition-opacity">
                About Us
              </Link>
              <Link to="/shipping" className="text-sm font-light opacity-70 hover:opacity-100 transition-opacity">
                Shipping & Returns
              </Link>
              <Link to="/contact" className="text-sm font-light opacity-70 hover:opacity-100 transition-opacity">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-6 opacity-50">Connect</h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-light opacity-70 hover:opacity-100 transition-opacity"
              >
                WhatsApp
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-light opacity-70 hover:opacity-100 transition-opacity"
              >
                Instagram
              </a>
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-light opacity-70 hover:opacity-100 transition-opacity"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-primary-foreground/10 mb-8"></div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-light opacity-50">
            © {new Date().getFullYear()} TRUE DIAL. All rights reserved.
          </p>
          <p className="text-xs font-light opacity-50">
            Based in Kenya 🇰🇪
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;