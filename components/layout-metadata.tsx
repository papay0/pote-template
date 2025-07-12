"use client";

import { useTranslation } from "@/provider/language-provider";
import { useEffect } from "react";

export function LayoutMetadata() {
  const { t } = useTranslation();
  
  useEffect(() => {
    // Update document title
    document.title = t("layout.title");
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t("layout.description"));
    }
  }, [t]);

  return null;
}