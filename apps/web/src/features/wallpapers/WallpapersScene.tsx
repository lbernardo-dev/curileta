'use client';

import React, { useState, useMemo } from 'react';
import { Locale } from '@curileta/i18n';
import { Wallpaper } from '@curileta/cms';
import { ShareActions } from '@/components/ShareActions';
import {
  Download,
  Smartphone,
  Monitor,
  Sparkles,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  X,
  Layers,
  Image as ImageIcon,
  Compass,
  Heart,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface WallpapersSceneProps {
  locale: Locale;
  wallpapers: Wallpaper[];
  embedded?: boolean;
  hideHeader?: boolean;
}

const WALLPAPER_TAGS_EN: Record<string, string> = {
  'Móvil': 'Mobile', 'Ordenador': 'Desktop',
  'Bosque Encantado': 'Enchanted Forest', 'Conejito': 'Bunny', 'Buzón Secreto': 'Secret Mailbox',
  'México': 'Mexico', 'Teotihuacán': 'Teotihuacan', 'Plumas Esmeralda': 'Emerald Feathers',
  'Oso Panda': 'Giant Panda', 'Bambú': 'Bamboo', 'Perú': 'Peru',
  'Japón': 'Japan', 'Tokio': 'Tokyo', 'Nueva Zelanda': 'New Zealand',
  'Brújula Solar': 'Solar Compass', 'Arte Oficial': 'Official Art', 'Aventura': 'Adventure',
  'Mapamundi': 'World Map', 'Lulú': 'Lulu',
  'Egipto': 'Egypt', 'Pirámides': 'Pyramids', 'Desierto': 'Desert',
  'Islandia': 'Iceland', 'Auroras Boreales': 'Northern Lights', 'Laguna Azul': 'Blue Lagoon', 'Hielo': 'Ice',
  'Gran Muralla': 'Great Wall', 'Montañas': 'Mountains', 'Galeón': 'Galleon',
  'Océano Atlántico': 'Atlantic Ocean', 'Travesía': 'Voyage', 'Navío': 'Ship',
  'Tierra Roja': 'Red Earth', 'Colinas Verdes': 'Green Hills', 'Amistad': 'Friendship', 'Hogar': 'Home',
};

const localizedWallpaperTag = (tag: string, locale: Locale) =>
  locale === 'en' ? WALLPAPER_TAGS_EN[tag] || tag : tag;

const isOfficialWallpaperAsset = (url: string) =>
  /^\/images\/wallpapers\/(?:desktop|mobile)\/[^/]+\.(?:webp|png|jpe?g)$/i.test(url);
const EMPTY_WALLPAPERS: Wallpaper[] = [];

export const WallpapersScene: React.FC<WallpapersSceneProps> = ({
  locale,
  wallpapers = EMPTY_WALLPAPERS,
  embedded = false,
  hideHeader = false,
}) => {
  const copy = (es: string, en: string) => locale === 'en' ? en : es;
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'mobile' | 'desktop'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'paisajes' | 'arte'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);
  const officialWallpapers = useMemo(
    () => wallpapers.filter((wp) =>
      wp.category !== 'personajes' &&
      isOfficialWallpaperAsset(wp.thumbnail) &&
      isOfficialWallpaperAsset(wp.fullImageUrl)
    ),
    [wallpapers]
  );
  const hasPublishedWallpapers = officialWallpapers.length > 0;

  // Filtro reactivo en tiempo real
  const filteredWallpapers = useMemo(() => {
    return officialWallpapers.filter((wp) => {
      // Dispositivo
      if (deviceFilter !== 'all' && wp.deviceType !== deviceFilter) {
        return false;
      }
      // Categoría
      if (categoryFilter !== 'all' && wp.category !== categoryFilter) {
        return false;
      }
      // Búsqueda
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const title = (wp.title[locale] || wp.title.es).toLowerCase();
        const tags = wp.tags.flatMap((tag) => [tag, localizedWallpaperTag(tag, locale)]).join(' ').toLowerCase();
        const country = wp.country ? (wp.country[locale] || wp.country.es).toLowerCase() : '';
        if (!title.includes(query) && !tags.includes(query) && !country.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [officialWallpapers, deviceFilter, categoryFilter, searchQuery, locale]);

  // Conteos para píldoras
  const counts = useMemo(() => {
    return {
      all: officialWallpapers.length,
      mobile: officialWallpapers.filter((w) => w.deviceType === 'mobile').length,
      desktop: officialWallpapers.filter((w) => w.deviceType === 'desktop').length,
      paisajes: officialWallpapers.filter((w) => w.category === 'paisajes').length,
      arte: officialWallpapers.filter((w) => w.category === 'arte').length,
    };
  }, [officialWallpapers]);

  const handleDownload = (e: React.MouseEvent, wp: Wallpaper) => {
    e.stopPropagation();
    setDownloadSuccessId(wp.id);
    setTimeout(() => setDownloadSuccessId(null), 3000);

    // Disparar descarga directa
    const link = document.createElement('a');
    link.href = wp.fullImageUrl;
    link.download = `Curileta_${wp.slug}_2K.webp`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="galeria-fondos" className={`relative z-10 ${embedded ? 'py-16' : 'py-24'} bg-[#f8f6ef] dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden`}>
      {/* Resplandor ambiental de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(16,185,129,0.15),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabecera Principal */}
        {!hideHeader && (
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4 shadow-lg backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>{hasPublishedWallpapers ? copy('Fondos oficiales', 'Official wallpapers') : copy('Colección en preparación', 'Collection in progress')}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              {copy('Lleva la aventura contigo.', 'Take the adventure with you.')}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-amber-600 to-sky-600 dark:from-emerald-300 dark:via-amber-300 dark:to-sky-300">
                {hasPublishedWallpapers
                  ? copy('Fondos creados para tu pantalla.', 'Art made for your screen.')
                  : copy('Muy pronto, ilustraciones propias.', 'Original illustrations are on their way.')}
              </span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {copy(
                hasPublishedWallpapers
                  ? 'Descarga ilustraciones oficiales preparadas para móvil y escritorio.'
                  : 'Estamos preparando escenas originales de la expedición en formatos específicos para móvil y escritorio.',
                hasPublishedWallpapers
                  ? 'Download official illustrations prepared for mobile and desktop.'
                  : 'Original expedition scenes for mobile and desktop are being prepared.'
              )}
            </p>
          </div>
        )}

        {/* Barra de Filtros y Búsqueda */}
        {hasPublishedWallpapers && <div className="bg-[#fffdf8] dark:bg-slate-900/80 border border-[#e8e1d5] dark:border-slate-800 rounded-3xl p-4 sm:p-6 mb-10 shadow-[0_12px_36px_rgba(24,54,41,0.06)] backdrop-blur-xl space-y-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Filtro por Dispositivo */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase mr-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> {copy('Dispositivo:', 'Device:')}
              </span>

              <button
                onClick={() => setDeviceFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  deviceFilter === 'all'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-black'
                    : 'bg-white dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 hover:text-slate-950 dark:hover:text-white shadow-sm'
                }`}
              >
                {copy(`Todos (${counts.all})`, `All (${counts.all})`)}
              </button>

              <button
                onClick={() => setDeviceFilter('mobile')}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  deviceFilter === 'mobile'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-black'
                    : 'bg-white dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 hover:text-slate-950 dark:hover:text-white shadow-sm'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{copy(`📱 Para móvil (${counts.mobile})`, `📱 Mobile (${counts.mobile})`)}</span>
              </button>

              <button
                onClick={() => setDeviceFilter('desktop')}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  deviceFilter === 'desktop'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-black'
                    : 'bg-white dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 hover:text-slate-950 dark:hover:text-white shadow-sm'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>{copy(`💻 Para ordenador (${counts.desktop})`, `💻 Desktop (${counts.desktop})`)}</span>
              </button>
            </div>

            {/* Buscador de Fondos */}
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={copy('Buscar por personaje, país o etiqueta…', 'Search by character, country or tag…')}
                className="w-full bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filtro por Categoría Temática */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase mr-1 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> {copy('Temática:', 'Theme:')}
            </span>

            {[
              { id: 'all', label: copy(`Todas (${counts.all})`, `All (${counts.all})`) },
              { id: 'paisajes', label: copy(`🏞 Paisajes y monumentos (${counts.paisajes})`, `🏞 Landscapes & landmarks (${counts.paisajes})`) },
              { id: 'arte', label: copy(`🎨 Arte y mapas (${counts.arte})`, `🎨 Art & maps (${counts.arte})`) },
            ].map((cat) => {
              const isActive = categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-sm'
                      : 'bg-white dark:bg-slate-950/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200 shadow-sm'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>}

        {/* Cuadrícula de Fondos de Pantalla */}
        {filteredWallpapers.length === 0 ? (
          hasPublishedWallpapers ? (
            <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#e7dfd0] bg-[#fffdf8] px-6 py-14 text-center shadow-[0_18px_55px_rgba(24,54,41,0.07)] sm:px-12 sm:py-16">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf1e6] text-emerald-800">
                <ImageIcon className="h-7 w-7" />
              </div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">{copy('Prueba otra búsqueda', 'Try another search')}</p>
              <h3 className="font-display text-2xl font-semibold tracking-tight text-[#20352c] sm:text-3xl">{copy('No hay fondos con esos filtros.', 'No wallpapers match those filters.')}</h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#5c6b61] sm:text-base">{copy('Borra la búsqueda o restablece los filtros para volver a ver la colección.', 'Clear the search or reset filters to see the collection again.')}</p>
              <button
                onClick={() => {
                  setDeviceFilter('all');
                  setCategoryFilter('all');
                  setSearchQuery('');
                }}
                className="mt-6 rounded-full border border-[#ccd7ca] px-5 py-2.5 text-sm font-semibold text-[#254537] transition hover:border-emerald-800 hover:bg-emerald-50"
              >
                {copy('Restablecer filtros', 'Reset filters')}
              </button>
            </div>
          ) : (
            <div className="mx-auto grid max-w-6xl items-center gap-10 rounded-[2rem] border border-[#e7dfd0] bg-[#fffdf8] p-6 shadow-[0_18px_55px_rgba(24,54,41,0.07)] sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
              <div className="relative mx-auto w-full max-w-2xl pb-5 pr-8">
                <div aria-hidden="true" className="relative aspect-video overflow-hidden rounded-2xl border-[6px] border-[#20352c] bg-[#b9dfe5] shadow-[0_18px_34px_rgba(32,53,44,0.18)]">
                  <div className="absolute right-[15%] top-[14%] h-12 w-12 rounded-full bg-[#ffe4a4] sm:h-16 sm:w-16" />
                  <div className="absolute inset-x-0 bottom-0 h-[56%] bg-[#89b87d]" style={{ clipPath: 'polygon(0 60%, 20% 28%, 42% 58%, 64% 18%, 100% 63%, 100% 100%, 0 100%)' }} />
                  <div className="absolute inset-x-0 bottom-0 h-[39%] bg-[#4e855e]" style={{ clipPath: 'polygon(0 38%, 27% 62%, 56% 24%, 77% 57%, 100% 35%, 100% 100%, 0 100%)' }} />
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 640 360" fill="none">
                    <path d="M72 258C183 205 235 278 333 208S487 115 569 153" stroke="#fff8dd" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 13" />
                    <circle cx="72" cy="258" r="8" fill="#fff8dd" />
                    <circle cx="333" cy="208" r="8" fill="#ffd363" />
                    <circle cx="569" cy="153" r="8" fill="#fff8dd" />
                  </svg>
                  <span className="absolute bottom-3 left-3 rounded-full bg-[#173d32]/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">{copy('Paisaje panorámico', 'Panoramic landscape')}</span>
                </div>
                <div aria-hidden="true" className="absolute bottom-0 right-0 h-40 w-[5.5rem] rounded-[1.5rem] border-[5px] border-[#20352c] bg-[#f5f0df] p-1.5 shadow-xl sm:h-48 sm:w-28">
                  <div className="relative h-full overflow-hidden rounded-[1rem] bg-[#b9dfe5]">
                    <div className="absolute right-3 top-4 h-5 w-5 rounded-full bg-[#ffe4a4]" />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#89b87d]" style={{ clipPath: 'polygon(0 52%, 36% 16%, 63% 58%, 100% 28%, 100% 100%, 0 100%)' }} />
                    <div className="absolute inset-x-0 bottom-0 h-[30%] bg-[#4e855e]" />
                    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 180" fill="none">
                      <path d="M14 133C38 104 48 123 83 71" stroke="#fff8dd" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="text-center lg:text-left">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">{copy('La próxima etapa de la expedición', 'The next expedition chapter')}</p>
                <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight text-[#20352c] sm:text-3xl">{copy('Escenas completas, pensadas para cada pantalla.', 'Complete scenes, composed for every screen.')}</h3>
                <p className="mt-4 text-sm leading-6 text-[#5c6b61] sm:text-base">{copy('Los retratos pertenecen a las fichas de personajes. Aquí publicaremos paisajes originales del viaje, preparados en formato vertical y panorámico.', 'Character portraits belong in their profiles. This gallery will feature original journey landscapes, composed in portrait and panoramic formats.')}</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
                  <span className="rounded-full bg-[#eaf1e6] px-3 py-1.5 text-xs font-semibold text-[#315c43]">{copy('Móvil vertical', 'Portrait for mobile')}</span>
                  <span className="rounded-full bg-[#eaf1e6] px-3 py-1.5 text-xs font-semibold text-[#315c43]">{copy('Escritorio panorámico', 'Panoramic desktop')}</span>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredWallpapers.map((wp) => {
              const isMobile = wp.deviceType === 'mobile';
              const isDownloaded = downloadSuccessId === wp.id;
              const title = wp.title[locale] || wp.title.es;

              return (
                <div
                  key={wp.id}
                  onClick={() => setSelectedWallpaper(wp)}
                  className="group cursor-pointer rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-400/60 overflow-hidden shadow-lg dark:shadow-xl hover:shadow-2xl hover:shadow-emerald-950/20 dark:hover:shadow-emerald-950/50 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Contenedor de la Imagen */}
                  <div
                    className={`relative w-full bg-slate-950 overflow-hidden ${
                      isMobile ? 'aspect-[9/16]' : 'aspect-video'
                    }`}
                  >
                    <img
                      src={wp.thumbnail}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

                    {/* Insignia 2K Ultra HD */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-md">
                        2K QHD
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        {isMobile ? <Smartphone className="w-2.5 h-2.5" /> : <Monitor className="w-2.5 h-2.5" />}
                        <span>{isMobile ? copy('Móvil', 'Mobile') : copy('Escritorio', 'Desktop')}</span>
                      </span>
                    </div>

                    {/* Tamaño de archivo */}
                    {wp.fileSizeBytes && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-slate-300">
                        {wp.fileSizeBytes}
                      </div>
                    )}

                    {/* Botón flotante para Vista Previa Rápida */}
                    <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-slate-950/80 border border-emerald-400/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 shadow-xl backdrop-blur-md">
                      <Eye className="w-5 h-5 text-emerald-400" />
                    </div>

                    {/* Barra inferior con resolución */}
                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] font-mono font-bold text-white/90">
                      <span className="bg-black/80 px-2 py-0.5 rounded backdrop-blur-md">
                        {wp.resolution.split(' ')[0]} px
                      </span>
                      {wp.country && (
                        <span className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded backdrop-blur-md">
                          {wp.country[locale] || wp.country.es}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metadatos y Botones */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-amber-300 transition-colors leading-snug">
                        {title}
                      </h3>
                      {wp.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {wp.description[locale] || wp.description.es}
                        </p>
                      )}

                      {/* Etiquetas / Tags */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {wp.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                          >
                            #{localizedWallpaperTag(t, locale)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Acciones: Vista Previa & Descargar */}
                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWallpaper(wp);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                        <span>{copy('Previsualizar', 'Preview')}</span>
                      </button>

                      <button
                        onClick={(e) => handleDownload(e, wp)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md ${
                          isDownloaded
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                        }`}
                      >
                        {isDownloaded ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{copy('¡Listo!', 'Ready!')}</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>{copy('Bajar 2K', 'Download 2K')}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal de Previsualización en Dispositivo y Descarga */}
        {selectedWallpaper && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[92vh]">
              {/* Botón cerrar */}
              <button
                onClick={() => setSelectedWallpaper(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 dark:bg-slate-950/80 hover:bg-red-600 text-slate-600 dark:text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label={copy('Cerrar modal', 'Close preview')}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Lado izquierdo: Simulación de dispositivo */}
              <div className="lg:w-1/2 bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
                {selectedWallpaper.deviceType === 'mobile' ? (
                  <div className="relative w-64 aspect-[9/19] rounded-[38px] p-2 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-2xl border-4 border-slate-700/80 ring-1 ring-white/10">
                    {/* Isla Dinámica / Notch */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-10 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-2" />
                      <div className="w-2 h-2 rounded-full bg-emerald-950" />
                    </div>

                    {/* Pantalla del Teléfono con Wallpaper */}
                    <div className="relative w-full h-full rounded-[30px] overflow-hidden bg-black flex flex-col justify-between p-4 text-white">
                      <img
                        src={selectedWallpaper.fullImageUrl}
                        alt={copy('Vista previa', 'Wallpaper preview')}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

                      {/* Reloj y Fecha simulados */}
                      <div className="relative z-10 text-center mt-6">
                        <span className="text-3xl font-extrabold tracking-tight drop-shadow-md">09:41</span>
                        <p className="text-[11px] font-bold text-slate-200 drop-shadow">{copy('Viernes, 9 de octubre', 'Friday, October 9')}</p>
                      </div>

                      {/* Notificación Curileta */}
                      <div className="relative z-10 bg-slate-950/80 backdrop-blur-md rounded-xl p-2.5 border border-white/10 mb-4 shadow-lg text-[10px]">
                        <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-0.5">
                          <Compass className="w-3 h-3 text-emerald-400" />
                          <span>{copy('Las Aventuras de Curileta', 'The Adventures of Curileta')}</span>
                        </div>
                        <p className="text-slate-300">{copy('«¡El mundo te espera! Prepárate para el siguiente viaje.»', '“The world is waiting. Get ready for your next adventure.”')}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full max-w-md aspect-video rounded-2xl p-2 bg-gradient-to-b from-slate-700 to-slate-900 shadow-2xl border-2 border-slate-700 ring-1 ring-white/10 flex flex-col">
                    <div className="relative w-full h-full rounded-xl overflow-hidden bg-black">
                      <img
                        src={selectedWallpaper.fullImageUrl}
                        alt={copy('Vista previa', 'Wallpaper preview')}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] text-white">
                        <Compass className="w-2.5 h-2.5 text-emerald-400" />
                        <span>Curileta 2K Desktop</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Lado derecho: Ficha Técnica y Descarga */}
              <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 text-slate-950">
                      ★ 2K ULTRA HD
                    </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-amber-700 dark:text-amber-300 border border-slate-200 dark:border-slate-700">
                      {selectedWallpaper.deviceType === 'mobile' ? copy('Móvil (vertical)', 'Mobile (portrait)') : copy('Ordenador (horizontal)', 'Desktop (landscape)')}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {selectedWallpaper.title[locale] || selectedWallpaper.title.es}
                  </h3>

                  {selectedWallpaper.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                      {selectedWallpaper.description[locale] || selectedWallpaper.description.es}
                    </p>
                  )}

                  {/* Especificaciones Técnicas */}
                  <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-900 text-slate-700 dark:text-slate-300">
                      <span className="text-slate-500 dark:text-slate-400">{copy('Resolución nativa:', 'Native resolution:')}</span>
                      <strong className="text-slate-900 dark:text-white font-mono">{selectedWallpaper.resolution}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-900 text-slate-700 dark:text-slate-300">
                      <span className="text-slate-500 dark:text-slate-400">{copy('Tamaño del archivo:', 'File size:')}</span>
                      <strong className="text-slate-900 dark:text-white font-mono">{selectedWallpaper.fileSizeBytes || '4.5 MB'}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-900 text-slate-700 dark:text-slate-300">
                      <span className="text-slate-500 dark:text-slate-400">{copy('Formato:', 'Format:')}</span>
                      <strong className="text-slate-900 dark:text-white font-mono">{copy('WebP / JPG de alta fidelidad', 'High-quality WebP / JPG')}</strong>
                    </div>
                    <div className="flex justify-between py-1 text-slate-700 dark:text-slate-300">
                      <span className="text-slate-500 dark:text-slate-400">{copy('Licencia:', 'License:')}</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{copy('Uso personal gratuito', 'Free for personal use')}</strong>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {selectedWallpaper.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        #{localizedWallpaperTag(t, locale)}
                      </span>
                    ))}
                  </div>
                  <ShareActions
                    contentType="wallpaper"
                    contentSlug={selectedWallpaper.slug}
                    title={selectedWallpaper.title[locale] || selectedWallpaper.title.es}
                    description={selectedWallpaper.description?.[locale] || selectedWallpaper.description?.es}
                    url={selectedWallpaper.fullImageUrl}
                    locale={locale}
                  />
                </div>

                {/* Botón de Descarga Principal */}
                <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={(e) => handleDownload(e, selectedWallpaper)}
                    className="w-full py-4 rounded-2xl font-black text-base bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 text-slate-950 hover:opacity-95 active:scale-98 transition-all shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                    <span>{copy('Descargar fondo en 2K (alta calidad)', 'Download 2K wallpaper (high quality)')}</span>
                  </button>
                  <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-2">
                    {copy('Compatible con iPhone, Samsung Galaxy, Xiaomi, iPad, Mac y PC con Windows.', 'Compatible with iPhone, Samsung Galaxy, Xiaomi, iPad, Mac and Windows PCs.')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Banner Informativo sobre Calidad 2K */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-100/50 dark:from-slate-900 dark:via-emerald-950/60 dark:to-slate-900 border border-emerald-300 dark:border-emerald-500/30 p-8 sm:p-10 shadow-xl dark:shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{copy('¿Buscas un recurso visual para tu colegio o evento?', 'Looking for a visual resource for your school or event?')}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              {copy('La galería reunirá los fondos oficiales cuando estén listos. Escríbenos para solicitar materiales educativos.', 'The gallery will hold official wallpapers when they are ready. Contact us to request educational materials.')}
            </p>
          </div>

          <a
            href={`/${locale}/contacto`}
            className="px-6 py-3.5 rounded-full font-bold text-xs bg-slate-900 hover:bg-emerald-600 text-white dark:bg-slate-800 dark:hover:bg-emerald-500 dark:hover:text-slate-950 transition-all whitespace-nowrap border border-emerald-500/40"
          >
            {copy('Solicitar materiales oficiales', 'Request official materials')}
          </a>
        </div>
      </div>
    </section>
  );
};
