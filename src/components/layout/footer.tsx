import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

const socialLinks = [
  {
    href: "https://github.com/garyjohnson",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "https://www.linkedin.com/in/gary-johnson-3228376/",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "mailto:hello@jazzbassjohnson.com",
    label: "Email",
    icon: Mail,
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <Link href="/" className="text-lg font-bold gradient-text">
              jazzbassjohnson.com
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              Developer. Musician. Operations Leader.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label={link.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Gary Johnson. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
