import { generatePageMetadata } from "@/lib/metadata";
import FAQClient from "./faq-client";

export const metadata = generatePageMetadata({
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about ABC Business Solutions services, implementation timelines, support, and more.",
  keywords: ['FAQ', 'questions', 'answers', 'help', 'support', 'services', 'business solutions'],
});

export default function FAQ() {
  return <FAQClient />;
}