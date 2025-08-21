import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Users, Star, Camera, Mountain, Cable } from 'lucide-react';

export const metadata: Metadata = {
  title: "Table Mountain Tours Cape Town | Cable Car & Hiking Tours 2025",
  description: "Experience Table Mountain with our private tours. Cable car tickets, guided hikes, sunset tours & photography experiences. Book your Table Mountain adventure today!",
  keywords: "Table Mountain tours, Cape Town cable car, Table Mountain hiking, sunset tours Table Mountain, Table Mountain photography tours, Table Mountain cable car tickets",
  openGraph: {
    title: "Table Mountain Tours Cape Town | Cable Car & Hiking Tours",
    description: "Experience Table Mountain with our private tours. Cable car tickets, guided hikes, sunset tours & photography experiences.",
    images: ['/table-mountain-view.png'],
  },
};

export default function TableMountainToursPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-900 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl font-bold mb-4">Table Mountain Tours Cape Town</h1>
            <p className="text-xl mb-6">
              Discover the iconic Table Mountain with our expertly guided private tours. 
              From cable car experiences to challenging hikes, we offer the perfect Table Mountain adventure for every traveler.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>2,847+ Happy Guests</span>
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
          <Link href="/cape-town-tours" className="hover:text-blue-600">Cape Town Tours</Link>
          <span>/</span>
          <span className="text-gray-900">Table Mountain Tours</span>
        </nav>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {/* Overview */}
            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
                <Mountain className="w-8 h-8 text-blue-600" />
                About Table Mountain
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Table Mountain, one of the New 7 Wonders of Nature, stands majestically over Cape Town at 1,085 meters above sea level. 
                  This iconic flat-topped mountain offers breathtaking 360-degree views of the city, coastline, and surrounding landscapes.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Our private Table Mountain tours combine the convenience of the famous cable car with optional hiking experiences, 
                  ensuring you experience this natural wonder in comfort and style. Whether you're seeking adventure or relaxation, 
                  we have the perfect Table Mountain experience for you.
                </p>
              </div>
            </section>

            {/* Tour Options */}
            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
                <Cable className="w-8 h-8 text-blue-600" />
                Our Table Mountain Tour Options
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6 border">
                  <h3 className="text-xl font-semibold mb-3 text-blue-600">Cable Car Experience</h3>
                  <ul className="space-y-2 text-gray-700 mb-4">
                    <li>• Skip-the-line cable car tickets</li>
                    <li>• 360-degree rotating cable car</li>
                    <li>• Panoramic city and ocean views</li>
                    <li>• Perfect for all fitness levels</li>
                  </ul>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>4-5 hours</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border">
                  <h3 className="text-xl font-semibold mb-3 text-green-600">Hiking Adventure</h3>
                  <ul className="space-y-2 text-gray-700 mb-4">
                    <li>• Guided hiking trails</li>
                    <li>• Platteklip Gorge route</li>
                    <li>• India Venster route</li>
                    <li>• Professional hiking guide</li>
                  </ul>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>6-8 hours</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border">
                  <h3 className="text-xl font-semibold mb-3 text-orange-600">Sunset Photography Tour</h3>
                  <ul className="space-y-2 text-gray-700 mb-4">
                    <li>• Golden hour photography</li>
                    <li>• Professional photo guidance</li>
                    <li>• Sunset cable car descent</li>
                    <li>• City lights views</li>
                  </ul>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Camera className="w-4 h-4" />
                    <span>Photography focused</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border">
                  <h3 className="text-xl font-semibold mb-3 text-purple-600">Combination Tour</h3>
                  <ul className="space-y-2 text-gray-700 mb-4">
                    <li>• Hike up, cable car down</li>
                    <li>• Best of both experiences</li>
                    <li>• Flexible timing options</li>
                    <li>• Achievement certificate</li>
                  </ul>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mountain className="w-4 h-4" />
                    <span>Adventure & comfort</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Best Time to Visit */}
            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-6">Best Time to Visit Table Mountain</h2>
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-blue-800">Weather Considerations</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• <strong>Summer (Dec-Feb):</strong> Warm, clear days, perfect visibility</li>
                      <li>• <strong>Autumn (Mar-May):</strong> Mild weather, fewer crowds</li>
                      <li>• <strong>Winter (Jun-Aug):</strong> Clear days, possible snow on peaks</li>
                      <li>• <strong>Spring (Sep-Nov):</strong> Wildflowers, moderate temperatures</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-blue-800">Daily Timing</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• <strong>Early Morning:</strong> Clearest views, fewer crowds</li>
                      <li>• <strong>Late Afternoon:</strong> Perfect for sunset tours</li>
                      <li>• <strong>Avoid:</strong> Midday heat in summer</li>
                      <li>• <strong>Wind Warning:</strong> Cable car closes in high winds</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Cable Car Information */}
            <section className="mb-12">
              <h2 className="text-3xl font-semibold mb-6">Table Mountain Cable Car Information</h2>
              <div className="bg-white rounded-lg shadow-lg p-6 border">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Operating Hours</h3>
                    <ul className="space-y-2 text-gray-700 mb-4">
                      <li>• <strong>Summer:</strong> 8:00 AM - 9:00 PM</li>
                      <li>• <strong>Winter:</strong> 8:30 AM - 6:00 PM</li>
                      <li>• <strong>Last ascent:</strong> 30 minutes before closing</li>
                      <li>• <strong>Weather dependent:</strong> Closes in high winds</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">What to Expect</h3>
                    <ul className="space-y-2 text-gray-700 mb-4">
                      <li>• 360-degree rotating floor</li>
                      <li>• 5-minute journey to the top</li>
                      <li>• Capacity: 65 passengers</li>
                      <li>• Wheelchair accessible</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Pro Tip:</strong> Book your Table Mountain tour in advance to secure skip-the-line access and avoid disappointment during peak seasons.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Booking Widget */}
              <div className="bg-white rounded-lg shadow-lg p-6 border mb-8">
                <h3 className="text-xl font-semibold mb-4">Book Your Table Mountain Tour</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">From</span>
                    <span className="text-2xl font-bold text-blue-600">R 850</span>
                  </div>
                  <div className="text-sm text-gray-500">per person</div>
                  <Link 
                    href="/tours" 
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
                  >
                    View Available Tours
                  </Link>
                  <div className="text-center">
                    <a href="tel:+27214245215" className="text-blue-600 hover:underline">
                      Or call: +27 21 424 5215
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Facts */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Facts</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>Height: 1,085m above sea level</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mountain className="w-4 h-4 text-blue-600" />
                    <span>New 7 Wonders of Nature</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Cable car: 5-minute journey</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Suitable for all ages</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Tours */}
        <section className="mt-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">Related Cape Town Tours</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/tours/cape-peninsula-tour" className="group">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600">Cape Peninsula Tour</h3>
                  <p className="text-gray-600 text-sm">Explore Cape Point, Boulders Beach penguins, and scenic coastal drives.</p>
                </div>
              </div>
            </Link>
            
            <Link href="/tours/cape-winelands-tour" className="group">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600">Cape Winelands Tour</h3>
                  <p className="text-gray-600 text-sm">Discover world-class wines in Stellenbosch and Franschhoek valleys.</p>
                </div>
              </div>
            </Link>
            
            <Link href="/tours/robben-island-tour" className="group">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-r from-gray-400 to-gray-600"></div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600">Robben Island Tour</h3>
                  <p className="text-gray-600 text-sm">Visit the historic island where Nelson Mandela was imprisoned.</p>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}