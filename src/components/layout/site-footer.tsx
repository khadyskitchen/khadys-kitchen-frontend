import Link from "next/link";
import Image from "next/image";
import { SocialLinks } from "@/components/social-links";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

const FOOTER_LINKS = [
  { label: "Home", href: routes.home },
  { label: "Trainings", href: routes.trainings },
  { label: "Check your registration", href: routes.trainingStatus },
  { label: "Gallery", href: routes.gallery },
  { label: "Contact", href: routes.contact },
];

interface SiteFooterProps {
  cta: { label: string; href: string };
}

export function SiteFooter({ cta }: SiteFooterProps) {
  return (
    <footer id="visit" className="bg-ink text-cream">
      <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-[clamp(36px,5vw,64px)] px-[clamp(20px,5vw,48px)] py-[clamp(56px,8vw,100px)]">
        <div>
          <span className="mb-7 flex items-center gap-2.5 font-serif text-[19px] tracking-[0.02em] text-cream">
            <Image
              src="/logo.png"
              alt=""
              aria-hidden="true"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-contain"
            />
            Khady&rsquo;s Kitchen
          </span>
          <p className="mb-8 max-w-[42ch] text-[17px] leading-[1.7] text-cream/70">
            Swing by the kitchen in Kumasi, or join one of our baking classes -
            the ovens are always on.
          </p>
          <Link
            href={cta.href}
            className="inline-block rounded-full bg-accent px-[34px] py-4 text-[15px] font-semibold tracking-[0.06em] text-[#FDFAF3] no-underline transition-colors hover:bg-cream hover:text-ink"
          >
            {cta.label}
          </Link>
        </div>

        <div className="lg:justify-self-center">
          <h3 className="mb-5 text-[13px] font-semibold uppercase tracking-[0.2em] text-accent-2">
            Explore
          </h3>
          <div className="grid gap-3 text-[16px]">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-cream/80 no-underline transition-colors hover:text-cream"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-[13px] font-semibold uppercase tracking-[0.2em] text-accent-2">
            Find us
          </h3>
          <p className="mb-[18px] text-[16px] leading-[1.7]">
            Khady&rsquo;s Kitchen
            <br />
            Kumasi, Ghana
          </p>
          <p className="mb-[18px] text-[16px] leading-[1.7] text-cream/70">
            {siteConfig.email}
          </p>
          <SocialLinks tone="dark" size="sm" className="mb-[22px]" />
          <div className="flex justify-between gap-4 border-t border-cream/15 pt-3 text-[16px]">
            <span>Mon - Sun</span>
            <span className="text-cream/70">8 am - 5 pm</span>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/15 py-6 text-[13px] tracking-[0.1em] text-cream/55">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-4 px-[clamp(12px,5vw,48px)] text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 sm:justify-start">
            <span className="whitespace-nowrap text-[clamp(10px,3.7vw,13px)] tracking-normal sm:tracking-[0.1em] sm:text-[13px]">
              © 2026 Khady&rsquo;s Kitchen. All rights reserved.
            </span>
            <span className="whitespace-nowrap">
              Developed by{" "}
              <a
                href="https://manuru.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-cream no-underline transition-colors hover:text-accent-2"
              >
                manuru
              </a>
            </span>
          </div>
          <div className="flex items-center gap-x-6">
            <Link
              href={routes.privacy}
              className="text-cream/70 no-underline transition-colors hover:text-cream"
            >
              Privacy Policy
            </Link>
            <Link
              href={routes.terms}
              className="text-cream/70 no-underline transition-colors hover:text-cream"
            >
              Terms of Services
            </Link>
          </div>
        </div>
      </div>
      {/* Clearance for the fixed mobile tab bar so nothing hides behind it. */}
      <div aria-hidden="true" className="h-[60px] min-[900px]:hidden" />
    </footer>
  );
}
