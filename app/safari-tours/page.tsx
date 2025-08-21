import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Users, Star, Binoculars, Camera, Shield, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: "Safari Tours Cape Town | Big 5 Wildlife & Game Reserve Experiences",
  description: "Discover Cape Town's best safari tours. Big 5 wildlife experiences at Aquila, Inverdoorn & Sanbona. Private game drives, luxury accommodations & expert guides.",
  keywords: "Cape Town safari tours, Big 5 safari, Aquila game reserve, Inverdoorn safari, wildlife tours Cape Town, game drives South Africa, private safari tours",
  openGraph: {
    title: "Safari Tours Cape Town | Big 5 Wildlife & Game Reserve Experiences",
    description: "Discover Cape Town's best safari tours. Big 5 wildlife experiences at Aquila, Inverdoorn & Sanbona. Private game drives, luxury accommodations & expert guides.",
    images: ['/safari-elephants-river.png'],
  },
};

export default function SafariToursPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-green-900 to-yellow-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-4xl text-white">
            <h1 className="text-5xl font-bold mb-4">Safari Tours from Cape Town</h1>
            <p className="text-xl mb-6">
              Experience Africa's Big 5 wildlife on our private safari tours. From luxury game reserves to authentic bush experiences, 
              discover the wild heart of South Africa just hours from Cape Town.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>2,847+ Safari Guests</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Best Safari Operator 2024</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <span className="text-gray-900">Safari Tours</span>
        </nav>

        {/* Big 5 Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-4">Meet Africa's Big 5</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            The Big 5 - Lion, Leopard, Elephant, Buffalo, and Rhino - represent Africa's most iconic wildlife. 
            Our safari tours offer the best opportunities to spot these magnificent creatures in their natural habitat.
          </p>
          
          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center group">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-3xl">🦁</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Lion</h3>
              <p className="text-sm text-gray-600">The King of the African savanna, known for their majestic manes and powerful roars.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                <span className="text-3xl">🐆</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Leopard</h3>
              <p className="text-sm text-gray-600">Elusive and solitary, leopards are master hunters with incredible climbing abilities.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                <span className="text-3xl">🐘</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Elephant</h3>
              <p className="text-sm text-gray-600">Gentle giants with incredible intelligence and strong family bonds.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-black to-gray-700 rounded-full flex items-center justify-center">
                <span className="text-3xl">🐃</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Buffalo</h3>
              <p className="text-sm text-gray-600">Powerful and unpredictable, Cape buffalo are among Africa's most dangerous animals.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center">
                <span className="text-3xl">🦏</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Rhino</h3>
              <p className="text-sm text-gray-600">Ancient armored giants, both black and white rhinos call South Africa home.</p>
            </div>
          </div>
        </section>

        {/* Game Reserves Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-4">Top Game Reserves Near Cape Town</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Experience world-class wildlife viewing at these premier game reserves, all within easy reach of Cape Town.
          </p>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Aquila Game Reserve */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500"></div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-3 text-green-700">Aquila Private Game Reserve</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>2 hours from Cape Town</span>
                </div>
                <p className="text-gray-700 mb-4">
                  South Africa's most accessible Big 5 safari experience. Aquila offers luxury accommodations, 
                  expert guides, and excellent wildlife viewing opportunities in a malaria-free environment.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>• Big 5 wildlife viewing</li>
                  <li>• Luxury safari lodge</li>
                  <li>• Day and overnight options</li>
                  <li>• Malaria-free environment</li>
                  <li>• Professional game rangers</li>
                </ul>
                <Link 
                  href="/tours/aquila-big-5-day-safari" 
                  className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  View Aquila Tours
                </Link>
              </div>
            </div>

            {/* Inverdoorn Game Reserve */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-orange-400 to-red-500"></div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-3 text-orange-700">Inverdoorn Game Reserve</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>2.5 hours from Cape Town</span>
                </div>
                <p className="text-gray-700 mb-4">
                  An exclusive safari experience in the heart of the Karoo. Inverdoorn combines luxury with authentic 
                  African wilderness, offering intimate wildlife encounters and stunning landscapes.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>• Exclusive safari experiences</li>
                  <li>• Cheetah conservation program</li>
                  <li>• Luxury tented accommodation</li>
                  <li>• Karoo landscape beauty</li>
                  <li>• Small group experiences</li>
                </ul>
                <Link 
                  href="/tours/inverdoorn-exclusive-day-safari" 
                  className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  View Inverdoorn Tours
                </Link>
              </div>
            </div>

            {/* Sanbona Wildlife Reserve */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-500"></div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-3 text-purple-700">Sanbona Wildlife Reserve</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>3 hours from Cape Town</span>
                </div>
                <p className="text-gray-700 mb-4">
                  One of the largest private game reserves in the Western Cape. Sanbona offers pristine wilderness, 
                  diverse ecosystems, and exceptional wildlife viewing in a spectacular mountain setting.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>• 54,000 hectares of wilderness</li>
                  <li>• Mountain and valley landscapes</li>
                  <li>• White lion conservation</li>
                  <li>• Multiple accommodation options</li>
                  <li>• Diverse wildlife species</li>
                </ul>
                <Link 
                  href="/tours/sanbona-wildlife-reserve" 
                  className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  View Sanbona Tours
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Safari Experience Types */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12">Choose Your Safari Experience</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Day Safaris</h3>
              <p className="text-sm text-gray-600">Perfect for time-conscious travelers. Full day wildlife experiences with return to Cape Town.</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Overnight Safaris</h3>
              <p className="text-sm text-gray-600">Immersive 2-3 day experiences with luxury lodge accommodation and multiple game drives.</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Private Safaris</h3>
              <p className="text-sm text-gray-600">Exclusive experiences with dedicated guides and vehicles for your group only.</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Photography Safaris</h3>
              <p className="text-sm text-gray-600">Specialized tours for wildlife photographers with expert guidance and optimal positioning.</p>
            </div>
          </div>
        </section>

        {/* Safari Tips */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Essential Safari Tips</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Binoculars className="w-6 h-6 text-green-600" />
                  What to Bring
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Comfortable, neutral-colored clothing</li>
                  <li>• Sun hat and sunscreen</li>
                  <li>• Binoculars (provided on tours)</li>
                  <li>• Camera with extra batteries</li>
                  <li>• Light jacket for early morning drives</li>
                  <li>• Comfortable walking shoes</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Camera className="w-6 h-6 text-blue-600" />
                  Photography Tips
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Early morning and late afternoon offer best light</li>
                  <li>• Respect minimum distances from animals</li>
                  <li>• Use telephoto lens for close-up shots</li>
                  <li>• Capture behavior, not just portraits</li>
                  <li>• Be patient - wildlife moves on its own schedule</li>
                  <li>• Listen to your guide's instructions</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready for Your African Safari Adventure?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied guests who have experienced the magic of African wildlife with Cape Town Safari Tours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/tours" 
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View All Safari Tours
            </Link>
            <a 
              href="tel:+27214245215" 
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Call: +27 21 424 5215
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}