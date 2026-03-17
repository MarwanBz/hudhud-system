'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  SHIPMENTS, AGENTS, DRIVERS, GOVERNORATES,
  STATUS_LABELS, STATUS_COLORS, SERVICE_LABELS,
  type Shipment,
} from '@/lib/data';

interface GovernorateManagerProps {
  onBack: () => void;
}

const MY_GOV = GOVERNORATES[0]; // عدن
const MY_AGENTS = AGENTS.filter(a => a.governorateId === MY_GOV.id);
const MY_DRIVERS = DRIVERS.filter(d => d.governorateId === MY_GOV.id);
const MY_SHIPMENTS = SHIPMENTS.filter(s => s.branchId === MY_GOV.id || s.agentId === MY_AGENTS[0]?.id || s.agentId === MY_AGENTS[1]?.id);

function AssignDriverDialog({ shipment }: { shipment: Shipment }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-primary text-primary-foreground text-xs h-7">إسناد سائق</Button>
      </DialogTrigger>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>إسناد سائق — {shipment.trackingNumber}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">اختر السائق المتاح لتسليم هذه الشحنة</p>
          <div className="space-y-2">
            {MY_DRIVERS.map(driver => (
              <label key={driver.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 cursor-pointer">
                <div className="flex items-center gap-2">
                  <input type="radio" name="driver" value={driver.id} className="accent-primary" />
                  <div>
                    <p className="text-sm font-medium">{driver.name}</p>
                    <p className="text-xs text-muted-foreground">{driver.phone} · {driver.vehicle}</p>
                  </div>
                </div>
                <Badge className={
                  driver.status === 'on_route' ? 'bg-orange-100 text-orange-800' :
                  driver.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }>
                  {driver.status === 'on_route' ? 'في مهمة' : 'متاح'}
                </Badge>
              </label>
            ))}
          </div>
          <Button className="bg-primary text-primary-foreground w-full">تأكيد الإسناد وإرسال إشعار واتساب</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function GovernorateManager({ onBack }: GovernorateManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = MY_SHIPMENTS.filter(s =>
    s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.receiverName.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Header */}
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
            <div>
              <p className="text-sm font-bold leading-tight">لوحة مدير المحافظة</p>
              <p className="text-xs text-secondary-foreground/60">فرع {MY_GOV.name} — {MY_GOV.managerName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-primary/20 text-primary-foreground rounded-full px-3 py-1 text-xs font-medium">
              محافظة {MY_GOV.name}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 max-w-screen-xl mx-auto w-full">
        <Tabs defaultValue="overview">
          <TabsList className="w-full grid grid-cols-4 mb-5">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="shipments">الشحنات</TabsTrigger>
            <TabsTrigger value="agents">الوكلاء</TabsTrigger>
            <TabsTrigger value="drivers">السائقون</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="border-border/60">
                <CardContent className="pt-5">
                  <p className="text-sm text-muted-foreground">إجمالي الشحنات</p>
                  <p className="text-2xl font-bold">{MY_GOV.shipmentCount}</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="pt-5">
                  <p className="text-sm text-muted-foreground">في التوصيل الآن</p>
                  <p className="text-2xl font-bold text-orange-600">{MY_DRIVERS.filter(d => d.status === 'on_route').length * 6}</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="pt-5">
                  <p className="text-sm text-muted-foreground">الوكلاء</p>
                  <p className="text-2xl font-bold">{MY_GOV.agentsCount}</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="pt-5">
                  <p className="text-sm text-muted-foreground">إيرادات الفرع</p>
                  <p className="text-2xl font-bold text-primary">{MY_GOV.revenue.toLocaleString()} ر.ي</p>
                </CardContent>
              </Card>
            </div>

            {/* Branch Info */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">معلومات الفرع</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">عنوان الفرع</p>
                    <p className="font-medium">{MY_GOV.branchAddress}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">هاتف الفرع</p>
                    <p className="font-medium">{MY_GOV.branchPhone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">مدير الفرع</p>
                    <p className="font-medium">{MY_GOV.managerName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">المحافظة</p>
                    <p className="font-medium">{MY_GOV.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Drivers Status */}
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">حالة السائقين الآن</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {MY_DRIVERS.map(driver => (
                  <div key={driver.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        driver.status === 'on_route' ? 'bg-orange-500' :
                        driver.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <div>
                        <p className="font-medium text-sm">{driver.name}</p>
                        <p className="text-xs text-muted-foreground">{driver.assignedShipments} شحنة مسندة · {driver.deliveredToday} سُلمت اليوم</p>
                      </div>
                    </div>
                    <Badge className={
                      driver.status === 'on_route' ? 'bg-orange-100 text-orange-800' :
                      driver.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }>
                      {driver.status === 'on_route' ? 'في مهمة' : driver.status === 'active' ? 'متاح' : 'غير نشط'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Pending for assignment */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">شحنات تنتظر إسناد سائق</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {MY_SHIPMENTS.filter(s => s.status === 'at_destination_branch' && !s.driverId).map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-border/60">
                    <div>
                      <p className="font-mono text-xs text-primary">{s.trackingNumber}</p>
                      <p className="text-sm font-medium">{s.receiverName}</p>
                      <p className="text-xs text-muted-foreground">{s.address}</p>
                    </div>
                    <AssignDriverDialog shipment={s} />
                  </div>
                ))}
                {MY_SHIPMENTS.filter(s => s.status === 'at_destination_branch' && !s.driverId).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">لا توجد شحنات تنتظر الإسناد</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipments Tab */}
          <TabsContent value="shipments" className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <svg className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input placeholder="بحث..." className="pr-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <Select>
                <SelectTrigger className="w-40"><SelectValue placeholder="الحالة" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  {Object.entries(STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم الطرد</TableHead>
                      <TableHead className="text-right">المرسل</TableHead>
                      <TableHead className="text-right">المستلم</TableHead>
                      <TableHead className="text-right">الخدمة</TableHead>
                      <TableHead className="text-right">الوكيل</TableHead>
                      <TableHead className="text-right">السائق</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(s => (
                      <TableRow key={s.id}>
                        <TableCell className="font-mono text-xs text-primary">{s.trackingNumber}</TableCell>
                        <TableCell className="text-sm">{s.senderName}</TableCell>
                        <TableCell className="text-sm">{s.receiverName}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{SERVICE_LABELS[s.serviceType]}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{s.agentName}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{s.driverName ?? '—'}</TableCell>
                        <TableCell><Badge className={`${STATUS_COLORS[s.status]} text-xs`}>{STATUS_LABELS[s.status]}</Badge></TableCell>
                        <TableCell>
                          {!s.driverId && s.status === 'at_destination_branch' ? (
                            <AssignDriverDialog shipment={s} />
                          ) : (
                            <Button variant="ghost" size="sm" className="text-xs text-primary h-7 px-2">عرض</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{MY_AGENTS.length} وكيل في محافظة {MY_GOV.name}</p>
              <Button size="sm" className="bg-primary text-primary-foreground text-xs">إضافة وكيل</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MY_AGENTS.map(agent => (
                <Card key={agent.id} className="border-border/60">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {agent.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold">{agent.name}</p>
                          <p className="text-xs text-muted-foreground">{agent.phone}</p>
                        </div>
                      </div>
                      <Badge className={agent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {agent.status === 'active' ? 'نشط' : 'موقوف'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-muted/50 rounded p-2">
                        <p className="font-bold text-base">{agent.shipmentCount}</p>
                        <p className="text-muted-foreground">شحنة</p>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <p className="font-bold text-base text-primary">{agent.earnings.toLocaleString()}</p>
                        <p className="text-muted-foreground">عمولة</p>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <p className="font-bold text-base">{agent.walletBalance.toLocaleString()}</p>
                        <p className="text-muted-foreground">الرصيد</p>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="text-xs text-muted-foreground">انضم في: {agent.joinDate}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Drivers Tab */}
          <TabsContent value="drivers" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{MY_DRIVERS.length} سائق في محافظة {MY_GOV.name}</p>
              <Button size="sm" className="bg-primary text-primary-foreground text-xs">إضافة سائق</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MY_DRIVERS.map(driver => (
                <Card key={driver.id} className="border-border/60">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center font-bold text-secondary">
                          {driver.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold">{driver.name}</p>
                          <p className="text-xs text-muted-foreground">{driver.phone} · {driver.vehicle}</p>
                        </div>
                      </div>
                      <Badge className={
                        driver.status === 'on_route' ? 'bg-orange-100 text-orange-800' :
                        driver.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }>
                        {driver.status === 'on_route' ? 'في مهمة' : driver.status === 'active' ? 'متاح' : 'غير نشط'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-muted/50 rounded p-2">
                        <p className="font-bold text-base">{driver.assignedShipments}</p>
                        <p className="text-muted-foreground">مسندة</p>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <p className="font-bold text-base text-green-600">{driver.deliveredToday}</p>
                        <p className="text-muted-foreground">سُلمت</p>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <p className="font-bold text-base text-primary">{driver.rating}</p>
                        <p className="text-muted-foreground">تقييم</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1 text-xs h-7">شحناته</Button>
                      <Button size="sm" className="bg-secondary text-secondary-foreground text-xs h-7 flex-1">إسناد شحنة</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
