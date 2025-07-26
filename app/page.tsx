"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/provider/language-provider";
import { useAnalytics } from "@/lib/useAnalytics";
import { Briefcase, Headphones, Laptop } from "lucide-react";

export default function Home() {
  const { t } = useTranslation();
  const { logTap } = useAnalytics();
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            {t.home.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {t.home.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              asChild
              onClick={() => logTap('hero_cta_click')}
            >
              <Link href="/contact">{t.home.hero.cta}</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              asChild
              onClick={() => logTap('hero_secondary_click')}
            >
              <Link href="/faq">{t.home.hero.secondary}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            {t.home.services.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle>{t.home.services.consulting.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {t.home.services.consulting.description}
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <Laptop className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle>{t.home.services.technology.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {t.home.services.technology.description}
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <Headphones className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle>{t.home.services.support.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {t.home.services.support.description}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              {t.home.about.title}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t.home.about.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <a 
                  href={`tel:${t.footer.phone}`}
                  onClick={() => logTap('about_phone_click', { phone: t.footer.phone })}
                >
                  Call {t.footer.phone}
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a 
                  href={`mailto:${t.footer.email}`}
                  onClick={() => logTap('about_email_click', { email: t.footer.email })}
                >
                  Email {t.footer.email}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
