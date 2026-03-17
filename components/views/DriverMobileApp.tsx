'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SHIPMENTS, DRIVERS, STATUS_LABELS, STATUS_COLORS } from '@/lib/data';

type DriverScreen = 'home' | 'delivery_detail' | 'history' | 'profile';

interface DriverMobileAppProps {
  onBack: () => void;
}

const MY_DRIVER = DRIVERS[0];
const ACTIVE_SHIPMENTS = SHIPMENTS.filter(s => s.status === 'out_for_delivery' || s.status === 'at_destination_branch');
const DONE_SHIPMENTS = SHIPMENTS.filter(s => s.status === 'delivered' || s.status === 'rejected');

type DeliveryAction = 'delivered' | 'rejected' | 'postponed' | null;

function DeliveryActionDialog({ shipment, onAction }: { shipment: typeof SHIPMENTS[0]; onAction: (a: DeliveryAction) => void }) {
  const [action, setAction] = useState<DeliveryAction>(null);
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <div className="text-center p-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-bold text-lg">تم التحديث</p>
        <p className="text-sm text-muted-foreground mt-1">
          {action === 'delivered' ? 'تم تسليم الشحنة بنجاح' : action === 'rejected' ? 'تم تسجيل الرفض' : 'تم تأجيل التسليم'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">سيتم إرسال إشعار واتساب للمرسل والمستلم</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-muted/30 rounded-xl p-3 text-sm">
        <p className="font-mono text-xs text-primary">{shipment.trackingNumber}</p>
        <p className="font-medium mt-1">{shipment.receiverName}</p>
        <p className="text-xs text-muted-foreground">{shipment.address}</p>
        <p className="text-xs text-muted-foreground mt-1">هاتف: {shipment.receiverPhone}</p>
      </div>

      <p className="text-sm font-medium">تحديث حالة الشحنة</p>
      <div className="space-y-2">
        {([
          { key: 'delivered', label: 'تم التسليم بنجاح', color: 'border-green-500 bg-green-50 text-green-800', icon: '✓' },
          { key: 'rejected', label: 'رفض المستلم الاستلام', color: 'border-red-500 bg-red-50 text-red-800', icon: '✕' },
          { key: 'postponed', label: 'تأجيل التسليم', color: 'border-yellow-500 bg-yellow-50 text-yellow-800', icon: '⏱' },
        ] as const).map(opt => (
          <button
            key={opt.key}
            onClick={() => setAction(opt.key)}
            className={`w-full text-right p-3 rounded-xl border-2 transition-colors font-medium text-sm ${
              action === opt.key ? opt.color : 'border-border text-foreground'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {action === 'delivered' && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">توقيع المستلم الإلكتروني</p>
          <div className="h-20 border-2 border-dashed border-border rounded-xl flex items-center justify-center text-muted-foreground text-xs">
            منطقة التوقيع — اضغط للتوقيع
          </div>
          <p className="text-xs font-medium text-muted-foreground">صورة إثبات التسليم</p>
          <div className="h-16 border-2 border-dashed border-border rounded-xl flex items-center justify-center text-muted-foreground text-xs gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            التقاط صورة
          </div>
        </div>
      )}

      {action && (
        <Button
          className={`w-full ${action === 'delivered' ? 'bg-green-600' : action === 'rejected' ? 'bg-red-600' : 'bg-yellow-600'} text-white`}
          onClick={() => { setConfirmed(true); onAction(action); }}
        >
          تأكيد — {action === 'delivered' ? 'تم التسليم' : action === 'rejected' ? 'تم الرفض' : 'تأجيل'}
        </Button>
      )}
    </div>
  );
}

export default function DriverMobileApp({ onBack }: DriverMobileAppProps) {
  const [screen, setScreen] = useState<DriverScreen>('home');
  const [selectedShipment, setSelectedShipment] = useState<typeof SHIPMENTS[0] | null>(null);
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [deliveredIds, setDeliveredIds] = useState<string[]>([]);

  const NAV = [
    { key: 'home', label: 'الشحنات', icon: (a: boolean) => (
      <svg className={`w-5 h-5 ${a ? 'text-primary' : 'text-muted-foreground'}`} fill={a ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )},
    { key: 'history', label: 'السجل', icon: (a: boolean) => (
      <svg className={`w-5 h-5 ${a ? 'text-primary' : 'text-muted-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )},
    { key: 'profile', label: 'حسابي', icon: (a: boolean) => (
      <svg className={`w-5 h-5 ${a ? 'text-primary' : 'text-muted-foreground'}`} fill={a ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center" dir="rtl">
      <div className="w-full max-w-sm bg-background shadow-2xl min-h-screen flex flex-col relative border-x border-border/50">

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-primary text-primary-foreground text-xs">
          <span>9:41</span>
          <button onClick={onBack} className="font-medium text-xs opacity-80 hover:opacity-100">← رجوع للنظام</button>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>
          </div>
        </div>

        {/* App Header */}
        <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
          <div>
            <p className="font-bold text-sm">تطبيق السائق</p>
            <p className="text-xs opacity-70">{MY_DRIVER.name} — {MY_DRIVER.governorate}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOnDuty(!isOnDuty)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                isOnDuty ? 'bg-green-400 text-white' : 'bg-white/20 text-white'
              }`}
            >
              {isOnDuty ? 'نشط' : 'غير متاح'}
            </button>
          </div>
        </div>

        <ScrollArea className="flex-1 pb-16">

          {/* ===== HOME: ACTIVE DELIVERIES ===== */}
          {screen === 'home' && (
            <div>
              {/* Status Banner */}
              <div className="bg-primary/5 border-b border-primary/10 px-4 py-3">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-lg font-bold text-primary">{MY_DRIVER.assignedShipments}</p>
                    <p className="text-xs text-muted-foreground">مسندة</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600">{MY_DRIVER.deliveredToday + deliveredIds.length}</p>
                    <p className="text-xs text-muted-foreground">سُلمت اليوم</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{MY_DRIVER.rating}</p>
                    <p className="text-xs text-muted-foreground">تقييمي</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mx-4 mt-4 bg-muted/40 rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">موقعك الحالي</p>
                  <p className="text-sm font-medium">شارع التسعين — عدن</p>
                </div>
                <button className="mr-auto bg-primary text-primary-foreground text-xs px-2 py-1 rounded-lg">تحديث</button>
              </div>

              {/* Shipments */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">شحنات اليوم</p>
                  <Badge className="bg-orange-100 text-orange-800 text-xs">{ACTIVE_SHIPMENTS.length} نشطة</Badge>
                </div>

                {ACTIVE_SHIPMENTS.map((s, idx) => {
                  const isDone = deliveredIds.includes(s.id);
                  return (
                    <div key={s.id} className={`border-2 rounded-xl overflow-hidden transition-all ${
                      isDone ? 'border-green-200 bg-green-50 opacity-70' : idx === 0 ? 'border-primary bg-primary/5' : 'border-border bg-card'
                    }`}>
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs text-primary font-semibold">{s.trackingNumber}</span>
                          {idx === 0 && !isDone && <Badge className="bg-primary/10 text-primary text-xs">التالي</Badge>}
                          {isDone && <Badge className="bg-green-100 text-green-800 text-xs">تم التسليم</Badge>}
                        </div>
                        <p className="font-semibold text-sm">{s.receiverName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{s.address}</p>
                        <p className="text-xs text-muted-foreground">{s.receiverPhone}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <a href={`tel:${s.receiverPhone}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full text-xs h-8 gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              اتصال
                            </Button>
                          </a>
                          {!isDone && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" className="flex-1 bg-primary text-primary-foreground text-xs h-8">
                                  تحديث الحالة
                                </Button>
                              </DialogTrigger>
                              <DialogContent dir="rtl">
                                <DialogHeader>
                                  <DialogTitle>تحديث حالة الشحنة</DialogTitle>
                                </DialogHeader>
                                <DeliveryActionDialog
                                  shipment={s}
                                  onAction={(a) => { if (a) setDeliveredIds(prev => [...prev, s.id]); }}
                                />
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===== HISTORY ===== */}
          {screen === 'history' && (
            <div className="p-4">
              <h2 className="font-bold mb-4">سجل التسليمات</h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-card border border-border/60 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-green-600">{MY_DRIVER.deliveredToday}</p>
                  <p className="text-xs text-muted-foreground">سُلمت اليوم</p>
                </div>
                <div className="bg-card border border-border/60 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold">{MY_DRIVER.assignedShipments}</p>
                  <p className="text-xs text-muted-foreground">إجمالي المسندة</p>
                </div>
              </div>
              <div className="space-y-2">
                {SHIPMENTS.map(s => (
                  <div key={s.id} className="bg-card border border-border/60 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs text-primary">{s.trackingNumber}</span>
                      <Badge className={`${STATUS_COLORS[s.status]} text-xs`}>{STATUS_LABELS[s.status]}</Badge>
                    </div>
                    <p className="text-sm font-medium">{s.receiverName}</p>
                    <p className="text-xs text-muted-foreground">{s.governorate} — {new Date(s.updatedAt).toLocaleDateString('ar-YE')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== PROFILE ===== */}
          {screen === 'profile' && (
            <div className="p-4">
              <div className="flex flex-col items-center text-center mb-6 pt-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary mb-3">
                  {MY_DRIVER.name[0]}
                </div>
                <h2 className="text-xl font-bold">{MY_DRIVER.name}</h2>
                <p className="text-sm text-muted-foreground">{MY_DRIVER.phone}</p>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < Math.floor(MY_DRIVER.rating) ? 'text-yellow-400' : 'text-muted'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm font-medium mr-1">{MY_DRIVER.rating}</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'المحافظة', value: MY_DRIVER.governorate },
                  { label: 'المركبة', value: MY_DRIVER.vehicle },
                  { label: 'رقم الرخصة', value: MY_DRIVER.licenseNumber },
                  { label: 'الشحنات المسندة', value: MY_DRIVER.assignedShipments.toString() },
                  { label: 'سُلمت اليوم', value: MY_DRIVER.deliveredToday.toString() },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between bg-muted/30 rounded-xl px-4 py-3">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-5" />

              <div className="space-y-2">
                <button
                  onClick={() => setIsOnDuty(!isOnDuty)}
                  className={`w-full py-3 rounded-xl font-medium text-sm transition-colors ${
                    isOnDuty ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}
                >
                  {isOnDuty ? 'إنهاء المناوبة' : 'بدء المناوبة'}
                </button>
                <button className="w-full py-3 rounded-xl bg-muted/50 font-medium text-sm text-muted-foreground">
                  تسجيل الخروج
                </button>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Bottom Navigation */}
        <div className="border-t border-border bg-card flex sticky bottom-0">
          {NAV.map(item => (
            <button
              key={item.key}
              onClick={() => setScreen(item.key as DriverScreen)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors relative`}
            >
              {item.key === 'home' && ACTIVE_SHIPMENTS.length > 0 && (
                <span className="absolute top-1.5 right-6 w-4 h-4 bg-primary text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                  {ACTIVE_SHIPMENTS.length}
                </span>
              )}
              {item.icon(screen === item.key)}
              <span className={`text-[10px] font-medium ${screen === item.key ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
