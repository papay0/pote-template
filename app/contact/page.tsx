import { generatePageMetadata } from "@/lib/metadata";
import ContactClient from "./contact-client";

export const metadata = generatePageMetadata({
  title: "Contact Us",
  description: "Get in touch with ABC Business Solutions. Find our contact information, business hours, and location. We're here to help your business succeed.",
  keywords: ['contact', 'business hours', 'location', 'phone', 'email', 'address', 'support'],
});

export default function Contact() {
  return <ContactClient />;
}