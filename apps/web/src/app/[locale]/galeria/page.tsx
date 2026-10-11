import { ContentImage } from '@/components/ContentImage';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isValidLocale } from '@curileta/i18n';
import { ShareActions } from '@/components/ShareActions';
import { GalleryDownloadLink } from '@/components/GalleryDownloadLink';
import { getGalleryData } from '@/lib/gallery.server';

export const dynamic = 'force-dynamic';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.curileta.com').replace(/\/$/, '');

export async function generateMetadata({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ categoria?: string; imagen?: string }>;
}): Promise<Metadata> {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  if (!isValidLocale(locale)) return { robots: { index: false, follow: false } };
  const isEn = locale === 'en';
  const { categories, items } = await getGalleryData();
  const selectedItem = items.find((item) => item.slug === query.imagen);
  if (selectedItem) {
    const title = selectedItem.title[isEn ? 'en' : 'es'] || selectedItem.title.es;
    const description = selectedItem.description[isEn ? 'en' : 'es'] || selectedItem.description.es;
    const imageAlt = selectedItem.alt[isEn ? 'en' : 'es'] || selectedItem.alt.es;
    const canonical = `${siteUrl}/${locale}/galeria?${new URLSearchParams({ imagen: selectedItem.slug }).toString()}`;
    return {
      title,
      description,
      alternates: {
        canonical,
        languages: {
          es: `${siteUrl}/es/galeria?${new URLSearchParams({ imagen: selectedItem.slug }).toString()}`,
          en: `${siteUrl}/en/galeria?${new URLSearchParams({ imagen: selectedItem.slug }).toString()}`,
        },
      },
      openGraph: { title, description, url: canonical, images: [{ url: selectedItem.image_url, alt: imageAlt }] },
      twitter: { card: 'summary_large_image', title, description, images: [selectedItem.image_url] },
    };
  }

  const selectedCategory = categories.find((category) => category.slug === query.categoria);
  if (selectedCategory) {
    const categoryName = selectedCategory.name[isEn ? 'en' : 'es'] || selectedCategory.name.es;
    const categoryCount = items.filter((item) => item.category_slug === selectedCategory.slug).length;
    const description = isEn
      ? `Explore ${categoryCount} images in ${categoryName} from the Curileta world.`
      : `Explora ${categoryCount} imágenes de ${categoryName} del mundo de Curileta.`;
    const canonical = `${siteUrl}/${locale}/galeria?${new URLSearchParams({ categoria: selectedCategory.slug }).toString()}`;
    return {
      title: isEn ? `${categoryName} gallery` : `Galería: ${categoryName}`,
      description,
      alternates: {
        canonical,
        languages: {
          es: `${siteUrl}/es/galeria?${new URLSearchParams({ categoria: selectedCategory.slug }).toString()}`,
          en: `${siteUrl}/en/galeria?${new URLSearchParams({ categoria: selectedCategory.slug }).toString()}`,
        },
      },
    };
  }

  const canonical = `${siteUrl}/${locale}/galeria`;
  return isEn
    ? { title: 'Gallery', description: 'Explore images from the Curileta world.', alternates: { canonical } }
    : { title: 'Galería', description: 'Explora imágenes del mundo de Curileta.', alternates: { canonical } };
}

