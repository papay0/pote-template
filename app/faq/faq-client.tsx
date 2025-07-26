"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "@/provider/language-provider";
import { useAnalytics } from "@/lib/useAnalytics";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { getFAQSchema, getBreadcrumbSchema } from "@/lib/structured-data";

export default function FAQClient() {
  const { t } = useTranslation();
  const { logTap } = useAnalytics();

  const breadcrumbItems = [
    { name: t.nav.home, url: 'https://example.com' },
    { name: t.nav.faq, url: 'https://example.com/faq' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <JsonLd data={getFAQSchema(t.faq.questions)} />
      <JsonLd data={getBreadcrumbSchema(breadcrumbItems)} />
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          {t.faq.title}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t.faq.subtitle}
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {t.faq.questions.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger 
                    className="text-left"
                    onClick={() => logTap('faq_question_click', { question: item.question, index })}
                  >
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="mt-12">
          <CardHeader className="text-center">
            <CardTitle>{t.faq.cta.title}</CardTitle>
            <CardDescription>
              {t.faq.cta.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link 
                  href="/contact"
                  onClick={() => logTap('faq_contact_cta_click')}
                >
                  {t.faq.cta.button}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <a 
                  href={`tel:${t.footer.phone}`}
                  onClick={() => logTap('faq_phone_cta_click', { phone: t.footer.phone })}
                >
                  Call {t.footer.phone}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}