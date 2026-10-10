'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import {
  getImageFrame,
  IMAGE_FRAME_TARGETS,
  type ImageFrameKey,
  type ImageFrameMap,
  type ImageFrameSettings,
} from '@/lib/image-frames';

const targetKeys = Object.keys(IMAGE_FRAME_TARGETS) as ImageFrameKey[];
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const isSameFrame = (left: ImageFrameSettings, right: ImageFrameSettings) =>
  left.positionX === right.positionX && left.positionY === right.positionY && left.zoom === right.zoom;

export function ImageFrameEditor() {
  const [selectedKey, setSelectedKey] = useState<ImageFrameKey>(targetKeys[0]);
  const [savedFrames, setSavedFrames] = useState<ImageFrameMap>({});
  const [draft, setDraft] = useState<ImageFrameSettings>(getImageFrame({}, targetKeys[0]));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ tone: 'success' | 'error'; message: string } | null>(null);
  const pointerStart = useRef<{ x: number; y: number; clientX: number; clientY: number } | null>(null);
  const target = IMAGE_FRAME_TARGETS[selectedKey];
  const persisted = getImageFrame(savedFrames, selectedKey);
  const hasChanges = !isSameFrame(draft, persisted);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/image-frames', { cache: 'no-store' })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error || 'No se pudieron cargar los encuadres.');
        return result.data as Array<{ target_key: ImageFrameKey; position_x: number; position_y: number; zoom: number }>;
      })
      .then((rows) => {
        if (!active) return;
        const frames = Object.fromEntries(rows.map((row) => [row.target_key, {
          positionX: row.position_x,
          positionY: row.position_y,
          zoom: Number(row.zoom),
        }])) as ImageFrameMap;
        setSavedFrames(frames);
        setDraft(getImageFrame(frames, selectedKey));
      })
      .catch((error: unknown) => {
        if (active) setStatus({ tone: 'error', message: error instanceof Error ? error.message : 'No se pudieron cargar los encuadres.' });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [selectedKey]);

  function chooseTarget(key: ImageFrameKey) {
    setSelectedKey(key);
    setDraft(getImageFrame(savedFrames, key));
    setStatus(null);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerStart.current = {
      x: draft.positionX,
      y: draft.positionY,
      clientX: event.clientX,
      clientY: event.clientY,
    };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const start = pointerStart.current;
    if (!start || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setDraft((current) => ({
      ...current,
      positionX: Math.round(clamp(start.x - ((event.clientX - start.clientX) / bounds.width) * 100, 0, 100)),
      positionY: Math.round(clamp(start.y - ((event.clientY - start.clientY) / bounds.height) * 100, 0, 100)),
    }));
  }

  function finishDragging() {
    pointerStart.current = null;
  }

  async function saveFrame() {
    setSaving(true);
    setStatus(null);
    try {
      const response = await fetch('/api/admin/image-frames', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetKey: selectedKey, ...draft }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'No se pudo guardar el encuadre.');
      const row = result.data as { target_key: ImageFrameKey; position_x: number; position_y: number; zoom: number };
      const saved = { positionX: row.position_x, positionY: row.position_y, zoom: Number(row.zoom) };
      setSavedFrames((current) => ({ ...current, [selectedKey]: saved }));
      setDraft(saved);
      setStatus({ tone: 'success', message: 'Encuadre guardado. La web actualizará esta imagen al recargar.' });
    } catch (error) {
      setStatus({ tone: 'error', message: error instanceof Error ? error.message : 'No se pudo guardar el encuadre.' });
    } finally {
      setSaving(false);
    }
  }

  function resetFrame() {
    setDraft(target.defaults);
    setStatus(null);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">Presentación de imágenes</p>
        <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">Encuadres de la web</h1>
        <p className="mt-3 max-w-2xl text-pretty text-base leading-6 text-slate-600 dark:text-slate-300">
          Arrastra la imagen dentro del marco y ajusta cuánto se amplía. La vista previa respeta el recorte que se verá en la página.
        </p>
      </header>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]" aria-label="Editor de encuadre">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6">
          <label htmlFor="image-frame-target" className="block text-sm font-semibold">Ubicación de la imagen</label>
          <select
            id="image-frame-target"
            value={selectedKey}
            onChange={(event) => chooseTarget(event.target.value as ImageFrameKey)}
            className="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#414141] dark:bg-[#272727] dark:text-white"
          >
            {targetKeys.map((key) => <option key={key} value={key}>{IMAGE_FRAME_TARGETS[key].title}</option>)}
          </select>
          <p className="text-sm text-slate-600 dark:text-slate-300">{target.description}</p>

          <div
            className="relative mx-auto w-full max-w-xl touch-none cursor-grab overflow-hidden rounded-xl bg-[#163b32] shadow-inner active:cursor-grabbing"
            style={{ aspectRatio: target.aspectRatio }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDragging}
            onPointerCancel={finishDragging}
            role="img"
            aria-label="Vista previa del encuadre. Arrastra la imagen para cambiarla de posición. También puedes usar los controles siguientes."
          >
            <Image
              src={target.imageSrc}
              alt=""
              fill
              sizes="(max-width: 1280px) 100vw, 55vw"
              draggable={false}
              className="pointer-events-none object-cover"
              style={{
                objectPosition: `${draft.positionX}% ${draft.positionY}%`,
                transform: `scale(${draft.zoom})`,
                transformOrigin: `${draft.positionX}% ${draft.positionY}%`,
              }}
            />
            <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              Vista previa del marco
            </span>
          </div>
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">Arrastra la imagen para moverla. Usa los controles para afinar la posición.</p>
        </div>

        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-[#313131] dark:bg-[#1f1f1f] sm:p-6">
          <h2 className="text-lg font-semibold">Ajustar encuadre</h2>
          <RangeControl label="Posición horizontal" value={draft.positionX} min={0} max={100} display={`${draft.positionX}%`} onChange={(value) => setDraft((current) => ({ ...current, positionX: value }))} />
          <RangeControl label="Posición vertical" value={draft.positionY} min={0} max={100} display={`${draft.positionY}%`} onChange={(value) => setDraft((current) => ({ ...current, positionY: value }))} />
          <RangeControl label="Ampliación" value={draft.zoom} min={1} max={2} step={0.01} display={`${draft.zoom.toFixed(2)}×`} onChange={(value) => setDraft((current) => ({ ...current, zoom: value }))} />

          {status && (
            <p role={status.tone === 'error' ? 'alert' : 'status'} className={`rounded-lg px-3 py-2 text-sm ${status.tone === 'error' ? 'bg-rose-50 text-rose-800 dark:bg-[#313131] dark:text-rose-200' : 'bg-emerald-50 text-emerald-900 dark:bg-[#313131] dark:text-emerald-200'}`}>
              {status.message}
            </p>
          )}

          <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-5 dark:border-[#313131]">
            <button
              type="button"
              onClick={saveFrame}
              disabled={loading || saving || !hasChanges}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:bg-emerald-700 dark:hover:bg-emerald-600"
            >
              {saving ? 'Guardando…' : loading ? 'Cargando…' : 'Guardar encuadre'}
            </button>
            <button
              type="button"
              onClick={resetFrame}
              disabled={loading || saving || isSameFrame(draft, target.defaults)}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-[#414141] dark:text-white dark:hover:bg-[#272727]"
            >
              Restaurar valores iniciales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  step = 1,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  display: string;
  onChange: (value: number) => void;
}) {
  const id = `image-frame-${label.toLowerCase().replaceAll(' ', '-')}`;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium">{label}</label>
        <output htmlFor={id} className="min-w-12 text-right text-sm tabular-nums text-slate-600 dark:text-slate-300">{display}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer accent-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-4 dark:accent-emerald-400"
      />
    </div>
  );
}
