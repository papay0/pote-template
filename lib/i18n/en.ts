// Define the translation structure as a const assertion first
export const en = {
  brand: {
    name: "ABC Business Solutions",
    description: "We provide comprehensive business solutions to help your company grow and succeed in today's competitive market."
  },
  nav: {
    home: "Home",
    contact: "Contact",
    faq: "FAQ"
  },
  home: {
    hero: {
      title: "Professional Business Solutions",
      subtitle: "Transform your business with our expert services and innovative solutions",
      cta: "Get Started Today",
      secondary: "Learn More"
    },
    services: {
      title: "Our Services",
      consulting: {
        title: "Business Consulting",
        description: "Strategic guidance to optimize your operations and drive growth"
      },
      technology: {
        title: "Technology Solutions", 
        description: "Modern tech solutions to streamline your business processes"
      },
      support: {
        title: "24/7 Support",
        description: "Round-the-clock assistance to keep your business running smoothly"
      }
    },
    about: {
      title: "Why Choose Us",
      description: "With over 10 years of experience, we've helped hundreds of businesses achieve their goals through tailored solutions and dedicated support."
    }
  },
  contact: {
    title: "Contact Us",
    subtitle: "Get in touch with our team",
    form: {
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      subject: "Subject",
      message: "Message",
      submit: "Send Message",
      successMessage: "Thank you for your message! We'll get back to you soon."
    },
    info: {
      address: "Address",
      phone: "Phone",
      email: "Email"
    }
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions about our services",
    cta: {
      title: "Still have questions?",
      description: "Can't find the answer you're looking for? Our team is here to help.",
      button: "Contact Us"
    },
    questions: [
      {
        question: "What services do you offer?",
        answer: "We offer comprehensive business consulting, technology solutions, and 24/7 support services to help your business grow and succeed."
      },
      {
        question: "How long does implementation take?",
        answer: "Implementation timelines vary depending on the scope of your project. Most small to medium projects take 2-4 weeks, while larger implementations may take 2-3 months."
      },
      {
        question: "Do you offer ongoing support?",
        answer: "Yes, we provide 24/7 ongoing support and maintenance services to ensure your systems continue to operate smoothly."
      },
      {
        question: "What industries do you work with?",
        answer: "We work with businesses across various industries including retail, healthcare, finance, manufacturing, and technology sectors."
      },
      {
        question: "How do I get started?",
        answer: "Simply contact us through our contact form or give us a call. We'll schedule a consultation to discuss your needs and provide a customized solution."
      }
    ]
  },
  footer: {
    quickLinks: "Quick Links",
    businessHours: "Business Hours", 
    address: "123 Business Street, Suite 100, City, ST 12345",
    phone: "+1 (555) 123-4567",
    email: "contact@abcbusiness.com",
    hours: {
      weekdays: "Mon - Fri: 9:00 AM - 6:00 PM",
      weekends: "Sat - Sun: 10:00 AM - 4:00 PM"
    },
    copyright: "© {{year}} ABC Business Solutions. All rights reserved.",
    learn: "Learn",
    examples: "Examples", 
    goToNextjs: "Go to nextjs.org →",
    language: "Language"
  },
  layout: {
    title: "ABC Business Solutions",
    description: "Professional business solutions for your success"
  }
} as const; 