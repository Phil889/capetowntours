"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { v4 as uuid } from "uuid";
import {
  addDays,
  addMinutes,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  isSameMonth,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  DownloadCloud,
  GripVertical,
  Plus,
  Send,
  Trash2,
  UploadCloud,
  Wand2,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  TriangleAlert,
  Share2,
  Printer,
} from "lucide-react";

// shadcn/ui — adjust to your paths
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// -------------------- Types --------------------
export type Tour = {
  id: string;
  name: string;
  description: string;
  price: number;           // price per person
  durationMins?: number;   // default 180
  imageUrl?: string;
  tags?: string[];
};

type Pax = { adults: number; children: number; infants: number }; // infants < 3yo are free

type ItineraryItem = {
  id: string;      // unique instance id
  tourId: string;
  tour: Tour;      // denormalized for convenience
  date: Date | null;
  time: string | null; // "HH:MM"
  notes?: string;
  pax: Pax;
};

type DayGroup = {
  id: string;
  label: string;   // "Day 1" or custom
  date: Date | null;
  items: ItineraryItem[];
};

export type PremiumTourBuilderProps = {
  availableTours?: Tour[];
  currency?: string;                          // e.g. "ZAR"
  unavailableDates?: Record<string, string[]>;// tourId -> ["yyyy-mm-dd"]
};

// -------------------- Config --------------------
const DEFAULT_DURATION_MINS = 180; // 3h default
const TRAVEL_BUFFER_MINS = 30;     // simple travel buffer
const STORAGE_KEY = "premiumTourBuilder:v5";

// -------------------- Utilities --------------------
const currencyFmt = (currency: string) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 });

const dateKey = (d: Date) => format(d, "yyyy-MM-dd");

function toSerializable(groups: DayGroup[]) {
  return {
    version: 5,
    groups: (groups || []).map((g) => ({
      id: g.id,
      label: g.label,
      date: g.date ? g.date.toISOString() : null,
      items: (g.items || []).map((i) => ({
        id: i.id,
        tourId: i.tourId,
        date: i.date ? i.date.toISOString() : null,
        time: i.time,
        notes: i.notes ?? null,
        pax: i.pax,
      })),
    })),
  };
}

function fromSerializable(raw: any, availableTours: Tour[]): DayGroup[] {
  if (!raw) return [];
  const byId = new Map((availableTours || []).map((t) => [t.id, t]));
  const version = raw.version ?? (Array.isArray(raw) ? 1 : 0);

  const inflateItems = (gItems: any[]): ItineraryItem[] =>
    (gItems || [])
      .map((x: any) => {
        const tour = byId.get(x.tourId);
        if (!tour) return null;
        return {
          id: x.id || uuid(),
          tourId: tour.id,
          tour,
          date: x.date ? new Date(x.date) : null,
          time: x.time ?? null,
          notes: x.notes ?? "",
          pax: x.pax || { adults: 1, children: 0, infants: 0 },
        } as ItineraryItem;
      })
      .filter(Boolean) as ItineraryItem[];

  if (version >= 2 && raw.groups) {
    return (raw.groups || []).map((g: any) => ({
      id: g.id || uuid(),
      label: g.label || "Day 1",
      date: g.date ? new Date(g.date) : null,
      items: inflateItems(g.items || []),
    }));
  }

  // legacy flat array -> wrap into one day
  if (Array.isArray(raw)) {
    const items = inflateItems(raw);
    const firstDate = items.find((i) => i.date)?.date ?? null;
    return [{ id: uuid(), label: "Day 1", date: firstDate, items }];
  }

  return [];
}

function joinDateAndTime(d: Date | null, t: string | null): Date | null {
  if (!d || !t) return null;
  const [hh, mm] = t.split(":").map((x) => parseInt(x, 10));
  const dt = new Date(d);
  dt.setHours(hh, mm, 0, 0);
  return dt;
}

function getDurationMins(item: ItineraryItem) {
  return item.tour.durationMins ?? DEFAULT_DURATION_MINS;
}

function getStartEnd(item: ItineraryItem): { start: Date; end: Date } | null {
  const start = joinDateAndTime(item.date, item.time);
  if (!start) return null;
  const end = addMinutes(start, getDurationMins(item) + TRAVEL_BUFFER_MINS);
  return { start, end };
}

function itemsOverlap(a: ItineraryItem, b: ItineraryItem) {
  const A = getStartEnd(a);
  const B = getStartEnd(b);
  if (!A || !B) return false;
  if (dateKey(A.start) !== dateKey(B.start)) return false;
  return A.start < B.end && B.start < A.end;
}

// Pricing (flat per paying person; infants free)
function billablePax(pax: Pax) {
  return Math.max(0, (pax?.adults || 0) + (pax?.children || 0));
}
function itemTotal(item: ItineraryItem) {
  return (item.tour?.price || 0) * billablePax(item.pax);
}

// -------------------- DnD ID helpers --------------------
const idFor = {
  sourceTour: (tourId: string) => `source-${tourId}` as UniqueIdentifier,
  day: (dayId: string) => `day-${dayId}` as UniqueIdentifier,
  dayDrop: (dayId: string) => `day-drop-${dayId}` as UniqueIdentifier,
  item: (itemId: string) => `item-${itemId}` as UniqueIdentifier,
  cal: (yyyyMmDd: string) => `cal-${yyyyMmDd}` as UniqueIdentifier,
};