export default async function GalleryPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ categoria?: string; imagen?: string }> }) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  if (!isValidLocale(locale)) notFound();
  const { categories, items } = await getGalleryData();
  const selectedCategory = categories.find((category) => category.slug === query.categoria);
  const filteredItems = selectedCategory ? items.filter((item) => item.category_slug === selectedCategory.slug) : items;
  const selectedItem = items.find((item) => item.slug === query.imagen);
  const isEn = locale === 'en';
  const categoryHref = (slug?: string) => {
    const query = new URLSearchParams();
    if (slug) query.set('categoria', slug);
    return `/${locale}/galeria${query.size ? `?${query.toString()}` : ''}`;
  };

  return <div className="min-h-screen bg-[#faf9f4] py-16 text-[#20352c] sm:py-24"><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
    <header className="mx-auto mb-12 max-w-3xl text-center"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">{isEn ? 'Curileta in pictures' : 'Curileta en imágenes'}</p><h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">{isEn ? 'Gallery' : 'Galería'}</h1><p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-[#5c6b61]">{isEn ? 'Explore illustrations and moments from Curileta’s journeys.' : 'Explora ilustraciones y momentos de los viajes de Curileta.'}</p></header>
    {categories.length > 0 && <nav aria-label={isEn ? 'Image categories' : 'Categorías de imágenes'} className="mb-8 flex flex-wrap justify-center gap-2"><Link href={categoryHref()} aria-current={!selectedCategory ? 'page' : undefined} className={`rounded-full px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${!selectedCategory ? 'bg-emerald-800 text-white' : 'bg-white text-[#20352c]'}`}>{isEn ? 'All images' : 'Todas'}</Link>{categories.map((category) => <Link key={category.slug} href={categoryHref(category.slug)} aria-current={selectedCategory?.slug === category.slug ? 'page' : undefined} className={`rounded-full px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${selectedCategory?.slug === category.slug ? 'bg-emerald-800 text-white' : 'bg-white text-[#20352c]'}`}>{category.name[locale] || category.name.es}</Link>)}</nav>}
    {selectedItem && <section className="mb-10 overflow-hidden rounded-2xl border border-[#e2e7dd] bg-white" aria-labelledby="selected-gallery-item"><div className="grid md:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]"><ContentImage src={selectedItem.image_url} alt={selectedItem.alt[locale] || selectedItem.alt.es} className="max-h-[70vh] w-full bg-[#f1f3eb] object-contain" /><div className="p-6 sm:p-8"><Link href={categoryHref(selectedItem.category_slug)} className="text-sm font-semibold text-emerald-800 underline underline-offset-4">{isEn ? 'Back to gallery' : 'Volver a la galería'}</Link><p className="mt-6 text-xs font-semibold uppercase tracking-wide text-emerald-800">{categories.find((category) => category.slug === selectedItem.category_slug)?.name[locale] || categories.find((category) => category.slug === selectedItem.category_slug)?.name.es}</p><h2 id="selected-gallery-item" className="mt-2 text-2xl font-semibold">{selectedItem.title[locale] || selectedItem.title.es}</h2><p className="mt-3 text-sm leading-6 text-[#5c6b61]">{selectedItem.description[locale] || selectedItem.description.es}</p><div className="mt-6 flex flex-wrap gap-3"><GalleryDownloadLink slug={selectedItem.slug} locale={locale} /><ShareActions contentType="gallery" contentSlug={selectedItem.slug} title={selectedItem.title[locale] || selectedItem.title.es} description={selectedItem.description[locale] || selectedItem.description.es} locale={locale} /></div></div></div></section>}
    {filteredItems.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filteredItems.map((item) => <article key={item.id} className="overflow-hidden rounded-2xl border border-[#e2e7dd] bg-white"><Link href={`/${locale}/galeria?imagen=${encodeURIComponent(item.slug)}${selectedCategory ? `&categoria=${encodeURIComponent(selectedCategory.slug)}` : ''}`} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"><div className="aspect-[4/3] overflow-hidden bg-[#f1f3eb]"><ContentImage src={item.image_url} alt={item.alt[locale] || item.alt.es} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]" /></div><div className="p-5"><p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">{categories.find((category) => category.slug === item.category_slug)?.name[locale] || categories.find((category) => category.slug === item.category_slug)?.name.es}</p><h2 className="mt-2 text-lg font-semibold">{item.title[locale] || item.title.es}</h2><p className="mt-2 line-clamp-2 text-sm leading-5 text-[#5c6b61]">{item.description[locale] || item.description.es}</p></div></Link></article>)}</div> : <div className="rounded-2xl border border-[#e2e7dd] bg-white p-8 text-center"><h2 className="text-xl font-semibold">{isEn ? 'No images in this collection yet' : 'Aún no hay imágenes en esta colección'}</h2><p className="mt-3 text-sm leading-6 text-[#5c6b61]">{isEn ? 'New images will appear here after publication.' : 'Las imágenes aparecerán aquí cuando se publiquen.'}</p></div>}
  </div></div>;
}
