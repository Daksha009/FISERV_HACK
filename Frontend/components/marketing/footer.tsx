import Link from "next/link";
import { CreditCard, Github, Linkedin, Twitter, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-lg shadow-primary/20">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-foreground leading-none">PayFlex</span>
                <span className="text-[9px] font-bold text-primary uppercase tracking-[0.15em] leading-none mt-0.5">BNPL Engine</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered Buy Now Pay Later eligibility engine with transparent credit scoring.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              {[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Features", href: "/#features" },
                { label: "How It Works", href: "/#how-it-works" },
                { label: "API Documentation", href: "/api-docs" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              {[
                { label: "About the Engine", href: "/about" },
                { label: "Scoring Model", href: "/about#scoring" },
                { label: "Risk Bands", href: "/about#risk-bands" },
                { label: "EMI Calculator", href: "/dashboard" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4">Built With</h4>
            <div className="flex flex-wrap gap-2">
              {[
                "Next.js 16",
                "React 19",
                "TypeScript",
                "Tailwind CSS 4",
                "Three.js",
                "Gemini AI",
                "Recharts",
                "Radix UI",
              ].map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg bg-muted/50 text-muted-foreground border border-border/50"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for modern financial experiences</span>
          </div>

          <div className="flex items-center gap-3">
            {[
              { icon: Github, href: "https://github.com/Daksha009", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/dksh-sharma", label: "LinkedIn" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-4.5 h-4.5" />
              </a>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PayFlex BNPL. Simulator for educational purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
