import type { ComponentType } from 'react';

export default function ContactPage() {
  return (
    <div className="relative mx-auto w-full max-w-4xl px-6 py-12">
      <section className="rounded-2xl border border-fd-border bg-fd-card/90 p-8 shadow-md">
        <h2 className="text-2xl font-semibold mb-2">
          联系咨询
        </h2>
        <p className="mb-6 text-sm text-fd-muted-foreground">
          欢迎通过热线或邮箱联系我们。
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-fd-border/70 bg-fd-background/80 p-4">
            <div className="text-sm text-fd-muted-foreground">服务热线</div>
            <div className="mt-1 text-base font-semibold">400-800-1234</div>
          </div>
          <div className="rounded-xl border border-fd-border/70 bg-fd-background/80 p-4">
            <div className="text-sm text-fd-muted-foreground">Email</div>
            <div className="mt-1 text-base font-semibold">hello@ezalive.com</div>
          </div>
        </div>
      </section>
    </div>
  );
}
