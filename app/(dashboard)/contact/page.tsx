import { contactPageRepository } from "@/lib/db/repositories/contact.repository";

import { DashboardPageHeader } from "../_components/dashboard-page-header";
import { ContactPageEditor } from "./_components/contact-page-editor";

export default async function ContactPage() {
  const content = await contactPageRepository.get();
  const initialContent = {
    hero: content.hero,
    cvUrl: content.cvUrl,
    recipientEmail: content.recipientEmail,
    helperNote: content.helperNote,
    socials: content.socials,
  };

  return (
    <div>
      <DashboardPageHeader
        eyebrow="Contact"
        title="Keep the door useful."
        description="Control the public contact page, social handles, CV document, and destination email for work requests."
      />
      <ContactPageEditor content={initialContent} />
    </div>
  );
}
