/**
 * Ícono de 02 §6: lucide-react 1.63.0 (trazo 1.75, puntas redondas, currentColor) + el ícono propio «Gorra»
 * (lucide no tiene gorra de béisbol; misma retícula de 24 y el mismo trazo que la lámina).
 */
import type { ReactElement } from 'react';
import type { IconoProps, NombreIcono } from '@firmas/componentes';
import {
  ArrowDownUp, ArrowLeft, ArrowRight, Ban, Bell, Box, CalendarCheck, CalendarClock, CalendarDays, Camera, ChartColumn,
  Check, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, CircleCheckBig, CircleDashed, CircleHelp, CircleMinus,
  Clapperboard, Clock, Coins, Copy, Download, Ellipsis, ExternalLink, Eye, EyeOff, Flame, History, Hourglass, House,
  Image, Info, Keyboard, LayoutGrid, LayoutList, Link, Lock, MessageCircle, MessageCircleWarning, Minus, Monitor, Moon,
  Package, Pause, Pencil, Pin, Play, Plus, QrCode, RefreshCw, RotateCcw, Search, Settings, Share2, Shirt, Smartphone,
  Sparkles, SportShoe, SquarePlay, Star, Store, Sun, Tag, Trash2, TrendingUp, Undo2, Wallet, Wifi, X, Maximize2,
  type LucideIcon,
} from 'lucide-react';
import { cx } from './util/clases';
import css from './Icono.module.css';

const LUCIDE: Readonly<Record<Exclude<NombreIcono, 'Gorra'>, LucideIcon>> = {
  House, Package, Store, ChartColumn, SquarePlay, Shirt, Ellipsis, Settings,
  Search, RefreshCw, Copy, ExternalLink, Download, QrCode, ArrowDownUp, CalendarDays,
  MessageCircle, X, ChevronLeft, ChevronRight, ChevronDown, ArrowLeft, ArrowRight, Plus,
  Pencil, Trash2, LayoutList, LayoutGrid, Camera, Keyboard, Bell, Link, Share2, Pin,
  Maximize2, Undo2, Moon, Sun, Eye, EyeOff, Lock, CircleHelp, Image, Minus,
  CircleAlert, History, Clock, Hourglass, Check, Info, CircleMinus, Ban, Pause, RotateCcw,
  CircleDashed, CalendarCheck, Clapperboard, CalendarClock, CircleCheckBig, MessageCircleWarning,
  Play, Coins, Flame, TrendingUp, Box,
  SportShoe, Wallet, Tag,
  Smartphone, Monitor, Wifi, Sparkles, Star,
};

/** Trazo de 02 §6 (1.75) y de los chips (2 a 14 px, §7.2). */
function trazo(tamano: number | undefined): number {
  return tamano !== undefined && tamano <= 14 ? 2 : 1.75;
}

/** Gorra de béisbol de perfil: copa asimétrica (más alta atrás) con la costura del panel y una visera larga hacia la
 *  derecha, sin el botón de arriba (con él se leía como campana de servicio). Llena la retícula como los lucide
 *  (x 2.5–22, y 4.5–19.3), para que no se vea más chica que Shirt o Tag. */
function Gorra(p: { className: string; strokeWidth: number; a11y: Record<string, string | boolean> }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={p.strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={p.className} {...p.a11y} data-icono="Gorra">
      <path d="M2.5 16c0-6.6 3.4-11.5 8.4-11.5 4.4 0 7.6 3.9 7.6 9V16" />
      <path d="M10.9 4.5c-1.8 3-2.4 7.3-2 11.5" />
      <path d="M2.5 16h16c2.2 0 3.5.8 3.5 1.8 0 .9-1.3 1.5-3.4 1.5H12.6c-1.6 0-2.6-1.2-2.6-3.3" />
    </svg>
  );
}

export function Icono(p: IconoProps): ReactElement {
  const clase = cx(css.icono, p.tamano === undefined ? css.md : css[`t${p.tamano}`], p.className);
  const a11y: Record<string, string | boolean> = p.etiqueta ? { role: 'img', 'aria-label': p.etiqueta } : { 'aria-hidden': true, focusable: 'false' };
  const sw = trazo(p.tamano);
  if (p.nombre === 'Gorra') return <Gorra className={clase} strokeWidth={sw} a11y={a11y} />;
  const Componente = LUCIDE[p.nombre];
  return <Componente className={clase} strokeWidth={sw} absoluteStrokeWidth={false} data-icono={p.nombre} {...a11y} />;
}
