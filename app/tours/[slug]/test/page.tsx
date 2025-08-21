// This is a test route to preview the refactored tour page
// Access it at: /tours/test/[tour-slug]
// Example: http://localhost:3000/tours/test/cape-peninsula-tour

export { 
  default,
  generateMetadata,
  generateStaticParams,
  revalidate 
} from '../page-refactored';
