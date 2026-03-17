'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SHIPMENTS, GOVERNORATES, STATUS_LABELS, STATUS_COLORS, SERVICE_LABELS } from '@/lib/data';

type AgentScreen = 'home' | 'add_shipment' | 'my_shipments' | 'search' | 'earnings' | 'shipment_success' | 'notifications' | 'profile';

interface AgentMobileAppProps {
  onBack: () => void;
}

const MY_SHIPMENTS = SHIPMENTS.slice(0, 3);

const NAV_ITEMS = [
  { key: 'home', label: 'الرئيسية', icon: (active: boolean) => (
    <svg className={`w-5 h-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )},
  { key: 'add_shipment', label: 'إضافة', icon: (active: boolean) => (
    <svg className={`w-5 h-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )},
  { key: 'my_shipments', label: 'شحناتي', icon: (active: boolean) => (
    <svg className={`w-5 h-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  )},
  { key: 'search', label: 'بحث', icon: (active: boolean) => (
    <svg className={`w-5 h-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )},
  { key: 'earnings', label: 'الأرباح', icon: (active: boolean) => (
    <svg className={`w-5 h-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )},
];

export default function AgentMobileApp({ onBack }: AgentMobileAppProps) {
  const [screen, setScreen] = useState<AgentScreen>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [newShipment, setNewShipment] = useState({
    senderName: '', senderPhone: '', receiverName: '', receiverPhone: '',
    governorate: '', address: '', value: '', weight: '', serviceType: 'standard',
  });
  const [step, setStep] = useState(1);
  const [searchResult, setSearchResult] = useState<typeof SHIPMENTS[0] | null | 'not_found'>(null);

  const handleSearch = () => {
    const found = SHIPMENTS.find(s => s.trackingNumber.toLowerCase() === searchQuery.toLowerCase());
    setSearchResult(found || 'not_found');
  };

  const handleAddShipment = () => {
    if (step < 3) { setStep(s => s + 1); } else { setScreen('shipment_success'); setStep(1); }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center" dir="rtl">
      {/* Device Chrome */}
      <div className="w-full max-w-sm bg-background shadow-2xl min-h-screen flex flex-col relative border-x border-border/50">

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-secondary text-secondary-foreground text-xs">
          <span>9:41</span>
          <button onClick={onBack} className="font-medium text-xs opacity-70 hover:opacity-100">← رجوع للنظام</button>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" /></svg>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>
          </div>
        </div>

        {/* App Header */}
        <div className="bg-secondary text-secondary-foreground px-4 py-3 flex items-center justify-between">
          <div>
            <p className="font-bold text-sm">تطبيق الوكلاء</p>
            <p className="text-xs text-secondary-foreground/60">وليد الغداري — عدن</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setScreen('notifications')} className="relative w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0.5 left-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-secondary text-[8px] flex items-center justify-center text-white font-bold">3</span>
            </button>
            <button onClick={() => setScreen('profile')} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">و</button>
          </div>
        </div>

        <ScrollArea className="flex-1 pb-16">

          {/* ===== HOME ===== */}
          {screen === 'home' && (
            <div>
              {/* Profile Banner */}
              <div className="bg-secondary text-secondary-foreground px-4 pb-5 pt-1">
                <div className="grid grid-cols-3 gap-3 text-center mt-2">
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-xl font-bold">87</p>
                    <p className="text-xs opacity-70">شحنة</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-xl font-bold text-primary">4,350</p>
                    <p className="text-xs opacity-70">ر.ي</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-xl font-bold">5%</p>
                    <p className="text-xs opacity-70">عمولة</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">الإجراءات السريعة</p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setScreen('add_shipment')} className="bg-primary text-primary-foreground rounded-xl p-4 text-right hover:bg-primary/90 active:scale-95 transition-transform">
                    <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="font-bold text-sm">إضافة شحنة</p>
                    <p className="text-xs opacity-80 mt-0.5">تسجيل طرد جديد</p>
                  </button>
                  <button onClick={() => setScreen('search')} className="bg-secondary text-secondary-foreground rounded-xl p-4 text-right hover:bg-secondary/90 active:scale-95 transition-transform">
                    <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="font-bold text-sm">بحث عن طرد</p>
                    <p className="text-xs opacity-80 mt-0.5">برقم التتبع</p>
                  </button>
                  <button onClick={() => setScreen('my_shipments')} className="bg-card border border-border rounded-xl p-4 text-right hover:bg-muted/40 active:scale-95 transition-transform">
                    <svg className="w-6 h-6 mb-2 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="font-bold text-sm">شحناتي</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{MY_SHIPMENTS.length} شحنة نشطة</p>
                  </button>
                  <button onClick={() => setScreen('earnings')} className="bg-card border border-border rounded-xl p-4 text-right hover:bg-muted/40 active:scale-95 transition-transform">
                    <svg className="w-6 h-6 mb-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-bold text-sm">الأرباح</p>
                    <p className="text-xs text-muted-foreground mt-0.5">2,100 ر.ي رصيد</p>
                  </button>
                </div>
              </div>

              {/* Recent */}
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">آخر الشحنات</p>
                  <button onClick={() => setScreen('my_shipments')} className="text-xs text-primary">الكل</button>
                </div>
                <div className="space-y-2">
                  {MY_SHIPMENTS.map(s => (
                    <div key={s.id} className="bg-card border border-border/60 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-xs text-primary font-medium">{s.trackingNumber}</span>
                        <Badge className={`${STATUS_COLORS[s.status]} text-xs`}>{STATUS_LABELS[s.status]}</Badge>
                      </div>
                      <p className="text-sm font-medium">{s.receiverName}</p>
                      <p className="text-xs text-muted-foreground">{s.governorate} — {s.address.slice(0, 30)}...</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== ADD SHIPMENT ===== */}
          {screen === 'add_shipment' && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => { setScreen('home'); setStep(1); }} className="text-muted-foreground">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="font-bold">إضافة شحنة جديدة</h2>
              </div>

              {/* Step Indicator */}
              <div className="flex items-center gap-1 mb-5">
                {[1, 2, 3].map(s => (
                  <div key={s} className="flex items-center gap-1 flex-1">
                    <div className={`flex-1 h-1.5 rounded-full ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
                    {s < 3 && <div className={`w-1.5 h-1.5 rounded-full ${s < step ? 'bg-primary' : 'bg-muted'}`} />}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {step === 1 ? 'بيانات المرسل والمستلم' : step === 2 ? 'تفاصيل الشحنة' : 'مراجعة وتأكيد'}
              </p>

              {step === 1 && (
                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-xl p-3 space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground">بيانات المرسل</p>
                    <div className="space-y-2">
                      <Label className="text-xs">اسم المرسل</Label>
                      <Input placeholder="الاسم الكامل" value={newShipment.senderName} onChange={e => setNewShipment(p => ({ ...p, senderName: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">رقم هاتف المرسل</Label>
                      <Input placeholder="07xxxxxxxx" value={newShipment.senderPhone} onChange={e => setNewShipment(p => ({ ...p, senderPhone: e.target.value }))} />
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-3 space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground">بيانات المستلم</p>
                    <div className="space-y-2">
                      <Label className="text-xs">اسم المستلم</Label>
                      <Input placeholder="الاسم الكامل" value={newShipment.receiverName} onChange={e => setNewShipment(p => ({ ...p, receiverName: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">رقم هاتف المستلم</Label>
                      <Input placeholder="07xxxxxxxx" value={newShipment.receiverPhone} onChange={e => setNewShipment(p => ({ ...p, receiverPhone: e.target.value }))} />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">المحافظة</Label>
                    <Select onValueChange={v => setNewShipment(p => ({ ...p, governorate: v }))}>
                      <SelectTrigger><SelectValue placeholder="اختر المحافظة" /></SelectTrigger>
                      <SelectContent>
                        {GOVERNORATES.map(g => <SelectItem key={g.id} value={g.name}>{g.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">العنوان التفصيلي</Label>
                    <Input placeholder="الحي / الشارع / المبنى" value={newShipment.address} onChange={e => setNewShipment(p => ({ ...p, address: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs">قيمة الشحنة (ر.ي)</Label>
                      <Input type="number" placeholder="0" value={newShipment.value} onChange={e => setNewShipment(p => ({ ...p, value: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">الوزن (كجم)</Label>
                      <Input type="number" placeholder="0.0" value={newShipment.weight} onChange={e => setNewShipment(p => ({ ...p, weight: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">نوع الخدمة</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['standard', 'express', 'international'] as const).map(type => (
                        <button
                          key={type}
                          onClick={() => setNewShipment(p => ({ ...p, serviceType: type }))}
                          className={`py-2 rounded-lg text-xs font-medium border-2 transition-colors ${
                            newShipment.serviceType === type
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border text-muted-foreground'
                          }`}
                        >
                          {SERVICE_LABELS[type]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-xl p-4 space-y-3 text-sm">
                    <p className="font-semibold">مراجعة البيانات</p>
                    <Separator />
                    {[
                      ['المرسل', newShipment.senderName || 'محمد أحمد (مثال)'],
                      ['هاتف المرسل', newShipment.senderPhone || '771234567'],
                      ['المستلم', newShipment.receiverName || 'فاطمة علي (مثال)'],
                      ['هاتف المستلم', newShipment.receiverPhone || '779876543'],
                      ['المحافظة', newShipment.governorate || 'صنعاء (مثال)'],
                      ['القيمة', `${newShipment.value || '500'} ر.ي`],
                      ['الوزن', `${newShipment.weight || '2.5'} كجم`],
                      ['الخدمة', SERVICE_LABELS[newShipment.serviceType as keyof typeof SERVICE_LABELS]],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between font-semibold text-primary">
                      <span>عمولتك (5%)</span>
                      <span>{((Number(newShipment.value) || 500) * 0.05).toFixed(0)} ر.ي</span>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-800">
                    سيتم إرسال إشعار واتساب تلقائي للمستلم عند تأكيل الشحنة
                  </div>
                </div>
              )}

              <Button className="w-full bg-primary text-primary-foreground mt-5" onClick={handleAddShipment}>
                {step < 3 ? 'التالي' : 'تأكيد وإصدار سند الشحن'}
              </Button>
              {step > 1 && (
                <Button variant="ghost" className="w-full mt-2 text-muted-foreground" onClick={() => setStep(s => s - 1)}>
                  رجوع
                </Button>
              )}
            </div>
          )}

          {/* ===== SHIPMENT SUCCESS ===== */}
          {screen === 'shipment_success' && (
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4 mt-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2">تم تسجيل الشحنة</h2>
              <p className="text-muted-foreground text-sm mb-6">تم إنشاء رقم التتبع وإصدار سند الشحن</p>
              <div className="bg-muted/30 rounded-xl p-4 w-full mb-6 text-right">
                <p className="text-xs text-muted-foreground mb-1">رقم الطرد</p>
                <p className="font-mono text-lg font-bold text-primary">YEM-ADN-0002459</p>
                <p className="text-xs text-muted-foreground mt-2">رابط التتبع: tracking.hodhudsaba.com/YEM-ADN-0002459</p>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full mb-4">
                <Button variant="outline" className="text-sm">
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  طباعة السند
                </Button>
                <Button className="bg-green-600 text-white text-sm">
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                  مشاركة واتساب
                </Button>
              </div>
              <Button variant="ghost" className="text-primary" onClick={() => setScreen('home')}>
                العودة للرئيسية
              </Button>
            </div>
          )}

          {/* ===== MY SHIPMENTS ===== */}
          {screen === 'my_shipments' && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setScreen('home')} className="text-muted-foreground">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="font-bold">شحناتي</h2>
                <Badge className="bg-primary/10 text-primary mr-auto">{SHIPMENTS.length} شحنة</Badge>
              </div>
              <div className="relative mb-3">
                <svg className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input placeholder="بحث في شحناتي..." className="pr-9 text-sm" />
              </div>
              <div className="space-y-2">
                {SHIPMENTS.map(s => (
                  <div key={s.id} className="bg-card border border-border/60 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs text-primary font-medium">{s.trackingNumber}</span>
                      <Badge className={`${STATUS_COLORS[s.status]} text-xs`}>{STATUS_LABELS[s.status]}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{s.receiverName}</p>
                        <p className="text-xs text-muted-foreground">{s.governorate}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">{s.value.toLocaleString()} ر.ي</p>
                        <p className="text-xs text-primary">{(s.value * 0.05).toFixed(0)} عمولة</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== SEARCH ===== */}
          {screen === 'search' && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => { setScreen('home'); setSearchResult(null); setSearchQuery(''); }} className="text-muted-foreground">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="font-bold">بحث عن طرد</h2>
              </div>
              <div className="space-y-3">
                <Input
                  placeholder="YEM-ADN-0002456"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="text-center font-mono"
                />
                <Button className="w-full bg-primary text-primary-foreground" onClick={handleSearch}>
                  بحث
                </Button>
              </div>
              {searchResult === 'not_found' && (
                <div className="mt-6 text-center p-6 bg-red-50 rounded-xl">
                  <p className="font-medium text-red-700">لم يتم العثور على هذا الرقم</p>
                  <p className="text-sm text-red-600 mt-1">تأكد من رقم الطرد وحاول مرة أخرى</p>
                </div>
              )}
              {searchResult && searchResult !== 'not_found' && (
                <div className="mt-5 bg-card border border-border rounded-xl overflow-hidden">
                  <div className="bg-secondary text-secondary-foreground p-3">
                    <p className="font-mono text-sm font-bold">{searchResult.trackingNumber}</p>
                    <Badge className={`${STATUS_COLORS[searchResult.status]} mt-1 text-xs`}>{STATUS_LABELS[searchResult.status]}</Badge>
                  </div>
                  <div className="p-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">المرسل</span><span className="font-medium">{searchResult.senderName}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">المستلم</span><span className="font-medium">{searchResult.receiverName}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">المحافظة</span><span className="font-medium">{searchResult.governorate}</span></div>
                    <Separator />
                    <div className="relative border-r-2 border-primary/30 pr-4 space-y-3 mt-3">
                      {searchResult.events.slice(-3).map((ev, i) => (
                        <div key={ev.id}>
                          <div className={`absolute -right-[19px] top-0 mt-${i * 10} w-3 h-3 rounded-full ${i === searchResult.events.length - 1 || i === 2 ? 'bg-primary' : 'bg-muted-foreground/40'} border-2 border-background`} />
                          <p className="text-xs font-medium">{STATUS_LABELS[ev.status]}</p>
                          <p className="text-xs text-muted-foreground">{ev.location}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-6">
                <p className="text-xs text-muted-foreground mb-3">جرب هذه الأرقام:</p>
                <div className="space-y-1.5">
                  {SHIPMENTS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => { setSearchQuery(s.trackingNumber); setSearchResult(s); }}
                      className="w-full text-right text-xs font-mono text-primary p-2 rounded-lg hover:bg-muted/50"
                    >
                      {s.trackingNumber}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== EARNINGS ===== */}
          {screen === 'earnings' && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setScreen('home')} className="text-muted-foreground">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="font-bold">الأرباح والمحفظة</h2>
              </div>

              {/* Wallet Card */}
              <div className="bg-secondary text-secondary-foreground rounded-2xl p-5 mb-5">
                <p className="text-xs opacity-70 mb-1">رصيد المحفظة</p>
                <p className="text-3xl font-bold text-primary">2,100 ر.ي</p>
                <div className="flex gap-3 mt-4">
                  <Button size="sm" className="bg-primary text-primary-foreground flex-1 text-xs h-8">طلب سحب</Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs h-8 border-white/30 text-white hover:bg-white/10">كشف حساب</Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-card border border-border/60 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold">87</p>
                  <p className="text-xs text-muted-foreground">شحنة كلي</p>
                </div>
                <div className="bg-card border border-border/60 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-primary">4,350</p>
                  <p className="text-xs text-muted-foreground">عمولة الشهر</p>
                </div>
                <div className="bg-card border border-border/60 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold">5%</p>
                  <p className="text-xs text-muted-foreground">نسبة العمولة</p>
                </div>
              </div>

              {/* Transactions */}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">آخر المعاملات</p>
              <div className="space-y-2">
                {SHIPMENTS.map(s => (
                  <div key={s.id} className="flex items-center justify-between bg-card border border-border/60 rounded-xl p-3">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">{s.trackingNumber}</p>
                      <p className="text-sm">{s.receiverName}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-primary">+{(s.value * 0.05).toFixed(0)} ر.ي</p>
                      <Badge className={`${STATUS_COLORS[s.status]} text-xs`}>{STATUS_LABELS[s.status]}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* ===== NOTIFICATIONS ===== */}
          {screen === 'notifications' && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setScreen('home')} className="text-muted-foreground">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="font-bold">الإشعارات</h2>
                <Badge className="bg-primary/10 text-primary mr-auto text-xs">3 جديدة</Badge>
              </div>
              <div className="space-y-2">
                {[
                  { title: 'تم تسليم شحنة', body: 'YEM-ADN-0002457 تم تسليمها بنجاح في تعز', time: 'منذ 10 دقائق', unread: true, icon: 'check', color: 'bg-green-100 text-green-600' },
                  { title: 'شحنة مرفوضة', body: 'YEM-ADN-0002458 رُفضت في الحديدة — المستلم غير موجود', time: 'منذ ساعة', unread: true, icon: 'x', color: 'bg-red-100 text-red-600' },
                  { title: 'تم إضافة عمولة', body: 'أُضيف 25 ر.ي لمحفظتك عن الشحنة YEM-ADN-0002456', time: 'منذ 3 ساعات', unread: true, icon: 'money', color: 'bg-primary/10 text-primary' },
                  { title: 'تحديث النظام', body: 'تم تحديث أسعار الشحن السريع. راجع لوحة الأسعار', time: 'أمس', unread: false, icon: 'info', color: 'bg-muted text-muted-foreground' },
                  { title: 'تم استلام شحنة', body: 'YEM-SNA-0001893 وصلت فرع حضرموت', time: 'أمس', unread: false, icon: 'check', color: 'bg-blue-100 text-blue-600' },
                ].map((notif, i) => (
                  <div key={i} className={`flex gap-3 p-3 rounded-xl border ${notif.unread ? 'bg-primary/5 border-primary/20' : 'bg-card border-border/60'}`}>
                    <div className={`w-9 h-9 rounded-full ${notif.color} flex items-center justify-center shrink-0 mt-0.5`}>
                      {notif.icon === 'check' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                      {notif.icon === 'x' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
                      {notif.icon === 'money' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                      {notif.icon === 'info' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-semibold ${notif.unread ? 'text-foreground' : 'text-muted-foreground'}`}>{notif.title}</p>
                        {notif.unread && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notif.body}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== PROFILE ===== */}
          {screen === 'profile' && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setScreen('home')} className="text-muted-foreground">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="font-bold">حسابي</h2>
              </div>

              {/* Profile Card */}
              <div className="flex flex-col items-center text-center mb-6 pt-2">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-3xl font-bold text-secondary-foreground mb-3">
                  و
                </div>
                <h3 className="text-lg font-bold">وليد الغداري</h3>
                <p className="text-sm text-muted-foreground">وكيل — محافظة عدن</p>
                <Badge className="bg-green-100 text-green-800 mt-2 text-xs">نشط</Badge>
              </div>

              {/* Info */}
              <div className="space-y-2 mb-5">
                {[
                  { label: 'رقم الهاتف', value: '771111111' },
                  { label: 'المحافظة', value: 'عدن' },
                  { label: 'نسبة العمولة', value: '5%' },
                  { label: 'تاريخ الانضمام', value: '15 مارس 2023' },
                  { label: 'إجمالي الشحنات', value: '87 شحنة' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between bg-muted/30 rounded-xl px-4 py-3">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <button className="w-full text-right px-4 py-3 rounded-xl bg-muted/30 text-sm font-medium hover:bg-muted/50 transition-colors">
                  تغيير كلمة المرور
                </button>
                <button className="w-full text-right px-4 py-3 rounded-xl bg-muted/30 text-sm font-medium hover:bg-muted/50 transition-colors">
                  إعدادات الإشعارات
                </button>
                <button className="w-full text-right px-4 py-3 rounded-xl bg-red-50 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors">
                  تسجيل الخروج
                </button>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Bottom Navigation */}
        {screen !== 'shipment_success' && (
          <div className="border-t border-border bg-card flex sticky bottom-0">
            {NAV_ITEMS.map(item => (
              <button
                key={item.key}
                onClick={() => setScreen(item.key as AgentScreen)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors ${
                  screen === item.key ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.icon(screen === item.key)}
                <span className={`text-[10px] font-medium ${screen === item.key ? 'text-primary' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
