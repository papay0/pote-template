"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { useLanguage, useTranslation } from '@/provider/language-provider';
import { getAvailableLocales, getLocaleDisplayName, Locale } from '@/lib/i18n';

export function LanguagePicker() {
  const { locale, setLocale } = useLanguage();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const availableLocales = getAvailableLocales();

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 border"
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm">{t('footer.language')}</span>
          <span className="text-sm font-medium">{getLocaleDisplayName(locale)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {availableLocales.map((availableLocale) => (
          <DropdownMenuItem
            key={availableLocale}
            onClick={() => handleLocaleChange(availableLocale)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>{getLocaleDisplayName(availableLocale)}</span>
            {locale === availableLocale && (
              <Check className="h-4 w-4 text-blue-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 