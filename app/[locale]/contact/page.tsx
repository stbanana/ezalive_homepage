import SubtleTechBackgroundLayout from '@/components/SubtleTechBackgroundLayout';
import { getDictionary } from '@/lib/dictionaries';

type Locale = 'zh' | 'en';

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <SubtleTechBackgroundLayout>
      <main className="relative mx-auto w-full max-w-4xl px-6 py-12">
        <section className="rounded-2xl border border-fd-border bg-fd-card/90 p-8 shadow-md">
          <h2 className="mb-2 text-2xl font-semibold">
            {dict.home.contact.title}
          </h2>
          <p className="mb-6 text-sm text-fd-muted-foreground">
            {dict.home.contact.description}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-fd-border/70 bg-fd-background/80 p-4">
              <div className="text-sm text-fd-muted-foreground">{dict.home.contact.hotline}</div>
              <div className="mt-1 text-base font-semibold">400-800-1234</div>
            </div>
            <div className="rounded-xl border border-fd-border/70 bg-fd-background/80 p-4">
              <div className="text-sm text-fd-muted-foreground">{dict.home.contact.email}</div>
              <div className="mt-1 text-base font-semibold">hello@ezalive.com</div>
            </div>
          </div>
        </section>
      </main>
    </SubtleTechBackgroundLayout>
  );
}
