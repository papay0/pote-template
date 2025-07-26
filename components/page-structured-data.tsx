"use client";

import { JsonLd } from '@/components/json-ld';
import { useTranslation } from '@/provider/language-provider';
import {
  getOrganizationSchema,
  getLocalBusinessSchema,
  getWebSiteSchema,
} from '@/lib/structured-data';

export function PageStructuredData() {
  const { t, locale } = useTranslation();

  return (
    <>
      <JsonLd data={getOrganizationSchema(t)} />
      <JsonLd data={getLocalBusinessSchema(t)} />
      <JsonLd data={getWebSiteSchema(t, locale)} />
    </>
  );
}