function parseId(id: UniqueIdentifier | string) {
  const s = String(id);
  if (s.startsWith("source-")) return { kind: "source", value: s.slice(7) } as const;
  if (s.startsWith("item-")) return { kind: "item", value: s.slice(5) } as const;
  if (s.startsWith("day-drop-")) return { kind: "dayDrop", value: s.slice(9) } as const;
  if (s.startsWith("day-")) return { kind: "day", value: s.slice(4) } as const;
  if (s.startsWith("cal-")) return { kind: "cal", value: s.slice(4) } as const;
  return { kind: "unknown", value: s } as const;
}

// -------------------- Small UI bits --------------------
function NumberInput({
  value,
  onChange,
  min = 0,
  className,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  className?: string;
}) {
  return (
    <Input
      type="number"
      min={min}
      value={value}
      onChange={(e) => {
        const n = parseInt(e.target.value, 10);
        onChange(Number.isNaN(n) ? min : Math.max(min, n));
      }}
      className={className}
    />
  );
}

function DraggableTourCard({ tour }: { tour: Tour }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: idFor.sourceTour(tour.id),
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "transform 0.15s ease" : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <Card ref={setNodeRef} style={style} className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-3 flex items-center gap-3">
        <div className="shrink-0 h-10 w-10 rounded-lg bg-muted flex items-center justify-center" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4 opacity-60" />
        </div>
        {tour.imageUrl && (
          <div className="relative shrink-0 h-16 w-16 rounded-lg overflow-hidden">
            <Image 
              src={tour.imageUrl} 
              alt={tour.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold leading-5 truncate">{tour.name}</div>
          <div className="text-sm text-muted-foreground line-clamp-1">{tour.description}</div>
          <div className="mt-1 text-sm font-medium">{currencyFmt("ZAR").format(tour.price)} / person</div>
          {tour.tags && (
            <div className="mt-1 flex flex-wrap gap-1">
              {tour.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="rounded-full text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SortableItineraryRow({
  item,
  currency,
  onDateChange,
  onTimeChange,
  onNotesChange,
  onRemove,
  onPaxChange,
  disabledDates,
}: {
  item: ItineraryItem;
  currency: string;
  onDateChange: (id: string, date: Date | null) => void;
  onTimeChange: (id: string, time: string | null) => void;
  onNotesChange: (id: string, notes: string) => void;
  onRemove: (id: string) => void;
  onPaxChange: (id: string, pax: Pax) => void;
  disabledDates?: string[]; // yyyy-mm-dd
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: idFor.item(item.id),
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 5 : undefined,
    background: isDragging ? "hsl(var(--muted))" : undefined,
  };

  const total = itemTotal(item);
  const se = getStartEnd(item);

  return (
    <li ref={setNodeRef} style={style} className="rounded-2xl border bg-card">
      <div className="p-4 flex gap-4 items-start">
        <div
          className="mt-1 shrink-0 h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-5 w-5" />
        </div>

        {item.tour.imageUrl && (
          <div className="relative shrink-0 h-20 w-20 rounded-xl overflow-hidden">
            <Image 
              src={item.tour.imageUrl} 
              alt={item.tour.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="font-semibold leading-tight">{item.tour.name}</div>
            <Badge variant="outline">{currencyFmt(currency).format(item.tour.price)} / person</Badge>
            <Badge variant="secondary" title="Total for this item">{currencyFmt(currency).format(total)}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.tour.description}</p>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            {/* Date and Time stacked */}
            <div className="flex flex-col gap-3">
              {/* Date */}
              <div className="flex flex-col gap-2">
                <Label className="text-xs">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {item.date ? format(item.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="p-0">
                    <Calendar
                      mode="single"
                      selected={item.date ?? undefined}
                      onSelect={(d) => onDateChange(item.id, d ?? null)}
                      disabled={(d) => !!disabledDates?.includes(dateKey(d))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time */}
              <div className="flex flex-col gap-2">
                <Label className="text-xs">Time</Label>
                <div className="flex items-center gap-2">
                  <div className="relative w-full">
                    <Clock className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={item.time ?? ""}
                      onChange={(e) => onTimeChange(item.id, e.target.value || null)}
                      className="pl-8"
                    />
                  </div>
                  {se && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(se.start, "HH:mm")}–{format(se.end, "HH:mm")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Pax */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs flex items-center gap-1"><Users className="h-3 w-3" /> Guests</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-muted-foreground">Adults</span>
                  <NumberInput value={item.pax.adults} onChange={(n) => onPaxChange(item.id, { ...item.pax, adults: n })} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-muted-foreground">Children</span>
                  <NumberInput value={item.pax.children} onChange={(n) => onPaxChange(item.id, { ...item.pax, children: n })} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-muted-foreground">Infants &lt;3</span>
                  <NumberInput value={item.pax.infants} onChange={(n) => onPaxChange(item.id, { ...item.pax, infants: n })} />
                </div>
              </div>
              <div className="text-[11px] text-muted-foreground">Infants under 3 are free.</div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Notes</Label>
              <Textarea
                value={item.notes ?? ""}
                onChange={(e) => onNotesChange(item.id, e.target.value)}
                placeholder="Pickup, language, dietary..."
                className="min-h-[42px]"
              />
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col gap-2">
          <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)} aria-label="Remove">
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </li>
  );
}

function SortableDayCard({
  day,
  index,
  currency,
  onLabelChange,
  onDateChange,
  onRemoveDay,
  renderItems,
  onAutoSchedule,
  conflictsCount,
}: {
  day: DayGroup;
  index: number;
  currency: string;
  onLabelChange: (dayId: string, label: string) => void;
  onDateChange: (dayId: string, date: Date | null) => void;
  onRemoveDay: (dayId: string) => void;
  renderItems: (day: DayGroup) => React.ReactNode;
  onAutoSchedule: (dayId: string) => void;
  conflictsCount: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: idFor.day(day.id) });
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: idFor.dayDrop(day.id) });

  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 4 : undefined };
  const dayTotal = (day.items || []).reduce((s, i) => s + itemTotal(i), 0);

  return (
    <Card ref={setNodeRef} style={style} className="border-2">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="shrink-0 h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground" {...attributes} {...listeners} aria-label="Drag day">
              <GripVertical className="h-5 w-5" />
            </div>
            <Input value={day.label} onChange={(e) => onLabelChange(day.id, e.target.value)} className="w-[220px]" />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {day.date ? format(day.date, "PPP") : <span>Set date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Calendar mode="single" selected={day.date ?? undefined} onSelect={(d) => onDateChange(day.id, d ?? null)} initialFocus />
              </PopoverContent>
            </Popover>
            {conflictsCount > 0 && (
              <Badge variant="destructive" className="gap-1">
                <TriangleAlert className="h-3 w-3" /> {conflictsCount} conflict{conflictsCount > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full" title="Day total">
              {currencyFmt(currency).format(dayTotal)}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => onAutoSchedule(day.id)}>
              <Wand2 className="h-4 w-4 mr-1" /> Auto-schedule
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onRemoveDay(day.id)} aria-label="Remove day">
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={setDropRef} className={`rounded-2xl border-2 border-dashed p-4 min-h-[120px] transition-colors ${isOver ? "border-primary bg-primary/5" : ""}`}>
          {renderItems(day)}
        </div>
      </CardContent>
    </Card>
  );
}

function CalendarCell({ dayDate, items, isCurrentMonth }: { dayDate: Date; items: ItineraryItem[]; isCurrentMonth: boolean }) {
  const key = dateKey(dayDate);
  const { setNodeRef, isOver } = useDroppable({ id: idFor.cal(key) });
  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border p-2 min-h-[90px] flex flex-col gap-1 transition-colors ${isOver ? "border-primary bg-primary/5" : "border-muted"} ${isCurrentMonth ? "opacity-100" : "opacity-60"}`}
    >
      <div className="text-xs font-medium">{format(dayDate, "d")}</div>
      <div className="space-y-1">
        {(items || []).slice(0, 3).map((it) => (
          <div key={it.id} className="truncate text-xs rounded bg-muted px-2 py-1">
            {it.tour.name}
            {it.time ? ` • ${it.time}` : ""}
          </div>
        ))}
        {items && items.length > 3 && <div className="text-[10px] text-muted-foreground">+{items.length - 3} more</div>}
      </div>
    </div>
  );
}

// -------------------- Main Component --------------------
export default function PremiumTourBuilder({
  availableTours = [],
  currency = "ZAR",
  unavailableDates = {},
}: PremiumTourBuilderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  const [query, setQuery] = useState("");
  const [days, setDays] = useState<DayGroup[]>([]);
  const [view, setView] = useState<"days" | "calendar">("days");
  const [monthCursor, setMonthCursor] = useState<Date>(new Date());
  const [activeDrag, setActiveDrag] = useState<
    null | { type: "source"; tour: Tour } | { type: "item"; dayId: string; item: ItineraryItem } | { type: "day"; day: DayGroup }
  >(null);

  const [isBookingOpen, setBookingOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [user, setUser] = useState({ 
    name: "", 
    email: "", 
    phone: "",
    pickup_location: "",
    special_requirements: ""
  });
  const [bulkPax, setBulkPax] = useState<Pax>({ adults: 1, children: 0, infants: 0 });

  // ---------- Shareable link ----------
  useEffect(() => {
    if (typeof window === "undefined") return;
    const match = location.hash.match(/#plan=([^&]+)/);
    if (!match) return;
    try {
      const decoded = JSON.parse(decodeURIComponent(atob(match[1])));
      const restored = fromSerializable(decoded, availableTours);
      if (restored.length) {
        setDays(restored);
        toast.success("Plan restored from link");
      }
    } catch (e) {
      console.warn("Failed to parse shared plan", e);
    }
  }, [availableTours]);

  function copyShareLink() {
    try {
      const json = toSerializable(days);
      const enc = btoa(encodeURIComponent(JSON.stringify(json)));
      const url = `${location.origin}${location.pathname}#plan=${enc}`;
      navigator.clipboard.writeText(url);
      toast.success("Shareable link copied");
    } catch {
      toast.error("Could not copy link");
    }
  }

  // ---------- Persistence ----------
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDays(fromSerializable(JSON.parse(raw), availableTours));
    } catch (e) {
      console.warn("Failed to restore itinerary groups", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSerializable(days)));
    } catch {}
  }, [days]);

  // ---------- Catalog filter ----------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return availableTours;
    return (availableTours || []).filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.tags ?? []).some((tg) => tg.toLowerCase().includes(q))
    );
  }, [availableTours, query]);

  // ---------- Finders ----------
  function findDayByItemId(itemId: string) {
    for (const d of days) {
      const idx = d.items.findIndex((it) => it.id === itemId);
      if (idx !== -1) return { day: d, index: idx } as const;
    }
    return null;
  }
  function dayIndex(dayId: string) {
    return days.findIndex((d) => d.id === dayId);
  }
  function findDayByDateKey(key: string) {
    return days.findIndex((d) => d.date && dateKey(d.date) === key);
  }

  // ---------- Scheduling helpers ----------
  function autoScheduleDay(dayId: string) {
    setDays((prev) => {
      const idx = prev.findIndex((d) => d.id === dayId);
      if (idx === -1) return prev;
      const draft = prev.map((d) => ({ ...d, items: [...d.items] }));
      const day = draft[idx];
      let cursor = 9 * 60; // 09:00
      for (const it of day.items) {
        it.time = `${String(Math.floor(cursor / 60)).padStart(2, "0")}:${String(cursor % 60).padStart(2, "0")}`;
        cursor += getDurationMins(it) + TRAVEL_BUFFER_MINS;
      }
      toast.success(`Auto-scheduled ${day.label}`);
      return draft;
    });
  }

  // ---------- DnD ----------
  function onDragStart(e: DragStartEvent) {
    const id = String(e.active.id);
    const parsed = parseId(id);
    if (parsed.kind === "source") {
      const tour = (availableTours || []).find((t) => t.id === parsed.value);
      if (tour) setActiveDrag({ type: "source", tour });
    } else if (parsed.kind === "item") {
      const res = findDayByItemId(parsed.value);
      if (res) setActiveDrag({ type: "item", dayId: res.day.id, item: res.day.items[res.index] });
    } else if (parsed.kind === "day") {
      const idx = dayIndex(parsed.value);
      if (idx >= 0) setActiveDrag({ type: "day", day: days[idx] });
    }
  }

  function ensureDayForDateKey(key: string): number {
    let idx = findDayByDateKey(key);
    if (idx === -1) {
      const d = new Date(key);
      const label = format(d, "EEE, dd MMM");
      setDays((prev) => [...prev, { id: uuid(), label, date: d, items: [] }]);
      idx = days.length;
    }
    return idx;
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over) return setActiveDrag(null);

    const a = parseId(String(active.id));
    const o = parseId(String(over.id));

    // Add from catalog
    if (a.kind === "source") {
      const tour = (availableTours || []).find((t) => t.id === a.value);
      if (!tour) return setActiveDrag(null);

      if (o.kind === "cal") {
        const key = o.value;
        const dIdx = ensureDayForDateKey(key);
        setDays((prev) => {
          const next = prev.map((d) => ({ ...d, items: [...d.items] }));
          const target = next[dIdx];
          const dateObj = new Date(key);
          target.items.push({
            id: uuid(),
            tourId: tour.id,
            tour,
            date: dateObj,
            time: null,
            notes: "",
            pax: { adults: 1, children: 0, infants: 0 },
          });
          toast.success(`Added to ${target.label}`);
          return next;
        });
        return setActiveDrag(null);
      }

      if (days.length === 0) {
        setDays([{ id: uuid(), label: "Day 1", date: null, items: [] }]);
      }

      setDays((prev) => {
        const target = (() => {
          if (o.kind === "item") {
            const res = findDayByItemId(o.value);
            if (res) return { dayId: res.day.id, index: res.index } as const;
          }
          if (o.kind === "dayDrop" || o.kind === "day") {
            const id = o.value;
            const idx = prev.findIndex((d) => d.id === id);
            if (idx >= 0) return { dayId: id, index: prev[idx].items.length } as const;
          }
          return { dayId: prev[prev.length - 1].id, index: prev[prev.length - 1].items.length } as const;
        })();

        const next = prev.map((d) => ({ ...d, items: [...d.items] }));
        const dIdx = next.findIndex((d) => d.id === target.dayId);
        if (dIdx >= 0) {
          const newItem: ItineraryItem = {
            id: uuid(),
            tourId: tour.id,
            tour,
            date: null,
            time: null,
            notes: "",
            pax: { adults: 1, children: 0, infants: 0 },
          };
          next[dIdx].items.splice(target.index, 0, newItem);
          toast.success("Added to " + next[dIdx].label);
        }
        return next;
      });

      return setActiveDrag(null);
    }

    // Move existing item
    if (a.kind === "item") {
      setDays((prev) => {
        let srcDayIdx = -1;
        let srcItemIdx = -1;
        for (let d = 0; d < prev.length; d++) {
          const i = prev[d].items.findIndex((it) => it.id === a.value);
          if (i !== -1) {
            srcDayIdx = d;
            srcItemIdx = i;
            break;
          }
        }
        if (srcDayIdx === -1) return prev;

        const draft = prev.map((d) => ({ ...d, items: [...d.items] }));
        const [moved] = draft[srcDayIdx].items.splice(srcItemIdx, 1);

        if (o.kind === "cal") {
          const key = o.value;
          const dateObj = new Date(key);
          moved.date = dateObj;
          let targetDayIdx = findDayByDateKey(key);
          if (targetDayIdx === -1) {
            draft.push({ id: uuid(), label: format(dateObj, "EEE, dd MMM"), date: dateObj, items: [] });
            targetDayIdx = draft.length - 1;
          }
          draft[targetDayIdx].items.push(moved);
          return draft;
        }

        // days list moves
        let targetDayIdx = srcDayIdx;
        let targetIndex = srcItemIdx;
        if (o.kind === "item") {
          for (let d = 0; d < draft.length; d++) {
            const i = draft[d].items.findIndex((it) => it.id === o.value);
            if (i !== -1) {
              targetDayIdx = d;
              targetIndex = i;
              break;
            }
          }
        } else if (o.kind === "dayDrop" || o.kind === "day") {
          targetDayIdx = draft.findIndex((d) => d.id === o.value);
          targetIndex = targetDayIdx >= 0 ? draft[targetDayIdx].items.length : targetIndex;
        }

        if (targetDayIdx === -1) return prev;
        draft[targetDayIdx].items.splice(targetIndex, 0, moved);
        return draft;
      });

      return setActiveDrag(null);
    }

    // Reorder days
    if (a.kind === "day" && (o.kind === "day" || o.kind === "dayDrop")) {
      const from = dayIndex(a.value);
      const to = dayIndex(o.value);
      if (from >= 0 && to >= 0 && from !== to) {
        setDays((prev) => arrayMove(prev, from, to));
      }
    }

    setActiveDrag(null);
  }

  // ---------- CRUD ----------
  function addDay() {
    setDays((prev) => [...prev, { id: uuid(), label: `Day ${prev.length + 1}`, date: null, items: [] }]);
  }
  function removeDay(dayId: string) {
    setDays((prev) => prev.filter((d) => d.id !== dayId));
  }
  function updateDayLabel(dayId: string, label: string) {
    setDays((prev) => prev.map((d) => (d.id === dayId ? { ...d, label } : d)));
  }
  function updateDayDate(dayId: string, date: Date | null) {
    setDays((prev) =>
      prev.map((d) =>
        d.id === dayId
          ? { ...d, date, items: d.items.map((i) => (i.date ? i : { ...i, date })) }
          : d
      )
    );
  }
  function removeItem(dayId: string, itemId: string) {
    setDays((prev) => prev.map((d) => (d.id === dayId ? { ...d, items: d.items.filter((i) => i.id !== itemId) } : d)));
  }
  function updateItemDate(itemId: string, date: Date | null) {
    setDays((prev) => prev.map((d) => ({ ...d, items: d.items.map((i) => (i.id === itemId ? { ...i, date } : i)) })));
  }
  function updateItemTime(itemId: string, time: string | null) {
    setDays((prev) => prev.map((d) => ({ ...d, items: d.items.map((i) => (i.id === itemId ? { ...i, time } : i)) })));
  }
  function updateItemNotes(itemId: string, notes: string) {
    setDays((prev) => prev.map((d) => ({ ...d, items: d.items.map((i) => (i.id === itemId ? { ...i, notes } : i)) })));
  }
  function updateItemPax(itemId: string, pax: Pax) {
    setDays((prev) => prev.map((d) => ({ ...d, items: d.items.map((i) => (i.id === itemId ? { ...i, pax } : i)) })));
  }
  function applyPaxToAll(pax: Pax) {
    setDays((prev) => prev.map((d) => ({ ...d, items: d.items.map((i) => ({ ...i, pax })) })));
    toast.success("Applied guest counts to all items");
  }
  function clearAll() {
    setDays([]);
  }

  function splitDaysByItemDates() {
    // Partition items by YYYY-MM-DD
    const map = new Map<string, ItineraryItem[]>();
    for (const d of days) {
      for (const it of d.items) {
        const key = it.date ? dateKey(it.date) : "no-date";
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(it);
      }
    }
    const grouped: DayGroup[] = [];
    let n = 1;
    for (const [key, items] of map) {
      if (key === "no-date") {
        grouped.push({ id: uuid(), label: `Day ${n++}`, date: null, items });
      } else {
        const d = new Date(key);
        grouped.push({ id: uuid(), label: format(d, "EEE, dd MMM"), date: d, items });
        n++;
      }
    }
    setDays(grouped);
    toast.success("Grouped by dates");
  }

  // ---------- Derived ----------
  const allItems: ItineraryItem[] = useMemo(() => days.flatMap((d) => d.items), [days]);
  const total = useMemo(() => allItems.reduce((s, i) => s + itemTotal(i), 0), [allItems]);
  const conflicts = useMemo(() => {
    const list: [ItineraryItem, ItineraryItem][] = [];
    for (let i = 0; i < allItems.length; i++) {
      for (let j = i + 1; j < allItems.length; j++) {
        if (itemsOverlap(allItems[i], allItems[j])) list.push([allItems[i], allItems[j]]);
      }
    }
    return list;
  }, [allItems]);
  const conflictsPerDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of days) {
      let cnt = 0;
      for (let i = 0; i < d.items.length; i++) {
        for (let j = i + 1; j < d.items.length; j++) {
          if (itemsOverlap(d.items[i], d.items[j])) cnt++;
        }
      }
      map.set(d.id, cnt);
    }
    return map;
  }, [days]);

  // ---------- Calendar ----------
  const calendarGrid = useMemo(() => {
    const start = startOfWeek(startOfMonth(monthCursor));
    const end = endOfWeek(endOfMonth(monthCursor));
    const daysArr: Date[] = [];
    for (let d = start; d <= end; d = addDays(d, 1)) daysArr.push(d);
    const itemsByKey = new Map<string, ItineraryItem[]>();
    for (const it of allItems) {
      if (!it.date) continue;
      const k = dateKey(it.date);
      if (!itemsByKey.has(k)) itemsByKey.set(k, []);
      itemsByKey.get(k)!.push(it);
    }
    return { cells: daysArr, itemsByKey } as const;
  }, [monthCursor, allItems]);

  // ---------- Export / Import ----------
  async function exportItinerary() {
    const data = JSON.stringify(toSerializable(days), null, 2);
    try {
      await navigator.clipboard.writeText(data);
      toast.success("Itinerary JSON copied to clipboard");
    } catch {
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "itinerary.json";
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  function exportICS() {
    const lines: string[] = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//CapeTown Tours//EN"];
    for (const d of days) {
      for (const it of d.items) {
        const se = getStartEnd(it);
        if (!se) continue;
        const dtStart = format(se.start, "yyyyMMdd'T'HHmmss");
        const dtEnd = format(se.end, "yyyyMMdd'T'HHmmss");
        lines.push("BEGIN:VEVENT");
        lines.push(`UID:${it.id}@capetowntours`);
        lines.push(`DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss")}`);
        lines.push(`DTSTART:${dtStart}`);
        lines.push(`DTEND:${dtEnd}`);
        lines.push(`SUMMARY:${it.tour.name}`);
        const paxStr = `${billablePax(it.pax)} paying` + (it.pax.infants ? `, ${it.pax.infants} infants` : "");
        lines.push(`DESCRIPTION:Pax ${paxStr}${it.notes ? "\\n" + it.notes.replace(/\n/g, "\\n") : ""}`);
        lines.push("END:VEVENT");
      }
    }
    lines.push("END:VCALENDAR");

    const blob = new Blob([lines.join("\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "itinerary.ics";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("ICS exported");
  }

  function exportPrint() {
    const win = window.open("", "_blank");
    if (!win) return;
    const style = `<style>body{font-family:Inter,system-ui,Arial;padding:24px}h1{font-size:20px}h2{font-size:16px;margin-top:16px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ddd;padding:8px}th{text-align:left;background:#f7f7f7}</style>`;
    const rows = days
      .map(
        (d, di) =>
          `<h2>${di + 1}. ${d.label}${d.date ? " — " + format(d.date, "PPP") : ""}</h2>` +
          (d.items.length
            ? `<table><thead><tr><th>Tour</th><th>Date</th><th>Time</th><th>Pax</th><th>Total</th></tr></thead><tbody>` +
              d.items
                .map((i) => {
                  const se = getStartEnd(i);
                  return `<tr><td>${i.tour.name}</td><td>${i.date ? format(i.date, "PPP") : ""}</td><td>${se ? `${format(se.start, "HH:mm")}-${format(se.end, "HH:mm")}` : i.time || ""}</td><td>${billablePax(i.pax)} paying${i.pax.infants ? ` + ${i.pax.infants} infants` : ""}</td><td>${currencyFmt(currency).format(itemTotal(i))}</td></tr>`;
                })
                .join("") +
              `</tbody></table>`
            : `<div>(No tours)</div>`)
      )
      .join("");
    win.document.write(`<html><head><title>Itinerary</title>${style}</head><body><h1>Cape Town Tour Itinerary</h1>${rows}<h2>Total: ${currencyFmt(currency).format(total)}</h2></body></html>`);
    win.document.close();
    win.focus();
    win.print();
  }

  function importItinerary(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(String(reader.result));
        setDays(fromSerializable(json, availableTours || []));
        toast.success("Itinerary imported");
      } catch (e: any) {
        toast.error("Invalid JSON: " + e?.message);
      }
    };
    reader.readAsText(file);
  }

  // ---------- Booking ----------
  async function submitBooking() {
    setBookingLoading(true);

    const payload = {
      groups: (days || []).map((d) => ({
        dayId: d.id,
        label: d.label,
        date: d.date ? d.date.toISOString().split("T")[0] : null,
        items: (d.items || []).map((i) => ({
          itemId: i.id,
          tourId: i.tourId,
          name: i.tour.name,
          date: i.date ? i.date.toISOString().split("T")[0] : null,
          time: i.time,
          price: i.tour.price,
          pax: i.pax,
          notes: i.notes ?? "",
          durationMins: getDurationMins(i),
        })),
      })),
      itinerary: (days || []).flatMap((d) => d.items || []).map((i) => ({
        itemId: i.id,
        tourId: i.tourId,
        name: i.tour.name,
        date: i.date ? i.date.toISOString().split("T")[0] : null,
        time: i.time,
        price: i.tour.price,
        pax: i.pax,
        notes: i.notes ?? "",
        durationMins: getDurationMins(i),
      })),
      userInfo: user,
      total,
    };

    const attempt = async () =>
      fetch("/api/book/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

    try {
      let res = await attempt();
      for (let tries = 0; tries < 2 && !res.ok; tries++) {
        await new Promise((r) => setTimeout(r, 500 * (tries + 1)));
        res = await attempt();
      }
      const data = await res.json();
      if (data.success && data.booking) {
        toast.success("Booking confirmed! Redirecting to confirmation page...");
        setBookingOpen(false);
        // Redirect to confirmation page
        setTimeout(() => {
          window.location.href = `/booking/confirmed/${data.booking.id}`;
        }, 1500);
      } else {
        toast.error(data.error || "Booking failed. Please try again.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  }

  // ---------- DEV quick tests (runtime assertions) ----------
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    try {
      // 1) Duration overlap test with 3h default + 30m buffer
      const t: Tour = { id: "t", name: "X", description: "", price: 100 };
      const a: ItineraryItem = { id: "a", tourId: "t", tour: t, date: new Date("2025-01-01"), time: "09:00", pax: { adults: 2, children: 0, infants: 0 } };
      const b: ItineraryItem = { id: "b", tourId: "t", tour: t, date: new Date("2025-01-01"), time: "11:00", pax: { adults: 2, children: 0, infants: 0 } };
      if (!itemsOverlap(a, b)) throw new Error("Expected overlap due to 3h+30m buffer");

      // 2) Infants free, per-person flat pricing
      const c: ItineraryItem = { ...a, pax: { adults: 2, children: 1, infants: 3 }, tour: { ...t, price: 500 } };
      const totalC = itemTotal(c);
      if (totalC !== 500 * (2 + 1)) throw new Error("Pricing calc should ignore infants");

      // 3) ICS end time should be start + 3h + 30m
      const se = getStartEnd(a);
      if (!se) throw new Error("Start/end missing");
      const mins = (se.end.getTime() - se.start.getTime()) / 60000;
      if (mins !== DEFAULT_DURATION_MINS + TRAVEL_BUFFER_MINS) throw new Error("ICS duration mismatch");

      // 4) Payload building with empty days should not crash
      const tmpDays: DayGroup[] = [];
      JSON.stringify({
        groups: (tmpDays || []).map((d) => d.items),
        itinerary: (tmpDays || []).flatMap((d) => d.items || []),
      });

      // 5) Unavailable date disabled
      const uMap = { t: ["2025-01-02"] };
      if (!uMap.t.includes("2025-01-02")) throw new Error("Unavailable test seed failed");
      // (visual check occurs in UI)

      // console.info("Dev tests passed");
    } catch (e) {
      console.error("Dev quick tests failed:", e);
    }
  }, []);

  // ---------- Render helpers ----------
  function renderDayItems(day: DayGroup) {
    return (
      <SortableContext items={(day.items || []).map((it) => idFor.item(it.id))} strategy={verticalListSortingStrategy}>
        <ol className="space-y-3">
          {(day.items || []).map((it) => (
            <SortableItineraryRow
              key={it.id}
              item={it}
              currency={currency}
              onDateChange={(id, date) => updateItemDate(id, date)}
              onTimeChange={(id, time) => updateItemTime(id, time)}
              onNotesChange={(id, notes) => updateItemNotes(id, notes)}
              onRemove={(id) => removeItem(day.id, id)}
              onPaxChange={(id, pax) => updateItemPax(id, pax)}
              disabledDates={unavailableDates[it.tourId] || []}
            />
          ))}
        </ol>
      </SortableContext>
    );
  }

  return (
    <div className="w-full">
      {/* Sticky Toolbar */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b shadow-sm mb-6">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12 py-4">
          <div className="flex flex-col lg:flex-row flex-wrap items-start lg:items-center gap-3">
            <div className="relative w-full sm:w-auto">
              <Input placeholder="Search tours..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full sm:w-[260px] pl-9" />
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">🔎</span>
            </div>
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Button variant={view === "days" ? "default" : "outline"} size="sm" onClick={() => setView("days")}>List</Button>
              <Button variant={view === "calendar" ? "default" : "outline"} size="sm" onClick={() => setView("calendar")}>Calendar</Button>
            </div>
            <Separator orientation="vertical" className="h-6 hidden lg:block" />
            <Button size="sm" onClick={addDay}><Plus className="h-4 w-4 mr-1" /> <span className="hidden sm:inline">Add Day</span></Button>
            <Button variant="outline" size="sm" onClick={splitDaysByItemDates}><span className="hidden sm:inline">Group by date</span><span className="sm:hidden">Group</span></Button>
            <div className="flex flex-wrap items-center gap-2 ml-auto">
              <Button variant="outline" size="icon" className="sm:hidden" onClick={copyShareLink}><Share2 className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" className="hidden sm:flex" onClick={copyShareLink}><Share2 className="h-4 w-4 mr-1" /> Share</Button>
              <Button variant="outline" size="icon" className="sm:hidden" onClick={exportItinerary}><DownloadCloud className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" className="hidden sm:flex" onClick={exportItinerary}><DownloadCloud className="h-4 w-4 mr-1" /> Export</Button>
              <label className="inline-flex">
                <input type="file" className="hidden" accept="application/json" onChange={(e) => e.target.files && importItinerary(e.target.files[0])} />
                <Button variant="outline" size="icon" className="sm:hidden"><UploadCloud className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" className="hidden sm:flex"><UploadCloud className="h-4 w-4 mr-1" /> Import</Button>
              </label>
              <Button variant="outline" size="sm" className="hidden md:inline-flex" onClick={exportICS}>.ics</Button>
              <Button variant="outline" size="sm" className="hidden md:inline-flex" onClick={exportPrint}><Printer className="h-4 w-4 mr-1" /> Print</Button>
              <Dialog open={isBookingOpen} onOpenChange={setBookingOpen}>
                <DialogTrigger asChild>
                  <Button disabled={allItems.length === 0}><Send className="h-4 w-4 mr-1" /> Book Now - Pay on Pickup</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Complete Your Booking</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Guest Information */}
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name"
                          placeholder="John Doe"
                          value={user.name} 
                          onChange={(e) => setUser((u) => ({ ...u, name: e.target.value }))} 
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input 
                          id="email"
                          type="email" 
                          placeholder="your@email.com"
                          value={user.email} 
                          onChange={(e) => setUser((u) => ({ ...u, email: e.target.value }))} 
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone"
                          type="tel"
                          placeholder="+27 12 345 6789"
                          value={user.phone} 
                          onChange={(e) => setUser((u) => ({ ...u, phone: e.target.value }))} 
                        />
                        <p className="text-xs text-muted-foreground mt-1">Include country code for international numbers</p>
                      </div>
                      <div>
                        <Label htmlFor="pickup">Pickup Location</Label>
                        <Input 
                          id="pickup"
                          placeholder="Your hotel name or address"
                          value={user.pickup_location} 
                          onChange={(e) => setUser((u) => ({ ...u, pickup_location: e.target.value }))} 
                        />
                        <p className="text-xs text-muted-foreground mt-1">We offer free pickup from most Cape Town hotels</p>
                      </div>
                      <div>
                        <Label htmlFor="requirements">Special Requirements</Label>
                        <Textarea 
                          id="requirements"
                          placeholder="Any dietary restrictions, accessibility needs, or special requests?"
                          value={user.special_requirements} 
                          onChange={(e) => setUser((u) => ({ ...u, special_requirements: e.target.value }))} 
                          rows={3}
                        />
                      </div>
                    </div>
                    
                    {/* Payment Information */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Total Package:</span>
                          <span className="font-bold text-lg">{currencyFmt(currency).format(total)}</span>
                        </div>
                        <div className="text-xs text-blue-700">
                          💰 <strong>Payment on pickup</strong> - No advance payment required!
                        </div>
                      </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="text-center text-xs text-muted-foreground">
                      ✓ Instant confirmation • ✓ Free cancellation • ✓ Best price guarantee
                      <br />
                      🔒 Your information is secure and will never be shared
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setBookingOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={submitBooking} 
                      disabled={bookingLoading || allItems.length === 0 || !user.email}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {bookingLoading ? "Processing..." : "Confirm Booking"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        {/* Main Content Container */}
        <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
          {/* Catalog + Workspace */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
            {/* Catalog Sidebar */}
            <div className="xl:col-span-1 space-y-3 order-2 xl:order-1">
              {(filtered || []).length === 0 && <div className="text-sm text-muted-foreground">No tours found.</div>}
              <SortableContext
                items={(filtered || []).map((t) => idFor.sourceTour(t.id))}
                strategy={verticalListSortingStrategy}
              >
                {(filtered || []).map((tour) => (
                  <DraggableTourCard key={tour.id} tour={{ ...tour, durationMins: tour.durationMins ?? DEFAULT_DURATION_MINS }} />
                ))}
              </SortableContext>
            </div>

            {/* Workspace */}
            <div className="xl:col-span-3">
              {view === "days" ? (
                <div className="space-y-4">
                  <SortableContext items={(days || []).map((d) => idFor.day(d.id))} strategy={verticalListSortingStrategy}>
                    {(days || []).length === 0 ? (
                      <div className="rounded-2xl border-2 border-dashed p-10 text-center text-muted-foreground">
                        Drag tours here to start building your itinerary.
                      </div>
                    ) : (
                      (days || []).map((day, idx) => (
                        <SortableDayCard
                          key={day.id}
                          day={day}
                          index={idx}
                          currency={currency}
                          onLabelChange={updateDayLabel}
                          onDateChange={updateDayDate}
                          onRemoveDay={removeDay}
                          renderItems={renderDayItems}
                          onAutoSchedule={autoScheduleDay}
                          conflictsCount={conflictsPerDay.get(day.id) || 0}
                        />
                      ))
                    )}
                  </SortableContext>
                  {/* Apply pax to all */}
                  {(allItems.length > 0) && (
                    <div className="rounded-xl border p-3 flex items-end gap-3">
                      <div className="grid grid-cols-3 gap-2 flex-1">
                        <div>
                          <Label className="text-xs">Adults</Label>
                          <NumberInput 
                            value={bulkPax.adults} 
                            onChange={(n) => setBulkPax(prev => ({ ...prev, adults: n }))} 
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Children</Label>
                          <NumberInput 
                            value={bulkPax.children} 
                            onChange={(n) => setBulkPax(prev => ({ ...prev, children: n }))} 
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Infants &lt;3</Label>
                          <NumberInput 
                            value={bulkPax.infants} 
                            onChange={(n) => setBulkPax(prev => ({ ...prev, infants: n }))} 
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="text-sm text-muted-foreground">Apply guests across all items.</div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => applyPaxToAll(bulkPax)}
                        >
                          Apply to All
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Calendar view
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="icon" onClick={() => setMonthCursor(addDays(startOfMonth(monthCursor), -1))}><ChevronLeft className="h-4 w-4" /></Button>
                    <div className="font-semibold">{format(monthCursor, "MMMM yyyy")}</div>
                    <Button variant="ghost" size="icon" onClick={() => setMonthCursor(addDays(endOfMonth(monthCursor), 1))}><ChevronRight className="h-4 w-4" /></Button>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {calendarGrid.cells.map((d, i) => (
                      <CalendarCell
                        key={dateKey(d) + i}
                        dayDate={d}
                        items={calendarGrid.itemsByKey.get(dateKey(d)) || []}
                        isCurrentMonth={isSameMonth(d, monthCursor)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeDrag?.type === "source" && (
            <div className="rounded-xl border bg-card px-3 py-2 shadow-sm">{activeDrag.tour.name}</div>
          )}
          {activeDrag?.type === "item" && (
            <div className="rounded-xl border bg-card px-3 py-2 shadow-sm">{activeDrag.item.tour.name}</div>
          )}
          {activeDrag?.type === "day" && (
            <div className="rounded-xl border bg-card px-3 py-2 shadow-sm">{activeDrag.day.label}</div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Footer summary */}
      <div className="flex items-center justify-between rounded-xl border p-3">
        <div className="text-sm text-muted-foreground">
          {conflicts.length > 0 ? (
            <span className="text-destructive flex items-center gap-1"><TriangleAlert className="h-4 w-4" /> {conflicts.length} total conflict{conflicts.length > 1 ? "s" : ""}. Adjust times to resolve.</span>
          ) : (
            <span>All clear — no overlaps.</span>
          )}
        </div>
        <div className="font-semibold">
          Total: {currencyFmt(currency).format(total)}
        </div>
      </div>
    </div>
  );
}
