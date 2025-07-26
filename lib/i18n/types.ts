// Define the strict translation protocol/interface
export interface TranslationProtocol {
  brand: {
    name: string;
    description: string;
  };
  nav: {
    home: string;
    contact: string;
    faq: string;
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
      cta: string;
      secondary: string;
    };
    services: {
      title: string;
      consulting: {
        title: string;
        description: string;
      };
      technology: {
        title: string;
        description: string;
      };
      support: {
        title: string;
        description: string;
      };
    };
    about: {
      title: string;
      description: string;
    };
  };
  contact: {
    title: string;
    subtitle: string;
    form: {
      name: string;
      email: string;
      phone: string;
      subject: string;
      message: string;
      submit: string;
      successMessage: string;
    };
    info: {
      address: string;
      phone: string;
      email: string;
    };
  };
  faq: {
    title: string;
    subtitle: string;
    cta: {
      title: string;
      description: string;
      button: string;
    };
    questions: readonly {
      question: string;
      answer: string;
    }[];
  };
  footer: {
    quickLinks: string;
    businessHours: string;
    address: string;
    phone: string;
    email: string;
    hours: {
      weekdays: string;
      weekends: string;
    };
    copyright: string;
    learn: string;
    examples: string;
    goToNextjs: string;
    language: string;
  };
  layout: {
    title: string;
    description: string;
  };
}