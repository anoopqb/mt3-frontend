// import PageContent from '@/lib/PageContent';
import fetchContentType, { StrapiData } from '@/lib/fetchContentType';
import { notFound } from 'next/navigation';
import PageContent from '@/lib/PageContent';

// Force static generation for the home page
export const dynamic = 'force-static';

export default async function HomePage() {
  const pageData = (await fetchContentType(
    'pages',
    {
      filters: {
        slug: 'home',
      },
      pLevel: 8
    },
    true,
  )) as StrapiData;

  if (!pageData) notFound();

  return (
    <>
      <main className="mainContainer transparent">
        <PageContent pageData={pageData} />
      </main>
    </>
  );
}