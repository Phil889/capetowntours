import { Shield, Clock, MapPin, Star, Users, Award } from 'lucide-react';

interface ValuePropositionProps {
  translations: {
    tours: {
      valueProposition: {
        title: string;
        subtitle: string;
        cards: {
          licensed: {
            title: string;
            description: string;
          };
          flexible: {
            title: string;
            description: string;
          };
          guides: {
            title: string;
            description: string;
          };
          rated: {
            title: string;
            description: string;
          };
          private: {
            title: string;
            description: string;
          };
          guarantee: {
            title: string;
            description: string;
          };
        };
      };
    };
  };
}

export default function ValueProposition({ translations }: ValuePropositionProps) {
  const valueCards = [
    {
      icon: Shield,
      title: translations.tours.valueProposition.cards.licensed.title || 'Fully Licensed & Insured',
      description: translations.tours.valueProposition.cards.licensed.description || 'Travel with peace of mind knowing all our tours are fully licensed, insured, and comply with South African tourism regulations.',
    },
    {
      icon: Clock,
      title: translations.tours.valueProposition.cards.flexible.title || 'Flexible Booking & Cancellation',
      description: translations.tours.valueProposition.cards.flexible.description || 'Free cancellation up to 24 hours before your tour. Reschedule anytime based on availability.',
    },
    {
      icon: MapPin,
      title: translations.tours.valueProposition.cards.guides.title || 'Local Expert Guides',
      description: translations.tours.valueProposition.cards.guides.description || 'Our passionate local guides share insider knowledge and hidden gems you won\'t find in guidebooks.',
    },
    {
      icon: Star,
      title: translations.tours.valueProposition.cards.rated.title || '5-Star Rated Experiences',
      description: translations.tours.valueProposition.cards.rated.description || 'Consistently rated 5 stars on TripAdvisor and Viator with over 1000+ happy customers.',
    },
    {
      icon: Users,
      title: translations.tours.valueProposition.cards.private.title || 'Small Group & Private Tours',
      description: translations.tours.valueProposition.cards.private.description || 'Enjoy intimate experiences with small groups or book a private tour for your party.',
    },
    {
      icon: Award,
      title: translations.tours.valueProposition.cards.guarantee.title || 'Best Price Guarantee',
      description: translations.tours.valueProposition.cards.guarantee.description || 'Find a lower price? We\'ll match it and give you 10% off. Quality tours at unbeatable prices.',
    },
  ];
  return (
    <section className="w-full bg-[#F8F5F0] py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#3A3A3A] tracking-tight">
          {translations.tours.valueProposition.title || "Why Choose Cape Town Safari Tours?"}
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl">
          {translations.tours.valueProposition.subtitle || "Experience the pinnacle of luxury and adventure with our exclusive, tailor-made safari tours."}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 w-full">
          {valueCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#3A3A3A]">
                  {card.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
