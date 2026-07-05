import Image from "next/image";
import { Reveal } from "@/components/reveal";

const STATS = [
  { value: "Weekly", label: "Practicals" },
  { value: "95%", label: "Ingredients & tools provided" },
  { value: "12", label: "Hostel places" },
  { value: "CTVET", label: "Certificate" },
];

export function Hero() {
  return (
    <section className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-[clamp(32px,5vw,72px)] px-[clamp(20px,5vw,48px)] py-[clamp(48px,7vw,88px)]">
      <div style={{ animation: "kk-rise 0.8s ease both" }}>
        <p className="mb-[18px] text-[13px] font-semibold uppercase tracking-[0.24em] text-accent">
          Khady&rsquo;s Bake School · Kumasi
        </p>
        <h1 className="mb-6 font-serif text-[clamp(40px,5.4vw,74px)] font-normal leading-[1.05]">
          <span className="block overflow-hidden">
            <span
              className="inline-block"
              style={{
                animation:
                  "kk-lineup 1s .15s cubic-bezier(.16,.84,.28,1) both",
              }}
            >
              Learn to bake the
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="inline-block"
              style={{
                animation:
                  "kk-lineup 1s .32s cubic-bezier(.16,.84,.28,1) both",
              }}
            >
              way{" "}
              <em className="font-serif not-italic text-accent">Khady</em>{" "}
              does.
            </span>
          </span>
        </h1>
        <p
          className="mb-9 max-w-[54ch] text-[clamp(16px,1.5vw,19px)] leading-[1.65] text-ink/70"
          style={{ animation: "kk-fadein .8s .5s both" }}
        >
          A hands-on programme with practicals every week — you bake, you learn,
          and you take your cake home. Finish with a CTVET certificate and the
          confidence to run your own oven.
        </p>
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-3.5"
          style={{ animation: "kk-fadein .8s .6s both" }}
        >
          <a
            href="#apply"
            className="rounded-full bg-accent px-[34px] py-4 text-[15px] font-semibold tracking-[0.06em] text-[#FDFAF3] no-underline transition-colors hover:bg-ink"
          >
            Start your application
          </a>
          <a
            href="#costs"
            className="border-b-[1.5px] border-ink/35 px-2 py-4 text-[15px] font-semibold tracking-[0.06em] text-ink no-underline transition-colors hover:border-ink"
          >
            See full costs ↓
          </a>
        </div>
        <div
          className="mt-12 flex flex-wrap gap-x-10 gap-y-6 border-t border-ink/15 pt-[26px]"
          style={{ animation: "kk-fadein .8s .7s both" }}
        >
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="font-serif text-[26px]">{stat.value}</div>
              <div className="mt-1 text-[12.5px] uppercase tracking-[0.08em] text-ink/55">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <Reveal
          variant="mask-img"
          className="relative block h-[clamp(380px,44vw,560px)] w-full overflow-hidden rounded-b-[20px] rounded-t-[min(260px,40vw)] border border-ink/15"
        >
          <Image
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80&auto=format&fit=crop"
            alt="Hands preparing dough in a kitchen"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 45vw"
            className="object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
