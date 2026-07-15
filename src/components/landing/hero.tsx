import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/reveal';
import { routes } from '@/lib/routes';

const STATS = [
  { value: 'Hands-on', label: 'Every class' },
  { value: '2 ways', label: 'In-person or online' },
  { value: 'Certified', label: 'On completion' },
];

export function Hero() {
  return (
    <section className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-center gap-[clamp(32px,5vw,64px)] px-[clamp(20px,5vw,48px)] pb-[clamp(56px,8vw,96px)] pt-[clamp(48px,7vw,88px)]">
      <div style={{ animation: 'kk-rise 0.8s ease both' }}>
        <p className="mb-5 text-[13px] font-semibold uppercase tracking-[0.22em] text-accent">
          Kumasi&rsquo;s hands-on bake school
        </p>
        <h1 className="mb-[26px] font-serif text-[clamp(42px,6.2vw,84px)] font-normal leading-[1.04]">
          <span className="block overflow-hidden">
            <span
              className="inline-block"
              style={{
                animation: 'kk-lineup 1s .1s cubic-bezier(.16,.84,.28,1) both',
              }}
            >
              Come for a class,
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="inline-block"
              style={{
                animation: 'kk-lineup 1s .28s cubic-bezier(.16,.84,.28,1) both',
              }}
            >
              leave a{' '}
              <em className="font-serif not-italic text-accent">baker.</em>
            </span>
          </span>
        </h1>
        <p className="mb-[34px] max-w-[46ch] text-[clamp(16px,1.4vw,18px)] leading-[1.65] text-ink/75">
          Hands-on baking classes in Khady&rsquo;s open kitchen &mdash; bread,
          pastry and cakes, taught in person or online. Learn the craft and
          graduate with something to show for it.
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3.5">
          <Link
            href={routes.trainings}
            className="rounded-full bg-ink px-8 py-4 text-[15px] font-semibold tracking-[0.06em] text-cream no-underline transition-colors hover:bg-accent"
          >
            Explore our trainings
          </Link>
          <Link
            href={routes.contact}
            className="border-b-[1.5px] border-ink/35 px-2 py-4 text-[15px] font-semibold tracking-[0.06em] text-ink no-underline transition-colors hover:border-ink"
          >
            Talk to us →
          </Link>
        </div>
        <div className="mt-12 flex flex-nowrap items-start gap-x-[clamp(12px,3.5vw,32px)] border-t border-ink/15 pt-[26px]">
          {STATS.map((stat) => (
            <div key={stat.label} className="min-w-0">
              <div className="whitespace-nowrap font-serif text-[clamp(17px,4.8vw,26px)] leading-none">
                {stat.value}
              </div>
              <div className="mt-1.5 text-[clamp(9.5px,2.5vw,12.5px)] uppercase tracking-[0.06em] text-ink/55">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="relative pb-[30px]"
        style={{ animation: 'kk-rise 0.8s 0.15s ease both' }}
      >
        <Reveal
          variant="mask-img"
          className="relative block h-[clamp(380px,44vw,560px)] w-full overflow-hidden rounded-b-[20px] rounded-t-[min(260px,40vw)] border border-ink/15"
        >
          <Image
            src="/hero-graduation.jpg"
            alt="Khady's Kitchen bake-school students at their graduation"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 45vw"
            className="object-cover"
          />
        </Reveal>
        <div
          className="absolute bottom-0 left-[-14px] grid h-[clamp(96px,12vw,124px)] w-[clamp(96px,12vw,124px)] place-items-center rounded-full bg-accent text-[#FDFAF3]"
          aria-hidden="true"
        >
          {/* Only the text ring spins; the monogram stays upright. */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full"
            style={{ animation: 'kk-spin 24s linear infinite' }}
          >
            <defs>
              <path
                id="kk-circ"
                d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
              />
            </defs>
            <text className="fill-[#FDFAF3] font-sans text-[10.5px] font-semibold tracking-[0.24em]">
              <textPath href="#kk-circ">
                LEARN BY DOING · TAUGHT BY KHADY ·{' '}
              </textPath>
            </text>
          </svg>
          <span className="relative font-serif text-[clamp(22px,2.6vw,28px)] tracking-[0.04em]">
            KK
          </span>
        </div>
      </div>
    </section>
  );
}
