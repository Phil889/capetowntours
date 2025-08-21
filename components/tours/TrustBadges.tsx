import Image from 'next/image';

const badges = [
  {
    src: '/tripadvisor.png',
    alt: 'TripAdvisor Certificate of Excellence - Top Rated Cape Town Tours',
    width: 220,
    height: 112,
  },
  {
    src: '/best price cape ton privat tours.png',
    alt: 'Best Price Guarantee for Cape Town Private Tours',
    width: 220,
    height: 112,
  },
  {
    src: '/privat tours cape town trusted seller.png',
    alt: 'Trusted Tour Provider - Cape Town Private Tours',
    width: 220,
    height: 112,
  },
  {
    src: '/viator.png',
    alt: 'Viator Experience Awards Winner - Cape Town Tours',
    width: 220,
    height: 112,
  },
  {
    src: '/best-cape-town-safari-choice-guarantee.webp',
    alt: 'Certified Eco Tourism Provider - Sustainable Safari Tours',
    width: 220,
    height: 112,
  },
];

export default function TrustBadges() {
  return (
    <div className="mt-10 flex flex-wrap justify-center items-center gap-8 sm:gap-16 w-full">
      {badges.map((badge, index) => (
        <div key={index} className="relative h-20 sm:h-28 w-auto">
          <Image
            src={badge.src}
            alt={badge.alt}
            width={badge.width}
            height={badge.height}
            className="object-contain"
            loading="lazy"
            style={{ maxHeight: '112px', maxWidth: '220px' }}
          />
        </div>
      ))}
    </div>
  );
}
