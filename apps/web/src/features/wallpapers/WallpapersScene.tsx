'use client';

import React, { useState, useMemo } from 'react';
import { Locale } from '@curileta/i18n';
import { Wallpaper } from '@curileta/cms';
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
  Share2,
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

export const WallpapersScene: React.FC<WallpapersSceneProps> = ({
  locale,
  wallpapers = [],
  embedded = false,
  hideHeader = false,
}) => {
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'mobile' | 'desktop'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'personajes' | 'paisajes' | 'arte'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  // Filtro reactivo en tiempo real
  const filteredWallpapers = useMemo(() => {
    return wallpapers.filter((wp) => {
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
        const tags = wp.tags.map((t) => t.toLowerCase()).join(' ');
        const country = wp.country ? (wp.country[locale] || wp.country.es).toLowerCase() : '';
        if (!title.includes(query) && !tags.includes(query) && !country.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [wallpapers, deviceFilter, categoryFilter, searchQuery, locale]);

  // Conteos para píldoras
  const counts = useMemo(() => {
    return {
      all: wallpapers.length,
      mobile: wallpapers.filter((w) => w.deviceType === 'mobile').length,
      desktop: wallpapers.filter((w) => w.deviceType === 'desktop').length,
      personajes: wallpapers.filter((w) => w.category === 'personajes').length,
      paisajes: wallpapers.filter((w) => w.category === 'paisajes').length,
      arte: wallpapers.filter((w) => w.category === 'arte').length,
    };
  }, [wallpapers]);

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
    <section id="galeria-fondos" className={`relative z-10 ${embedded ? 'py-16' : 'py-24'} bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden`}>
      {/* Resplandor ambiental de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(16,185,129,0.15),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabecera Principal */}
        {!hideHeader && (
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4 shadow-lg backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>Galería Oficial de Fondos de Pantalla</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Lleva la Aventura Contigo.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-amber-600 to-sky-600 dark:from-emerald-300 dark:via-amber-300 dark:to-sky-300">
                Fondos de Pantalla en 2K Ultra HD.
              </span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Descarga gratis ilustraciones oficiales, personajes 3D y paisajes del viaje adaptados a la resolución exacta de tu teléfono móvil o pantalla de ordenador.
            </p>
          </div>
        )}

        {/* Barra de Filtros y Búsqueda */}
        <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 mb-10 shadow-lg dark:shadow-xl backdrop-blur-xl space-y-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Filtro por Dispositivo */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase mr-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Dispositivo:
              </span>

              <button
                onClick={() => setDeviceFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  deviceFilter === 'all'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-black'
                    : 'bg-white dark:bg-slate-950/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 hover:text-slate-950 dark:hover:text-white shadow-sm'
                }`}
              >
                Todos ({counts.all})
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
                <span>📱 Para Móvil ({counts.mobile})</span>
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
                <span>💻 Para Ordenador ({counts.desktop})</span>
              </button>
            </div>

            {/* Buscador de Fondos */}
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por personaje, país o tag..."
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
              <Filter className="w-3.5 h-3.5" /> Temática:
            </span>

            {[
              { id: 'all', label: `Todas (${counts.all})` },
              { id: 'personajes', label: `🌟 Personajes 3D (${counts.personajes})` },
              { id: 'paisajes', label: `🏞 Paisajes & Monumentos (${counts.paisajes})` },
              { id: 'arte', label: `🎨 Arte & Mapas (${counts.arte})` },
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
        </div>

        {/* Cuadrícula de Fondos de Pantalla */}
        {filteredWallpapers.length === 0 ? (
          <div className="text-center py-20 bg-slate-100 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800">
            <ImageIcon className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No se encontraron fondos de pantalla</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Prueba a seleccionar otro dispositivo o limpiar los términos de búsqueda.</p>
            <button
              onClick={() => {
                setDeviceFilter('all');
                setCategoryFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:text-white text-xs font-bold"
            >
              Restablecer filtros
            </button>
          </div>
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
                        <span>{isMobile ? 'Móvil' : 'Escritorio'}</span>
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
                            #{t}
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
                        <span>Previsualizar</span>
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
                            <span>¡Listo!</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>Bajar 2K</span>
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
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Lado izquierdo: Simulación de dispositivo */}
              <div className="lg:w-1/2 bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
                {selectedWallpaper.deviceType === 'mobile' ? (
                  // Maqueta de Smartphone
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
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

                      {/* Reloj y Fecha simulados */}
                      <div className="relative z-10 text-center mt-6">
                        <span className="text-3xl font-extrabold tracking-tight drop-shadow-md">09:41</span>
                        <p className="text-[11px] font-bold text-slate-200 drop-shadow">Viernes, 9 de Octubre</p>
                      </div>

                      {/* Notificación Curileta */}
                      <div className="relative z-10 bg-slate-950/80 backdrop-blur-md rounded-xl p-2.5 border border-white/10 mb-4 shadow-lg text-[10px]">
                        <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-0.5">
                          <Compass className="w-3 h-3 text-emerald-400" />
                          <span>Las Aventuras de Curileta</span>
                        </div>
                        <p className="text-slate-300">«¡El mundo te espera! Prepárate para el siguiente viaje.»</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Maqueta de Laptop / Pantalla Panorámica
                  <div className="relative w-full max-w-md aspect-video rounded-2xl p-2 bg-gradient-to-b from-slate-700 to-slate-900 shadow-2xl border-2 border-slate-700 ring-1 ring-white/10 flex flex-col">
                    <div className="relative w-full h-full rounded-xl overflow-hidden bg-black">
                      <img
                        src={selectedWallpaper.fullImageUrl}
                        alt="Preview"
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
                      {selectedWallpaper.deviceType === 'mobile' ? 'Móvil (Vertical)' : 'Ordenador (Horizontal)'}
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
                      <span className="text-slate-500 dark:text-slate-400">Resolución Nativa:</span>
                      <strong className="text-slate-900 dark:text-white font-mono">{selectedWallpaper.resolution}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-900 text-slate-700 dark:text-slate-300">
                      <span className="text-slate-500 dark:text-slate-400">Peso Estimado:</span>
                      <strong className="text-slate-900 dark:text-white font-mono">{selectedWallpaper.fileSizeBytes || '4.5 MB'}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-900 text-slate-700 dark:text-slate-300">
                      <span className="text-slate-500 dark:text-slate-400">Formato:</span>
                      <strong className="text-slate-900 dark:text-white font-mono">WebP / JPG Alta Fidelidad</strong>
                    </div>
                    <div className="flex justify-between py-1 text-slate-700 dark:text-slate-300">
                      <span className="text-slate-500 dark:text-slate-400">Licencia:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Uso Personal Gratuito</strong>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {selectedWallpaper.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Botón de Descarga Principal */}
                <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={(e) => handleDownload(e, selectedWallpaper)}
                    className="w-full py-4 rounded-2xl font-black text-base bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 text-slate-950 hover:opacity-95 active:scale-98 transition-all shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                    <span>Descargar Fondo en 2K (Alta Calidad)</span>
                  </button>
                  <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-2">
                    Compatible con iPhone, Samsung Galaxy, Xiaomi, iPad, Mac y PC con Windows.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Banner Informativo sobre Calidad 2K */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-100/50 dark:from-slate-900 dark:via-emerald-950/60 dark:to-slate-900 border border-emerald-300 dark:border-emerald-500/30 p-8 sm:p-10 shadow-xl dark:shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">¿Buscas un fondo personalizado para tu colegio o evento?</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              Nuestros fondos de pantalla se actualizan con cada nuevo destino y capítulo estrenado en la serie animada. ¡Suscríbete o contáctanos para materiales educativos!
            </p>
          </div>

          <a
            href={`/${locale}/contacto`}
            className="px-6 py-3.5 rounded-full font-bold text-xs bg-slate-900 hover:bg-emerald-600 text-white dark:bg-slate-800 dark:hover:bg-emerald-500 dark:hover:text-slate-950 transition-all whitespace-nowrap border border-emerald-500/40"
          >
            Solicitar Materiales Oficiales
          </a>
        </div>
      </div>
    </section>
  );
};
