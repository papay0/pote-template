// Event source enum - where the event originated from
export enum Source {
  HomeScreen = 'home_screen',
  LoginPage = 'login_page',
  SignupPage = 'signup_page',
  ContactPage = 'contact_page',
  AboutPage = 'about_page',
  ServicesPage = 'services_page',
  ProductPage = 'product_page',
  CheckoutPage = 'checkout_page',
  Header = 'header',
  Footer = 'footer',
  Sidebar = 'sidebar',
  Modal = 'modal',
  HeroSection = 'hero_section',
  CTASection = 'cta_section',
  TestimonialsSection = 'testimonials_section',
  PricingSection = 'pricing_section',
  BlogPost = 'blog_post',
  SearchResults = 'search_results',
  Dashboard = 'dashboard',
  ProfilePage = 'profile_page',
  SettingsPage = 'settings_page',
  Unknown = 'unknown'
}

// Event type enum - the type of interaction
export enum EventType {
  Impression = 'impression',
  Tap = 'tap',
  View = 'view',
  Scroll = 'scroll',
  Submit = 'submit',
  Download = 'download',
  Share = 'share',
  Like = 'like',
  Comment = 'comment',
  Search = 'search',
  Filter = 'filter',
  Sort = 'sort',
  Add = 'add',
  Remove = 'remove',
  Update = 'update',
  Delete = 'delete',
  Purchase = 'purchase',
  Subscribe = 'subscribe',
  Unsubscribe = 'unsubscribe'
}