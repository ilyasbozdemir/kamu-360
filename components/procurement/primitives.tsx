'use client'

import { useId, useState, useEffect, type ReactNode } from 'react'
import { CalendarDays, ChevronDown, ChevronRight, Search } from 'lucide-react'

export type FieldKind =
  | 'text' | 'select' | 'search' | 'date' | 'percent' | 'unit' | 'range' | 'check' | 'toggle' | 'textarea' | 'number'

export type FieldSpec = {
  label: string
  kind?: FieldKind
  required?: boolean
  value?: string
  options?: string[]
  unit?: string
  unitOptions?: string[]
  disabled?: boolean
  checked?: boolean
  placeholders?: [string, string]
  span?: 1 | 2 | 3 | 4
  rows?: number
  onChange?: (val: any) => void
  onSearchClick?: () => void
}

const inputBase =
  'h-7 w-full min-w-0 rounded border border-[#d9dee5] bg-white px-2 text-[11px] text-[#26384c] outline-none transition focus:border-[#2d62d7] focus:ring-1 focus:ring-[#2d62d7]/30 disabled:bg-[#f5f6f8] disabled:text-[#8a94a1]'

export function Switch({ defaultOn = false, disabled, label }: { defaultOn?: boolean; disabled?: boolean; label: string }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => setOn(!on)}
      className={`relative h-3.5 w-6 shrink-0 rounded-full transition ${on ? 'bg-[#2d62d7]' : 'bg-[#d5dae1]'} disabled:opacity-60`}
    >
      <span className={`absolute top-0.5 size-2.5 rounded-full bg-white shadow transition-all ${on ? 'left-3' : 'left-0.5'}`} />
    </button>
  )
}

