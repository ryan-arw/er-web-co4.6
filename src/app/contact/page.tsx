import { Metadata } from 'next';
import FAQSection from '@/components/FAQSection';
import ContactForm from '@/components/ContactForm';
import Navbar from '@/components/marketing/Navbar';
import Footer from '@/components/marketing/Footer';

export const metadata: Metadata = {
    title: 'Contact Us | EzyRelife',
    description: 'Reach out to the EzyRelife team for support, product inquiries, or partnerships. We typicaly respond within 24 hours.',
};

export default function ContactPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-ivory pt-32 pb-20">
                {/* Hero Section */}
                <section className="container mx-auto px-4 text-center space-y-6 mb-20 animate-fade-up">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-herbal-green tracking-tight font-[family-name:var(--font-display)]">
                        We're Here for <span className="text-warm-orange">You</span>
                    </h1>
                    <p className="text-lg text-text-sub max-w-2xl mx-auto leading-relaxed">
                        Questions about your ReSet journey? Need help with an order? Our dedicated support team is ready to guide you.
                    </p>
                </section>

                {/* FAQ Section */}
                <section className="container mx-auto px-4 mb-32">
                    <FAQSection />
                </section>

                {/* Contact Form Section */}
                <section className="container mx-auto px-4" id="contact-form">
                    <div className="text-center mb-12 space-y-4">
                        <h2 className="text-3xl font-bold text-herbal-green font-[family-name:var(--font-display)]">
                            Send a Message
                        </h2>
                        <p className="text-text-sub max-w-xl mx-auto">
                            Fill out the form below and we'll get back to you as soon as possible.
                        </p>
                    </div>
                    <ContactForm />
                </section>
            </main>
            <Footer />
        </>
    );
}
