import React from 'react'
import { CheckCircle2, Clock, XCircle, ArrowDown } from 'lucide-react'
import { RotaAdimi } from './types'

export function RotaAkisCizelgesi({ adimlar }: { adimlar: RotaAdimi[] }): React.JSX.Element {
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 max-w-md w-full shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Süreç Onay Zinciri
        </h4>
        <span className="text-[10px] text-slate-500 font-mono">
          {adimlar.filter((a) => a.durum === 'ONAYLANDI').length}/{adimlar.length} Tamamlandı
        </span>
      </div>
      <div className="space-y-3">
        {adimlar.map((adim, index) => {
          const isDone = adim.durum === 'ONAYLANDI'
          const isPending = adim.durum === 'BEKLIYOR'
          const isRejected = adim.durum === 'REDDEDILDI'
          return (
            <React.Fragment key={adim.sira}>
              <div className="flex items-center gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 transition-colors hover:border-slate-700">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                  {isDone && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {isPending && <Clock className="w-5 h-5 text-amber-400" />}
                  {isRejected && <XCircle className="w-5 h-5 text-rose-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold truncate text-white">{adim.adSoyad}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        isDone
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                          : isPending
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                          : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                      }`}
                    >
                      {adim.tur}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">{adim.unvan}</div>
                  {adim.islemTarihi && (
                    <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                      {new Date(adim.islemTarihi).toLocaleString('tr-TR')}
                    </div>
                  )}
                </div>
              </div>
              {index < adimlar.length - 1 && (
                <div className="flex justify-center -my-1 text-slate-600">
                  <ArrowDown size={14} />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

