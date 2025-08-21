import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '500 - Internal Server Error | Cape Town Safari Tours',
  description: 'An internal server error occurred. Please try again later.',
};

export default function Custom500() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="mb-4">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">500</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Internal Server Error
          </h2>
          <p className="text-gray-600 mb-6">
            Something went wrong on our end. Please try again later.
          </p>
        </div>
        
        <div className="space-y-4">
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Home
          </a>
          <div>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}