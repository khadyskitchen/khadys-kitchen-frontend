import { Reveal } from "@/components/reveal";
import { SocialLinks } from "@/components/social-links";
import { siteConfig } from "@/lib/site";

const PHONE_PRIMARY = "0540546469";
const PHONE_SECONDARY = "0502187856";
/** Chat opens on the primary line. */
const WHATSAPP_HREF = "https://wa.me/233540546469";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.892c0 2.096.549 4.142 1.595 5.945L0 24l6.335-1.652a11.882 11.882 0 005.71 1.447h.006c6.585 0 11.946-5.359 11.949-11.939a11.821 11.821 0 00-3.48-8.407" />
    </svg>
  );
}

function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex max-w-full items-center gap-3.5 rounded-full bg-accent py-3 pl-3 pr-7 text-[#FDFAF3] no-underline transition-colors hover:bg-ink max-[400px]:gap-3 max-[400px]:pr-5"
    >
      <span className="grid h-[46px] w-[46px] flex-none place-items-center rounded-full bg-[#FDFAF3]/15 max-[440px]:h-10 max-[440px]:w-10">
        <WhatsAppIcon className="h-[26px] w-[26px] max-[440px]:h-[22px] max-[440px]:w-[22px]" />
      </span>
      <span className="min-w-0 text-left">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FDFAF3]/75">
          Call or WhatsApp
        </span>
        {/* Always one row: the type scales with the viewport so both numbers
            fit even on a Galaxy Fold cover screen (~280px). */}
        <span className="block whitespace-nowrap font-serif text-[clamp(12px,4.5vw,19px)] leading-tight">
          {PHONE_PRIMARY}
          <span className="mx-1 text-[#FDFAF3]/60">·</span>
          {PHONE_SECONDARY}
        </span>
      </span>
    </a>
  );
}

function ChannelCard({
  label,
  value,
  href,
  desc,
}: {
  label: string;
  value: string;
  href: string;
  desc: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-[22px] border border-ink/10 bg-card p-[clamp(24px,3.5vw,36px)] transition-[transform,border-color] hover:-translate-y-[3px] hover:border-accent/40">
      <span className="mb-2 text-[12.5px] font-semibold uppercase tracking-[0.18em] text-accent">
        {label}
      </span>
      <a
        href={href}
        className="mb-3.5 font-serif text-[clamp(21px,2.4vw,28px)] leading-[1.15] text-ink no-underline [overflow-wrap:anywhere] transition-colors hover:text-accent"
      >
        {value}
      </a>
      <p className="mt-auto max-w-[38ch] text-[14.5px] leading-[1.6] text-ink/60">
        {desc}
      </p>
    </div>
  );
}

export function ContactChannels() {
  return (
    <section className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,48px)] pb-[clamp(48px,7vw,88px)] pt-[clamp(44px,6vw,76px)]">
      {/* WhatsApp sits on top of the first (Email) card, above column one only;
          the Email and Visit cards stay aligned on the same row below it. */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Reveal className="sm:col-start-1 sm:row-start-1">
          <WhatsAppButton />
        </Reveal>
        <Reveal className="sm:col-start-1 sm:row-start-2">
          <ChannelCard
            label="Email"
            value={siteConfig.email}
            href={`mailto:${siteConfig.email}`}
            desc="For wholesale, events and anything with an attachment. We reply within two working days."
          />
        </Reveal>
        <Reveal className="sm:col-start-2 sm:row-start-2">
          <ChannelCard
            label="Visit"
            value="Kumasi, Ghana"
            href="https://maps.google.com/?q=Kumasi,Ghana"
            desc="Wed - Fri 7 am until sold out · Sat - Sun 8 am - 2 pm · closed Mon - Tue."
          />
        </Reveal>
      </div>

      <Reveal className="mt-[clamp(40px,5vw,60px)] text-center">
        <div className="mb-3 text-[12.5px] font-semibold uppercase tracking-[0.18em] text-accent">
          Follow along
        </div>
        <p className="mx-auto mb-6 max-w-[40ch] text-[14.5px] leading-[1.6] text-ink/60">
          Daily bake photos, sold-out alerts and student showcases.
        </p>
        <SocialLinks className="justify-center gap-3.5" />
      </Reveal>
    </section>
  );
}
