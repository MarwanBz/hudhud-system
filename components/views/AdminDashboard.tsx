'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  SHIPMENTS, AGENTS, DRIVERS, GOVERNORATES, STATS,
  STATUS_LABELS, STATUS_COLORS, SERVICE_LABELS,
  type Shipment, type ShipmentStatus,
} from '@/lib/data';

type AdminTab = 'overview' | 'shipments' | 'governorates' | 'agents' | 'drivers' | 'financials' | 'reports' | 'settings';

interface AdminDashboardProps {
  onBack: () => void;
}

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <Card className="border-border/60">
      <CardContent className="pt-5 pb-5">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className={`text-2xl font-bold ${color ?? 'text-foreground'}`}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function ShipmentDetailDialog({ shipment }: { shipment: Shipment }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-primary text-xs h-7 px-2">عرض</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh]" dir="rtl">
        <DialogHeader>
          <DialogTitle>تفاصيل الشحنة — {shipment.trackingNumber}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pl-1">
          <div className="space-y-5 p-1">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div><span className="text-muted-foreground">المرسل: </span><span className="font-medium">{shipment.senderName}</span></div>
                <div><span className="text-muted-foreground">هاتف المرسل: </span><span className="font-medium">{shipment.senderPhone}</span></div>
                <div><span className="text-muted-foreground">المستلم: </span><span className="font-medium">{shipment.receiverName}</span></div>
                <div><span className="text-muted-foreground">هاتف المستلم: </span><span className="font-medium">{shipment.receiverPhone}</span></div>
              </div>
              <div className="space-y-3">
                <div><span className="text-muted-foreground">المحافظة: </span><span className="font-medium">{shipment.governorate}</span></div>
                <div><span className="text-muted-foreground">الوكيل: </span><span className="font-medium">{shipment.agentName}</span></div>
                <div><span className="text-muted-foreground">القيمة: </span><span className="font-medium">{shipment.value.toLocaleString()} ر.ي</span></div>
                <div><span className="text-muted-foreground">الوزن: </span><span className="font-medium">{shipment.weight} كجم</span></div>
              </div>
            </div>
            <div className="text-sm"><span className="text-muted-foreground">العنوان: </span><span className="font-medium">{shipment.address}</span></div>
            {shipment.driverName && (
              <div className="text-sm"><span className="text-muted-foreground">السائق: </span><span className="font-medium">{shipment.driverName}</span></div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">الحالة: </span>
              <Badge className={STATUS_COLORS[shipment.status]}>{STATUS_LABELS[shipment.status]}</Badge>
            </div>
            <div className="bg-muted/40 rounded-lg p-3 text-sm">
              <p className="font-medium text-xs text-muted-foreground mb-1">رابط التتبع</p>
              <p className="font-mono text-primary text-xs">tracking.hodhudsaba.com/{shipment.trackingNumber}</p>
            </div>
            <Separator />
            <div>
              <p className="font-semibold mb-4 text-sm">مسار الشحنة</p>
              <div className="relative border-r-2 border-primary/30 pr-5 space-y-5">
                {shipment.events.map((ev, i) => (
                  <div key={ev.id} className="relative">
                    <div className={`absolute -right-[25px] top-1 w-3.5 h-3.5 rounded-full border-2 border-background ${i === shipment.events.length - 1 ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
                    <p className={`text-sm font-medium ${i === shipment.events.length - 1 ? 'text-primary' : 'text-foreground'}`}>
                      {STATUS_LABELS[ev.status as ShipmentStatus]}
                    </p>
                    <p className="text-xs text-muted-foreground">{ev.location}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{new Date(ev.timestamp).toLocaleString('ar-YE')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShipments = SHIPMENTS.filter(s =>
    s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.senderName.includes(searchQuery) ||
    s.receiverName.includes(searchQuery)
  );

  const TABS: [AdminTab, string][] = [
    ['overview', 'الرئيسية'],
    ['shipments', 'الشحنات'],
    ['governorates', 'المحافظات'],
    ['agents', 'الوكلاء'],
    ['drivers', 'السائقين'],
    ['financials', 'المالية'],
    ['reports', 'التقارير'],
    ['settings', 'الإعدادات'],
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Top Bar */}
      <header className="bg-secondary text-secondary-foreground sticky top-0 z-50 shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-IF8pnxKBjP4iTsBkjBMv7XBydLcakE.png"
              alt="هدهد سبأ"
              className="h-8 w-auto brightness-0 invert"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-tight">لوحة التحكم الإدارية</p>
              <p className="text-xs text-secondary-foreground/60">هدهد سبأ — المدير العام</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-green-500/20 text-green-300 rounded-full px-3 py-1 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              النظام يعمل
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">م</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-t border-white/10 scrollbar-none">
          {TABS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`shrink-0 px-4 py-2.5 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
                activeTab === key
                  ? 'border-primary text-white bg-white/5'
                  : 'border-transparent text-secondary-foreground/60 hover:text-secondary-foreground/90'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 space-y-5 max-w-screen-xl mx-auto w-full">

        {/* ====== OVERVIEW ====== */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-foreground">نظرة عامة على النظام</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="إجمالي الشحنات" value={STATS.totalShipments.toLocaleString()} sub="منذ التأسيس" />
              <StatCard label="تم التسليم اليوم" value={STATS.deliveredToday} color="text-green-600" sub="↑ 12% عن الأمس" />
              <StatCard label="في الطريق" value={STATS.inTransit} color="text-yellow-600" sub="جارية الآن" />
              <StatCard label="بانتظار الاستلام" value={STATS.pendingPickup} color="text-blue-600" sub="في الفروع" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="إيرادات الشهر" value={`${STATS.monthlyRevenue.toLocaleString()} ر.ي`} color="text-primary" />
              <StatCard label="المحافظات" value={STATS.governoratesCount} sub="فرع نشط" />
              <StatCard label="الوكلاء" value={STATS.agentsCount} sub="في كل المحافظات" />
              <StatCard label="السائقون" value={STATS.driversCount} sub="موزعون على الفروع" />
            </div>

            {/* Governorates Performance */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">أداء المحافظات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {GOVERNORATES.map(gov => (
                  <div key={gov.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{gov.name}</span>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span>{gov.agentsCount} وكيل · {gov.driversCount} سائق</span>
                        <span className="font-medium text-foreground">{gov.shipmentCount} شحنة</span>
                        <span className="text-primary font-semibold">{gov.revenue.toLocaleString()} ر.ي</span>
                      </div>
                    </div>
                    <Progress value={(gov.shipmentCount / 512) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Shipments */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">آخر الشحنات</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => setActiveTab('shipments')}>
                    عرض الكل
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم الطرد</TableHead>
                      <TableHead className="text-right">المرسل</TableHead>
                      <TableHead className="text-right">المستلم</TableHead>
                      <TableHead className="text-right">المحافظة</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SHIPMENTS.map(s => (
                      <TableRow key={s.id}>
                        <TableCell className="font-mono text-xs text-primary">{s.trackingNumber}</TableCell>
                        <TableCell className="text-sm">{s.senderName}</TableCell>
                        <TableCell className="text-sm">{s.receiverName}</TableCell>
                        <TableCell className="text-sm">{s.governorate}</TableCell>
                        <TableCell>
                          <Badge className={`${STATUS_COLORS[s.status]} text-xs`}>{STATUS_LABELS[s.status]}</Badge>
                        </TableCell>
                        <TableCell><ShipmentDetailDialog shipment={s} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ====== SHIPMENTS ====== */}
        {activeTab === 'shipments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">إدارة الشحنات</h2>
              <Button size="sm" className="bg-primary text-primary-foreground">
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                شحنة جديدة
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <svg className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input placeholder="بحث برقم الطرد أو الاسم..." className="pr-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <Select>
                <SelectTrigger className="w-40"><SelectValue placeholder="تصفية الحالة" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  {Object.entries(STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-36"><SelectValue placeholder="المحافظة" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {GOVERNORATES.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Status filter chips */}
            <div className="flex gap-2 flex-wrap">
              {Object.entries(STATUS_LABELS).map(([key, label]) => {
                const count = SHIPMENTS.filter(s => s.status === key).length;
                if (!count) return null;
                return (
                  <Badge key={key} className={`${STATUS_COLORS[key as ShipmentStatus]} cursor-pointer text-xs`}>
                    {label} ({count})
                  </Badge>
                );
              })}
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم الطرد</TableHead>
                      <TableHead className="text-right">المرسل</TableHead>
                      <TableHead className="text-right">المستلم</TableHead>
                      <TableHead className="text-right">المحافظة</TableHead>
                      <TableHead className="text-right">الخدمة</TableHead>
                      <TableHead className="text-right">القيمة</TableHead>
                      <TableHead className="text-right">الوكيل</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShipments.map(s => (
                      <TableRow key={s.id}>
                        <TableCell className="font-mono text-xs text-primary">{s.trackingNumber}</TableCell>
                        <TableCell className="text-sm">{s.senderName}</TableCell>
                        <TableCell className="text-sm">{s.receiverName}</TableCell>
                        <TableCell className="text-sm">{s.governorate}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{SERVICE_LABELS[s.serviceType]}</Badge></TableCell>
                        <TableCell className="text-sm">{s.value.toLocaleString()} ر.ي</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{s.agentName}</TableCell>
                        <TableCell><Badge className={`${STATUS_COLORS[s.status]} text-xs`}>{STATUS_LABELS[s.status]}</Badge></TableCell>
                        <TableCell><ShipmentDetailDialog shipment={s} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ====== GOVERNORATES ====== */}
        {activeTab === 'governorates' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">إدارة المحافظات</h2>
              <Button size="sm" className="bg-primary text-primary-foreground">إضافة محافظة</Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="إجمالي المحافظات" value={GOVERNORATES.length} />
              <StatCard label="إجمالي الشحنات" value={GOVERNORATES.reduce((a, b) => a + b.shipmentCount, 0).toLocaleString()} />
              <StatCard label="إجمالي الوكلاء" value={GOVERNORATES.reduce((a, b) => a + b.agentsCount, 0)} />
              <StatCard label="إجمالي الإيرادات" value={`${GOVERNORATES.reduce((a, b) => a + b.revenue, 0).toLocaleString()} ر.ي`} color="text-primary" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {GOVERNORATES.map(gov => (
                <Card key={gov.id} className="border-border/60 hover:border-primary/40 transition-colors">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-secondary">{gov.name}</h3>
                        <p className="text-sm text-muted-foreground">مدير: {gov.managerName}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-xl font-bold text-primary">{gov.revenue.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">ر.ي</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center mb-4">
                      <div className="bg-muted/50 rounded-lg p-2">
                        <p className="text-lg font-bold">{gov.shipmentCount}</p>
                        <p className="text-xs text-muted-foreground">شحنة</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-2">
                        <p className="text-lg font-bold">{gov.agentsCount}</p>
                        <p className="text-xs text-muted-foreground">وكيل</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-2">
                        <p className="text-lg font-bold">{gov.driversCount}</p>
                        <p className="text-xs text-muted-foreground">سائق</p>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-start gap-1.5">
                        <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {gov.branchAddress}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {gov.branchPhone}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 text-xs h-7">الوكلاء</Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs h-7">السائقون</Button>
                      <Button size="sm" className="bg-secondary text-secondary-foreground text-xs h-7">التقرير</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ====== AGENTS ====== */}
        {activeTab === 'agents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">إدارة الوكلاء</h2>
              <Button size="sm" className="bg-primary text-primary-foreground">إضافة وكيل</Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="إجمالي الوكلاء" value={AGENTS.length} />
              <StatCard label="وكلاء نشطون" value={AGENTS.filter(a => a.status === 'active').length} color="text-green-600" />
              <StatCard label="إجمالي الشحنات" value={AGENTS.reduce((a, b) => a + b.shipmentCount, 0)} />
              <StatCard label="إجمالي العمولات" value={`${AGENTS.reduce((a, b) => a + b.earnings, 0).toLocaleString()} ر.ي`} color="text-primary" />
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الوكيل</TableHead>
                      <TableHead className="text-right">الهاتف</TableHead>
                      <TableHead className="text-right">المحافظة</TableHead>
                      <TableHead className="text-right">الشحنات</TableHead>
                      <TableHead className="text-right">العمولات</TableHead>
                      <TableHead className="text-right">رصيد المحفظة</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {AGENTS.map(agent => (
                      <TableRow key={agent.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-secondary/10 flex items-center justify-center text-xs font-bold text-secondary shrink-0">
                              {agent.name[0]}
                            </div>
                            <span className="font-medium text-sm">{agent.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{agent.phone}</TableCell>
                        <TableCell className="text-sm">{agent.governorate}</TableCell>
                        <TableCell className="text-sm font-medium">{agent.shipmentCount}</TableCell>
                        <TableCell className="text-sm font-medium text-primary">{agent.earnings.toLocaleString()} ر.ي</TableCell>
                        <TableCell className="text-sm">{agent.walletBalance.toLocaleString()} ر.ي</TableCell>
                        <TableCell>
                          <Badge className={agent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {agent.status === 'active' ? 'نشط' : 'موقوف'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-xs text-primary h-7 px-2">تفاصيل</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ====== DRIVERS ====== */}
        {activeTab === 'drivers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">إدارة السائقين</h2>
              <Button size="sm" className="bg-primary text-primary-foreground">إضافة سائق</Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="إجمالي السائقين" value={DRIVERS.length} />
              <StatCard label="في مهمة الآن" value={DRIVERS.filter(d => d.status === 'on_route').length} color="text-orange-600" />
              <StatCard label="نشطون متاحون" value={DRIVERS.filter(d => d.status === 'active').length} color="text-green-600" />
              <StatCard label="تسليمات اليوم" value={DRIVERS.reduce((a, b) => a + b.deliveredToday, 0)} color="text-primary" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {DRIVERS.map(driver => (
                <Card key={driver.id} className="border-border/60">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center font-bold text-secondary">
                          {driver.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{driver.name}</p>
                          <p className="text-xs text-muted-foreground">{driver.phone}</p>
                        </div>
                      </div>
                      <Badge className={
                        driver.status === 'on_route' ? 'bg-orange-100 text-orange-800' :
                        driver.status === 'active' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {driver.status === 'on_route' ? 'في مهمة' : driver.status === 'active' ? 'متاح' : 'غير نشط'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                      <div className="bg-muted/50 rounded p-2">
                        <p className="font-bold text-sm">{driver.assignedShipments}</p>
                        <p className="text-muted-foreground">مسندة</p>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <p className="font-bold text-sm text-green-600">{driver.deliveredToday}</p>
                        <p className="text-muted-foreground">سُلمت</p>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <p className="font-bold text-sm text-primary">{driver.rating}</p>
                        <p className="text-muted-foreground">تقييم</p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>المحافظة: {driver.governorate} · المركبة: {driver.vehicle}</p>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1 text-xs h-7">الشحنات المسندة</Button>
                      <Button size="sm" className="bg-secondary text-secondary-foreground text-xs h-7 flex-1">إسناد شحنة</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ====== FINANCIALS ====== */}
        {activeTab === 'financials' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">التقارير المالية</h2>
              <Button variant="outline" size="sm" className="text-xs">
                <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                تصدير Excel
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="إيرادات اليوم" value="12,450 ر.ي" color="text-green-600" sub="↑ 8% عن أمس" />
              <StatCard label="إيرادات الأسبوع" value="87,200 ر.ي" color="text-primary" />
              <StatCard label="إيرادات الشهر" value={`${STATS.monthlyRevenue.toLocaleString()} ر.ي`} color="text-secondary" />
              <StatCard label="الإجمالي" value={`${STATS.totalRevenue.toLocaleString()} ر.ي`} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">عمولات الوكلاء</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {AGENTS.map(agent => (
                    <div key={agent.id} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{agent.name}</span>
                        <div>
                          <span className="font-medium text-primary">{agent.earnings.toLocaleString()} ر.ي</span>
                          <span className="text-xs text-muted-foreground mr-1">({agent.commissionRate}%)</span>
                        </div>
                      </div>
                      <Progress value={(agent.earnings / 5600) * 100} className="h-1.5" />
                    </div>
                  ))}
                  <Separator />
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span>الإجمالي</span>
                    <span className="text-primary">{AGENTS.reduce((a, b) => a + b.earnings, 0).toLocaleString()} ر.ي</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">إيرادات المحافظات</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {GOVERNORATES.map(gov => (
                    <div key={gov.id} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{gov.name}</span>
                        <span className="font-medium">{gov.revenue.toLocaleString()} ر.ي</span>
                      </div>
                      <Progress value={(gov.revenue / 128000) * 100} className="h-1.5" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">تفاصيل الشحنات المالية</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم الطرد</TableHead>
                      <TableHead className="text-right">الوكيل</TableHead>
                      <TableHead className="text-right">الخدمة</TableHead>
                      <TableHead className="text-right">القيمة</TableHead>
                      <TableHead className="text-right">العمولة 5%</TableHead>
                      <TableHead className="text-right">صافي الشركة</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SHIPMENTS.map(s => (
                      <TableRow key={s.id}>
                        <TableCell className="font-mono text-xs">{s.trackingNumber}</TableCell>
                        <TableCell className="text-sm">{s.agentName}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{SERVICE_LABELS[s.serviceType]}</Badge></TableCell>
                        <TableCell className="text-sm font-medium">{s.value.toLocaleString()} ر.ي</TableCell>
                        <TableCell className="text-sm text-primary">{(s.value * 0.05).toFixed(0)} ر.ي</TableCell>
                        <TableCell className="text-sm font-medium text-green-700">{(s.value * 0.95).toFixed(0)} ر.ي</TableCell>
                        <TableCell><Badge className={`${STATUS_COLORS[s.status]} text-xs`}>{STATUS_LABELS[s.status]}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ====== REPORTS ====== */}
        {activeTab === 'reports' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">التقارير</h2>
              <Button variant="outline" size="sm" className="text-xs gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                تصدير PDF
              </Button>
            </div>

            {/* KPI Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="معدل التسليم" value="91.4%" color="text-green-600" sub="من إجمالي الشحنات" />
              <StatCard label="معدل الرفض" value="0.8%" color="text-red-600" sub="أقل من المعيار" />
              <StatCard label="متوسط وقت التسليم" value="2.3 يوم" color="text-primary" sub="بين المحافظات" />
              <StatCard label="رضا العملاء" value="4.7 / 5" color="text-yellow-600" sub="بناءً على 234 تقييم" />
            </div>

            {/* Daily Shipments Chart Placeholder */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">الشحنات اليومية — آخر 14 يوم</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-1.5 h-32">
                  {[42, 58, 61, 49, 73, 85, 91, 68, 77, 83, 62, 54, 87, 94].map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-t-sm transition-all ${i === 13 ? 'bg-primary' : 'bg-primary/30'}`}
                        style={{ height: `${(v / 94) * 100}%` }}
                      />
                      {i % 3 === 0 && <span className="text-[9px] text-muted-foreground">{i + 1}</span>}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                  <span>يناير 3</span>
                  <span className="text-primary font-medium">أعلى يوم: 94 شحنة</span>
                  <span>يناير 16</span>
                </div>
              </CardContent>
            </Card>

            {/* Two-column */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status breakdown */}
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">توزيع الشحنات حسب الحالة</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: 'تم التسليم', count: 1312, pct: 91, color: 'bg-green-500' },
                    { label: 'في الطريق', count: 234, pct: 16, color: 'bg-yellow-500' },
                    { label: 'بانتظار الاستلام', count: 56, pct: 4, color: 'bg-blue-500' },
                    { label: 'مرفوض', count: 12, pct: 1, color: 'bg-red-500' },
                    { label: 'مؤجل', count: 8, pct: 0.5, color: 'bg-gray-400' },
                  ].map(item => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="font-medium">{item.count.toLocaleString()} ({item.pct}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Governorate comparison */}
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">مقارنة المحافظات</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {GOVERNORATES.map((gov, i) => (
                    <div key={gov.id} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                          {gov.name}
                        </span>
                        <span className="font-medium">{gov.shipmentCount} شحنة</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${i === 0 ? 'bg-primary' : 'bg-secondary/60'}`}
                          style={{ width: `${(gov.shipmentCount / 512) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Agent performance table */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">أداء الوكلاء — هذا الشهر</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">#</TableHead>
                      <TableHead className="text-right">الوكيل</TableHead>
                      <TableHead className="text-right">المحافظة</TableHead>
                      <TableHead className="text-right">الشحنات</TableHead>
                      <TableHead className="text-right">العمولات</TableHead>
                      <TableHead className="text-right">معدل الإنجاز</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {AGENTS.map((agent, idx) => (
                      <TableRow key={agent.id}>
                        <TableCell className="text-sm text-muted-foreground">{idx + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center text-xs font-bold text-secondary shrink-0">
                              {agent.name[0]}
                            </div>
                            <span className="text-sm font-medium">{agent.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{agent.governorate}</TableCell>
                        <TableCell className="text-sm font-medium">{agent.shipmentCount}</TableCell>
                        <TableCell className="text-sm text-primary font-medium">{agent.earnings.toLocaleString()} ر.ي</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${(agent.shipmentCount / 112) * 100}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground w-8">{Math.round((agent.shipmentCount / 112) * 100)}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ====== SETTINGS ====== */}
        {activeTab === 'settings' && (
          <div className="space-y-5 max-w-2xl">
            <h2 className="text-xl font-bold">إعدادات النظام</h2>
            <Tabs defaultValue="pricing">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="pricing">الأسعار</TabsTrigger>
                <TabsTrigger value="whatsapp">واتساب API</TabsTrigger>
                <TabsTrigger value="users">المستخدمون</TabsTrigger>
              </TabsList>

              <TabsContent value="pricing" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">أسعار الشحن ونسب العمولة</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: 'شحن عادي داخل المحافظة (ر.ي)', value: '500' },
                      { label: 'شحن عادي بين المحافظات (ر.ي)', value: '1000' },
                      { label: 'شحن سريع داخل المحافظة (ر.ي)', value: '800' },
                      { label: 'شحن سريع بين المحافظات (ر.ي)', value: '1500' },
                      { label: 'شحن دولي — رسوم أساسية (ر.ي)', value: '5000' },
                      { label: 'نسبة عمولة الوكيل (%)', value: '5' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between gap-4">
                        <label className="text-sm flex-1">{item.label}</label>
                        <Input className="w-28 text-left" defaultValue={item.value} />
                      </div>
                    ))}
                    <Button className="bg-primary text-primary-foreground w-full">حفظ الأسعار</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="whatsapp" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">إعدادات WhatsApp Business API</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">رقم الحساب التجاري</label>
                      <Input placeholder="+967xxxxxxxxx" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">رمز الوصول (Access Token)</label>
                      <Input placeholder="EAAxxxxx..." type="password" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">معرف قالب الرسالة</label>
                      <Input placeholder="shipment_update_ar" />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">تفعيل الإشعارات التلقائية</p>
                      {[
                        'عند استلام الطرد من الوكيل',
                        'عند وصول الطرد للفرع',
                        'عند خروج الطرد مع السائق',
                        'عند التسليم الناجح',
                        'عند رفض الطرد',
                      ].map(item => (
                        <label key={item} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" defaultChecked className="accent-primary" />
                          {item}
                        </label>
                      ))}
                    </div>
                    <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4 text-xs text-muted-foreground">
                      <p className="font-medium text-secondary mb-1">مثال على رسالة التسليم:</p>
                      <p className="leading-relaxed">السلام عليكم، طردكم رقم YEM-ADN-0002456 خرج للتوصيل. السائق: أحمد — 77xxxxxxx. رابط التتبع: tracking.hodhudsaba.com/YEM-ADN-0002456</p>
                    </div>
                    <Button className="bg-primary text-primary-foreground w-full">حفظ الإعدادات</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">مستخدمو النظام</CardTitle>
                      <Button size="sm" className="bg-primary text-primary-foreground text-xs h-7">مستخدم جديد</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: 'المدير العام', role: 'مدير عام', gov: 'جميع المحافظات', active: true },
                      ...GOVERNORATES.map(g => ({ name: g.managerName, role: 'مدير محافظة', gov: g.name, active: true })),
                    ].map((user, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-secondary/10 flex items-center justify-center text-xs font-bold text-secondary shrink-0">
                            {user.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.gov}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{user.role}</Badge>
                          <Button variant="ghost" size="sm" className="text-xs h-6 px-2">تعديل</Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
}
