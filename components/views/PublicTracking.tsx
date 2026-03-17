'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SHIPMENTS, STATUS_LABELS, STATUS_COLORS, SERVICE_LABELS } from '@/lib/data';
import type { ShipmentStatus } from '@/lib/data';

interface PublicTrackingProps {
  onBack: () => void;
}

const STATUS_STEP_ORDER: ShipmentStatus[] = [
  'received',
  'at_origin_branch',
  'in_transit',
  'at_destination_branch',
  'out_for_delivery',
  'delivered',
];

const CURRENT_LOCATION_MESSAGES: Partial<Record<ShipmentStatus, { icon: string; headline: string; detail: (s: typeof SHIPMENTS[0]) => string }>> = {
  received: {
    icon: 'box',
    headline: 'تم استلام الطرد من الوكيل',
    detail: s => `تم تسجيل طردكم بواسطة الوكيل ${s.agentName} في ${s.branchName}`,
  },
  at_origin_branch: {
    icon: 'building',
    headline: 'الطرد في فرع الإرسال',
    detail: s => `طردكم الآن في ${s.branchName} وسيتم نقله قريباً`,
  },
  in_transit: {
    icon: 'truck',
    headline: 'الطرد في الطريق',
    detail: s => `طردكم في طريقه من ${s.branchName} إلى محافظة ${s.governorate}`,
  },
  at_destination_branch: {
    icon: 'building',
    headline: 'الطرد جاهز للاستلام من الفرع',
    detail: s => `طردكم متوفر للاستلام في ${s.branchName} — يمكنكم المجيء لاستلامه`,
  },
  out_for_delivery: {
    icon: 'truck-moving',
    headline: 'الطرد في متناول السائق للتوصيل',
    detail: s => `طردكم خرج للتوصيل مع السائق ${s.driverName ?? 'السائق'}. سيصل قريباً`,
  },
  delivered: {
    icon: 'check',
    headline: 'تم تسليم الطرد بنجاح',
    detail: () => 'تم تسليم طردكم بنجاح. شكراً لاستخدامكم خدمة هدهد سبأ',
  },
  rejected: {
    icon: 'x',
    headline: 'تم رفض الطرد',
    detail: () => 'للمزيد من المعلومات يرجى التواصل مع الفرع',
  },
};

function StatusIcon({ status }: { status: ShipmentStatus }) {
  const cfg = CURRENT_LOCATION_MESSAGES[status];
  if (!cfg) return null;

  const iconClass = 'w-8 h-8';
  const icons: Record<string, React.ReactNode> = {
    box: <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
    building: <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    truck: <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    'truck-moving': <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>,
    check: <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    x: <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  };

  return icons[cfg.icon] ?? null;
}

