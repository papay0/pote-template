// Define the translation structure as a const assertion first
export const fr = {
  brand: {
    name: "ABC Solutions d'Entreprise",
    description: "Nous fournissons des solutions d'entreprise complètes pour aider votre entreprise à croître et réussir sur le marché concurrentiel d'aujourd'hui."
  },
  nav: {
    home: "Accueil",
    contact: "Contact",
    faq: "FAQ"
  },
  home: {
    hero: {
      title: "Solutions d'Entreprise Professionnelles",
      subtitle: "Transformez votre entreprise avec nos services experts et solutions innovantes",
      cta: "Commencer Aujourd'hui",
      secondary: "En Savoir Plus"
    },
    services: {
      title: "Nos Services",
      consulting: {
        title: "Conseil en Entreprise",
        description: "Conseils stratégiques pour optimiser vos opérations et stimuler la croissance"
      },
      technology: {
        title: "Solutions Technologiques",
        description: "Solutions technologiques modernes pour rationaliser vos processus d'entreprise"
      },
      support: {
        title: "Support 24/7",
        description: "Assistance 24h/24 pour maintenir votre entreprise en fonctionnement"
      }
    },
    about: {
      title: "Pourquoi Nous Choisir",
      description: "Avec plus de 10 ans d'expérience, nous avons aidé des centaines d'entreprises à atteindre leurs objectifs grâce à des solutions sur mesure et un support dédié."
    }
  },
  contact: {
    title: "Contactez-Nous",
    subtitle: "Entrez en contact avec notre équipe",
    form: {
      name: "Nom Complet",
      email: "Adresse E-mail",
      phone: "Numéro de Téléphone",
      subject: "Sujet",
      message: "Message",
      submit: "Envoyer le Message",
      successMessage: "Merci pour votre message ! Nous vous répondrons bientôt."
    },
    info: {
      address: "Adresse",
      phone: "Téléphone",
      email: "E-mail"
    }
  },
  faq: {
    title: "Questions Fréquemment Posées",
    subtitle: "Trouvez des réponses aux questions courantes sur nos services",
    cta: {
      title: "Encore des questions ?",
      description: "Vous ne trouvez pas la réponse que vous cherchez ? Notre équipe est là pour vous aider.",
      button: "Contactez-nous"
    },
    questions: [
      {
        question: "Quels services offrez-vous ?",
        answer: "Nous offrons des services complets de conseil en entreprise, des solutions technologiques et un support 24/7 pour aider votre entreprise à croître et réussir."
      },
      {
        question: "Combien de temps prend la mise en œuvre ?",
        answer: "Les délais de mise en œuvre varient selon la portée de votre projet. La plupart des projets petits à moyens prennent 2-4 semaines, tandis que les implémentations plus importantes peuvent prendre 2-3 mois."
      },
      {
        question: "Offrez-vous un support continu ?",
        answer: "Oui, nous fournissons des services de support et de maintenance continus 24/7 pour assurer le bon fonctionnement de vos systèmes."
      },
      {
        question: "Dans quelles industries travaillez-vous ?",
        answer: "Nous travaillons avec des entreprises dans diverses industries incluant le commerce de détail, la santé, la finance, la fabrication et les secteurs technologiques."
      },
      {
        question: "Comment puis-je commencer ?",
        answer: "Contactez-nous simplement via notre formulaire de contact ou appelez-nous. Nous planifierons une consultation pour discuter de vos besoins et fournir une solution personnalisée."
      }
    ]
  },
  footer: {
    quickLinks: "Liens Rapides",
    businessHours: "Heures d'Ouverture",
    address: "123 Rue des Affaires, Suite 100, Ville, ST 12345",
    phone: "+1 (555) 123-4567",
    email: "contact@abcbusiness.com",
    hours: {
      weekdays: "Lun - Ven: 9h00 - 18h00",
      weekends: "Sam - Dim: 10h00 - 16h00"
    },
    copyright: "© {{year}} ABC Solutions d'Entreprise. Tous droits réservés.",
    learn: "Apprendre",
    examples: "Exemples",
    goToNextjs: "Aller sur nextjs.org →",
    language: "Langue"
  },
  layout: {
    title: "ABC Solutions d'Entreprise",
    description: "Solutions d'entreprise professionnelles pour votre succès"
  }
} as const; 