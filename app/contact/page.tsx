"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/provider/language-provider";
import { useAnalytics } from "@/lib/useAnalytics";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

export default function Contact() {
  const { t } = useTranslation();
  const { logTap } = useAnalytics();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          {t.contact.title}
        </h1>
        <p className="text-xl text-muted-foreground">
          {t.contact.subtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <MapPin className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-semibold">{t.contact.info.address}</h3>
                <p className="text-muted-foreground">{t.footer.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Phone className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-semibold">{t.contact.info.phone}</h3>
                <a 
                  href={`tel:${t.footer.phone}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => logTap('contact_phone_click', { phone: t.footer.phone })}
                >
                  {t.footer.phone}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Mail className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-semibold">{t.contact.info.email}</h3>
                <a 
                  href={`mailto:${t.footer.email}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => logTap('contact_email_click', { email: t.footer.email })}
                >
                  {t.footer.email}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Clock className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-semibold">{t.footer.businessHours}</h3>
                <div className="text-muted-foreground">
                  <p>{t.footer.hours.weekdays}</p>
                  <p>{t.footer.hours.weekends}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}