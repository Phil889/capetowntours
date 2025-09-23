import { redirect } from 'next/navigation';
import { defaultLocale } from '@/lib/i18n/config';

// This page handles the root URL redirect to the default locale
// The middleware will normally handle this, but we need this file 
// for Next.js routing to work properly with TypeScript
export default function RootPage() {
  // Redirect to the default locale
  redirect(`/${defaultLocale}`);
}
