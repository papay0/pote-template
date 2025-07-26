"use client";

import Link from "next/link";
import { useTranslation } from "@/provider/language-provider";
import { useAnalytics } from "@/lib/useAnalytics";
import { LanguagePicker } from "@/components/language-picker";

export function Footer() {
  const { t } = useTranslation();
  const { logTap } = useAnalytics();

  return (
    <footer className="bg-background border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t.brand.name}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t.brand.description}
            </p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t.footer.address}
              </p>
              <p className="text-sm text-muted-foreground">
                <a 
                  href={`tel:${t.footer.phone}`}
                  onClick={() => logTap('footer_phone_click', { phone: t.footer.phone })}
                  className="hover:text-foreground transition-colors"
                >
                  {t.footer.phone}
                </a>
              </p>
              <p className="text-sm text-muted-foreground">
                <a 
                  href={`mailto:${t.footer.email}`}
                  onClick={() => logTap('footer_email_click', { email: t.footer.email })}
                  className="hover:text-foreground transition-colors"
                >
                  {t.footer.email}
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t.nav.contact}
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t.nav.faq}
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t.footer.businessHours}
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t.footer.hours.weekdays}
              </p>
              <p className="text-sm text-muted-foreground">
                {t.footer.hours.weekends}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col items-center gap-4">
            <LanguagePicker />
            <p className="text-center text-sm text-muted-foreground">
              {t.footer.copyright.replace('{{year}}', new Date().getFullYear().toString())}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}