export function Field({ spec }: { spec: FieldSpec }) {
  const id = useId()
  const { label, kind = 'text', required, value, options = [], disabled, unit, unitOptions, placeholders, onChange, onSearchClick } = spec

  const [localVal, setLocalVal] = useState<any>(value ?? '')
  const [localChecked, setLocalChecked] = useState<boolean>(spec.checked ?? false)

  useEffect(() => {
    if (value !== undefined) setLocalVal(value)
  }, [value])

  useEffect(() => {
    if (spec.checked !== undefined) setLocalChecked(spec.checked)
  }, [spec.checked])

  const handleValChange = (v: any) => {
    setLocalVal(v)
    onChange?.(v)
  }

  if (kind === 'check') {
    return (
      <label className="flex items-center gap-2 text-[11px] text-[#5b6877] cursor-pointer">
        <input
          type="checkbox"
          checked={localChecked}
          disabled={disabled}
          onChange={(e) => {
            setLocalChecked(e.target.checked)
            onChange?.(e.target.checked)
          }}
          className="size-3.5 accent-[#2d62d7] rounded-sm"
        />
        {label}
      </label>
    )
  }
  if (kind === 'toggle') {
    return (
      <div className="flex items-center gap-2 text-[11px] text-[#5b6877]">
        <Switch defaultOn={spec.checked} disabled={disabled} label={label} />
        <span>{label}</span>
      </div>
    )
  }

  const labelEl = (
    <label htmlFor={id} className="mb-1 block text-[10px] text-[#5b6877]">
      {required && <i className="mr-1 not-italic text-[#d7445b]">*</i>}
      {label}
    </label>
  )

  let control: ReactNode
  switch (kind) {
    case 'select': {
      const opts = localVal && !options.includes(localVal) ? [localVal, ...options] : options
      control = (
        <div className="relative">
          <select
            id={id}
            value={localVal}
            disabled={disabled}
            onChange={(e) => handleValChange(e.target.value)}
            className={`${inputBase} appearance-none pr-6`}
          >
            <option value="">Seçiniz</option>
            {opts.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-2 size-3 text-[#a3acb8]" />
        </div>
      )
      break
    }
    case 'search':
      control = (
        <div className="flex">
          <input
            id={id}
            value={localVal}
            disabled={disabled}
            onChange={(e) => handleValChange(e.target.value)}
            className={`${inputBase} rounded-r-none`}
          />
          <button
            type="button"
            onClick={onSearchClick}
            aria-label={`${label} ara`}
            className="flex h-7 w-9 shrink-0 items-center justify-center rounded-r border border-l-0 border-[#c9d3f0] bg-[#f2f5ff] text-[#2d62d7] hover:bg-[#e6ecff] transition"
          >
            <Search className="size-3" />
          </button>
        </div>
      )
      break
    case 'date':
      control = (
        <input
          id={id}
          type="date"
          value={localVal}
          disabled={disabled}
          onChange={(e) => handleValChange(e.target.value)}
          className={inputBase}
        />
      )
      break
    case 'percent':
      control = (
        <div className="flex">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-l border border-r-0 border-[#d9dee5] bg-[#f5f6f8] text-[11px] text-[#5b6877]">%</span>
          <input
            id={id}
            inputMode="decimal"
            value={localVal}
            disabled={disabled}
            onChange={(e) => handleValChange(e.target.value)}
            className={`${inputBase} rounded-l-none`}
          />
        </div>
      )
      break
    case 'number':
      control = (
        <input
          id={id}
          type="number"
          value={localVal}
          disabled={disabled}
          onChange={(e) => handleValChange(e.target.value)}
          className={inputBase}
        />
      )
      break
    case 'unit':
      control = (
        <div className="flex">
          <input
            id={id}
            value={localVal}
            disabled={disabled}
            onChange={(e) => handleValChange(e.target.value)}
            className={`${inputBase} ${unitOptions ? 'rounded-r-none' : 'rounded-r-none'}`}
          />
          {unitOptions ? (
            <select aria-label={`${label} birimi`} disabled={disabled} className="h-7 w-20 shrink-0 rounded-r border border-l-0 border-[#d9dee5] bg-white px-1 text-[11px] text-[#5b6877]">
              {unitOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          ) : (
            <span className="flex h-7 w-12 shrink-0 items-center justify-center rounded-r border border-l-0 border-[#d9dee5] bg-[#f5f6f8] text-[11px] text-[#5b6877]">{unit}</span>
          )}
        </div>
      )
      break
    case 'range':
      control = (
        <div className="flex gap-0">
          <input id={id} placeholder={placeholders?.[0] ?? 'Minimum'} disabled={disabled} className={`${inputBase} rounded-r-none`} />
          <input aria-label={`${label} üst`} placeholder={placeholders?.[1] ?? 'Maksimum'} disabled={disabled} className={`${inputBase} rounded-l-none border-l-0`} />
        </div>
      )
      break
    case 'textarea':
      control = (
        <textarea
          id={id}
          rows={spec.rows ?? 3}
          value={localVal}
          disabled={disabled}
          onChange={(e) => handleValChange(e.target.value)}
          className={`${inputBase} h-auto resize-y py-1.5`}
        />
      )
      break
    default:
      control = (
        <input
          id={id}
          value={localVal}
          disabled={disabled}
          onChange={(e) => handleValChange(e.target.value)}
          className={inputBase}
        />
      )
  }

  return <div className="min-w-0">{labelEl}{control}</div>
}

const spanClass: Record<number, string> = { 1: '', 2: 'sm:col-span-2', 3: 'sm:col-span-2 xl:col-span-3', 4: 'sm:col-span-2 xl:col-span-4' }

export function FieldGrid({ fields, cols = 4 }: { fields: FieldSpec[]; cols?: 2 | 3 | 4 }) {
  const colClass = cols === 4 ? 'sm:grid-cols-2 xl:grid-cols-4' : cols === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
  return (
    <div className={`grid grid-cols-1 items-end gap-x-6 gap-y-3 ${colClass}`}>
      {fields.map((f) => (
        <div key={f.label} className={spanClass[f.span ?? 1]}><Field spec={f} /></div>
      ))}
    </div>
  )
}

export function Divider() {
  return <hr className="my-4 border-[#e6e9ee]" />
}

export function Accordion({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children?: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="border-b border-[#e3e6eb] bg-[#f7f8fa] first:rounded-t last:rounded-b last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-[11px] ${open ? 'text-[#2d62d7]' : 'text-[#33445a]'}`}
      >
        {open ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
        {title}
      </button>
      {open && <div className="border-t border-[#e3e6eb] bg-white p-4">{children}</div>}
    </section>
  )
}

export function AccordionGroup({ children }: { children: ReactNode }) {
  return <div className="overflow-hidden rounded border border-[#e1e5ea]">{children}</div>
}

export function Badge({ tone, children }: { tone: 'gray' | 'cyan' | 'green' | 'blue'; children: ReactNode }) {
  const tones = {
    gray: 'bg-[#e4e6ea] text-[#4f5b69]',
    cyan: 'bg-[#cdeef3] text-[#1b6f80]',
    green: 'bg-[#dcefd9] text-[#2f6a2f]',
    blue: 'bg-[#d3e0fb] text-[#2d62d7]',
  }
  return <span className={`flex-1 rounded-sm px-2 py-1 text-center text-[10px] font-medium ${tones[tone]}`}>{children}</span>
}

export function PrimaryButton({ children, onClick, type = 'button' }: { children: ReactNode; onClick?: () => void; type?: 'button' | 'submit' }) {
  return (
    <button type={type} onClick={onClick} className="rounded bg-[#2d62d7] px-3.5 py-1.5 text-[11px] font-medium text-white hover:bg-[#2455bd]">
      {children}
    </button>
  )
}

export function OutlineButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded border border-[#2d62d7] bg-white px-3 py-1.5 text-[11px] font-medium text-[#2d62d7] hover:bg-[#f2f5ff]">
      {children}
    </button>
  )
}

export function SimpleTable({ columns, rows, empty }: { columns: string[]; rows: ReactNode[][]; empty?: string }) {
  return (
    <div className="overflow-x-auto rounded border border-[#e3e6eb]">
      <table className="w-full min-w-[560px] border-collapse text-[11px]">
        <thead>
          <tr className="bg-[#f4f6f9] text-left text-[10px] font-semibold text-[#44546a]">
            {columns.map((c) => <th key={c} className="border-b border-[#e3e6eb] px-3 py-2">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={columns.length} className="px-3 py-5 text-center text-[#99a4b0]">{empty ?? 'Kayıt bulunamadı'}</td></tr>
          )}
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-[#eef0f3] last:border-b-0">
              {r.map((cell, j) => <td key={j} className="px-3 py-2 text-[#33445a]">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function NotesBox() {
  const [notes, setNotes] = useState<string[]>([])
  const [draft, setDraft] = useState('')
  return (
    <div className="space-y-3">
      <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} placeholder="Not giriniz" className={`${inputBase} h-auto resize-y py-1.5`} aria-label="Yeni not" />
      <div className="flex justify-end">
        <PrimaryButton onClick={() => { if (draft.trim()) { setNotes([draft.trim(), ...notes]); setDraft('') } }}>Not Ekle</PrimaryButton>
      </div>
      {notes.length > 0 && (
        <ul className="space-y-1.5">
          {notes.map((n, i) => (
            <li key={i} className="rounded border border-[#e3e6eb] bg-[#fafbfc] px-3 py-2 text-[11px] text-[#33445a]">
              {n}<span className="mt-0.5 block text-[9px] text-[#99a4b0]">lojtest1 · şimdi</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function AttachmentsBox() {
  const [files, setFiles] = useState<string[]>([])
  const id = useId()
  return (
    <div className="space-y-3">
      <label htmlFor={id} className="flex cursor-pointer flex-col items-center justify-center rounded border border-dashed border-[#c9d1dc] bg-[#fafbfc] px-4 py-6 text-center text-[11px] text-[#7b8794] hover:border-[#2d62d7]">
        <CalendarDays className="hidden" />
        Dosya seçmek için tıklayın
        <input id={id} type="file" multiple className="sr-only" onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))} />
      </label>
      <SimpleTable columns={['Dosya Adı', 'Yükleyen']} rows={files.map((f) => [f, 'lojtest1'])} empty="Henüz ek eklenmedi" />
    </div>
  )
}