export default function PublicTracking({ onBack }: PublicTrackingProps) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<typeof SHIPMENTS[0] | null | 'not_found'>(null);

  const handleSearch = () => {
    const found = SHIPMENTS.find(s => s.trackingNumber.toLowerCase() === query.trim().toLowerCase());
    setResult(found ?? 'not_found');
  };

  const currentStep = result && result !== 'not_found'
    ? STATUS_STEP_ORDER.indexOf(result.status)
    : -1;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Nav */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-IF8pnxKBjP4iTsBkjBMv7XBydLcakE.png"
            alt="هدهد سبأ"
            className="h-10 w-auto"
          />
          <button
            onClick={onBack}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            رجوع
          </button>
        </div>
      </header>

      {/* Hero Search */}
      <div className="bg-secondary text-secondary-foreground py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">تتبع شحنتك</h1>
          <p className="text-secondary-foreground/70 mb-6 text-sm">أدخل رقم الطرد لمعرفة موقعه الحالي</p>
          <div className="flex gap-2 max-w-lg mx-auto">
            <Input
              placeholder="YEM-ADN-0002456"
              className="text-center font-mono bg-white text-foreground border-0 h-12 text-base"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <Button className="bg-primary text-primary-foreground h-12 px-6 font-bold shrink-0" onClick={handleSearch}>
              بحث
            </Button>
          </div>

          {/* Quick picks */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            <p className="text-xs text-secondary-foreground/60 w-full">جرّب:</p>
            {SHIPMENTS.map(s => (
              <button
                key={s.id}
                onClick={() => { setQuery(s.trackingNumber); }}
                className="text-xs font-mono bg-white/10 hover:bg-white/20 text-secondary-foreground px-3 py-1 rounded-full transition-colors"
              >
                {s.trackingNumber}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Not Found */}
        {result === 'not_found' && (
          <Card>
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-lg font-bold mb-2">لم يتم العثور على هذا الرقم</h2>
              <p className="text-muted-foreground text-sm">تأكد من رقم الطرد وحاول مجدداً</p>
            </CardContent>
          </Card>
        )}

        {/* RESULT */}
        {result && result !== 'not_found' && (() => {
          const cfg = CURRENT_LOCATION_MESSAGES[result.status];
          return (
            <div className="space-y-5">
              {/* Primary Status Card */}
              <Card className={`overflow-hidden border-2 ${
                result.status === 'delivered' ? 'border-green-300' :
                result.status === 'rejected' ? 'border-red-300' :
                result.status === 'out_for_delivery' ? 'border-primary' :
                'border-secondary/30'
              }`}>
                <div className={`px-5 py-4 flex items-center gap-4 ${
                  result.status === 'delivered' ? 'bg-green-600' :
                  result.status === 'rejected' ? 'bg-red-600' :
                  result.status === 'out_for_delivery' ? 'bg-primary' :
                  'bg-secondary'
                } text-white`}>
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <StatusIcon status={result.status} />
                  </div>
                  <div>
                    <p className="text-xs opacity-70 mb-0.5">رقم الطرد: {result.trackingNumber}</p>
                    <p className="text-lg font-bold">{cfg?.headline}</p>
                    <p className="text-sm opacity-80 mt-0.5">{cfg?.detail(result)}</p>
                  </div>
                </div>
                <CardContent className="pt-4 pb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">المرسل</p>
                      <p className="font-medium">{result.senderName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">المستلم</p>
                      <p className="font-medium">{result.receiverName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">الوزن</p>
                      <p className="font-medium">{result.weight} كجم</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">الخدمة</p>
                      <p className="font-medium">{SERVICE_LABELS[result.serviceType]}</p>
                    </div>
                  </div>

                  {result.driverName && result.status === 'out_for_delivery' && (
                    <>
                      <Separator className="my-4" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {result.driverName[0]}
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">السائق</p>
                            <p className="font-semibold text-sm">{result.driverName}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <a href="tel:+967777777771">
                            <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              اتصال
                            </Button>
                          </a>
                          <a href={`https://wa.me/967777777771?text=مرحباً، أتابع طردي رقم ${result.trackingNumber}`} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="h-8 bg-green-600 text-white text-xs gap-1">
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                              </svg>
                              واتساب
                            </Button>
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Progress Steps */}
              {result.status !== 'rejected' && result.status !== 'postponed' && (
                <Card>
                  <CardContent className="pt-5 pb-5">
                    <p className="text-sm font-semibold mb-5">مراحل الشحنة</p>
                    <div className="flex items-start">
                      {STATUS_STEP_ORDER.map((step, i) => {
                        const isComplete = i <= currentStep;
                        const isCurrent = i === currentStep;
                        const isLast = i === STATUS_STEP_ORDER.length - 1;
                        return (
                          <div key={step} className="flex flex-col items-center flex-1">
                            <div className="flex items-center w-full">
                              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${
                                isCurrent ? 'border-primary bg-primary' :
                                isComplete ? 'border-primary bg-primary/20' :
                                'border-border bg-background'
                              }`}>
                                {isComplete && !isCurrent && (
                                  <svg className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                                {isCurrent && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                              </div>
                              {!isLast && <div className={`flex-1 h-0.5 ${i < currentStep ? 'bg-primary' : 'bg-border'}`} />}
                            </div>
                            <p className={`text-[10px] text-center mt-2 leading-tight max-w-[60px] ${
                              isCurrent ? 'text-primary font-semibold' :
                              isComplete ? 'text-muted-foreground' : 'text-muted-foreground/50'
                            }`}>
                              {STATUS_LABELS[step]}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Timeline */}
              <Card>
                <CardContent className="pt-5 pb-5">
                  <p className="text-sm font-semibold mb-5">سجل التحديثات</p>
                  <div className="relative border-r-2 border-primary/20 pr-5 space-y-5">
                    {[...result.events].reverse().map((ev, i) => (
                      <div key={ev.id} className="relative">
                        <div className={`absolute -right-[25px] top-1 w-3.5 h-3.5 rounded-full border-2 border-background ${
                          i === 0 ? 'bg-primary' : 'bg-muted-foreground/30'
                        }`} />
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`text-sm font-medium ${i === 0 ? 'text-primary' : 'text-foreground'}`}>
                              {STATUS_LABELS[ev.status as ShipmentStatus]}
                            </p>
                            <p className="text-xs text-muted-foreground">{ev.location}</p>
                          </div>
                          <p className="text-xs text-muted-foreground shrink-0">{new Date(ev.timestamp).toLocaleString('ar-YE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* WhatsApp Notification CTA */}
              {result.status !== 'delivered' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-green-800 text-sm">تلقَّ تحديثات تلقائية على واتساب</p>
                    <p className="text-xs text-green-700 mt-0.5">سنرسل لك إشعاراً فور أي تغيير في حالة طردك</p>
                  </div>
                  <a
                    href={`https://wa.me/967777777771?text=اشتراك تتبع الطرد: ${result.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" className="bg-green-600 text-white text-xs shrink-0 gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      </svg>
                      اشتراك
                    </Button>
                  </a>
                </div>
              )}
            </div>
          );
        })()}

        {/* Empty State */}
        {!result && (
          <div className="text-center py-12 text-muted-foreground">
            <svg className="w-16 h-16 mx-auto mb-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="font-medium">أدخل رقم الطرد للبحث</p>
            <p className="text-sm mt-1">ستجد الموقع الحالي لطردك وتاريخ التحديثات</p>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-8 py-6 text-center text-xs text-muted-foreground">
        <p>هدهد سبأ — رسولك الرقمي. للدعم: support@hodhudsaba.com</p>
      </footer>
    </div>
  );
}
