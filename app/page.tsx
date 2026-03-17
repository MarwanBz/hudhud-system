'use client';

import { useState } from 'react';
import AdminDashboard from '@/components/views/AdminDashboard';
import AgentMobileApp from '@/components/views/AgentMobileApp';
import DriverMobileApp from '@/components/views/DriverMobileApp';
import PublicTracking from '@/components/views/PublicTracking';
import GovernorateManager from '@/components/views/GovernorateManager';

type SystemView = 'home' | 'admin' | 'governor' | 'agent' | 'driver' | 'tracking';

const VIEWS: {
  key: SystemView;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  color: 'primary' | 'secondary';
  icon: React.ReactNode;
}[] = [
  {
    key: 'admin',
    title: 'لوحة التحكم الإدارية',
    subtitle: 'Admin Dashboard',
    description: 'إدارة شاملة: الشحنات، المحافظات، الوكلاء، السائقون، التقارير المالية، الإعدادات',
    tags: ['المدير العام', 'تقارير متقدمة', 'إدارة كاملة'],
    color: 'primary',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    key: 'governor',
    title: 'لوحة مدير المحافظة',
    subtitle: 'Governorate Manager',
    description: 'إدارة الفرع: الشحنات الواردة والصادرة، إسناد السائقين، متابعة الوكلاء المحليين',
    tags: ['مدير الفرع', 'إسناد سائقين', 'تقارير محلية'],
    color: 'secondary',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: 'agent',
    title: 'تطبيق الوكلاء',
    subtitle: 'Agent Mobile App',
    description: 'واجهة مبسطة للوكلاء: إضافة شحنات، تتبع الطرود، كشف الأرباح والعمولات',
    tags: ['تطبيق موبايل', 'وكيل الاستلام', 'المحفظة'],
    color: 'primary',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    key: 'driver',
    title: 'تطبيق السائقين',
    subtitle: 'Driver Mobile App',
    description: 'شحنات اليوم، تحديث الحالات، توقيع إلكتروني عند التسليم، سجل التوصيلات',
    tags: ['تطبيق موبايل', 'GPS مباشر', 'التسليم'],
    color: 'secondary',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
  {
    key: 'tracking',
    title: 'صفحة التتبع العام',
    subtitle: 'Public Tracking',
    description: 'يُستخدم من قِبَل المستلمين: تتبع الطرد بالرقم، التواصل مع السائق، اشتراك واتساب',
    tags: ['للعملاء', 'بدون تسجيل', 'واتساب'],
    color: 'primary',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
];

export default function Home() {
  const [currentView, setCurrentView] = useState<SystemView>('home');

  if (currentView === 'admin') return <AdminDashboard onBack={() => setCurrentView('home')} />;
  if (currentView === 'governor') return <GovernorateManager onBack={() => setCurrentView('home')} />;
  if (currentView === 'agent') return <AgentMobileApp onBack={() => setCurrentView('home')} />;
  if (currentView === 'driver') return <DriverMobileApp onBack={() => setCurrentView('home')} />;
  if (currentView === 'tracking') return <PublicTracking onBack={() => setCurrentView('home')} />;

  return (
    <main className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Header */}
      <header className="bg-secondary text-secondary-foreground shadow-md">
        <div className="max-w-6xl mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-IF8pnxKBjP4iTsBkjBMv7XBydLcakE.png"
            alt="هدهد سبأ"
            className="h-14 w-auto brightness-0 invert"
          />
          <div className="text-center sm:text-right">
            <h1 className="text-xl font-bold leading-tight">نظام هدهد سبأ الموحد</h1>
            <p className="text-sm text-secondary-foreground/70">منصة تتبع وإدارة الشحنات المتكاملة</p>
          </div>
          <div className="flex items-center gap-2 bg-green-500/20 text-green-300 rounded-full px-4 py-1.5 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
            النظام يعمل
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-secondary/5 border-b border-border">
        <div className="max-w-6xl mx-auto px-5 py-10 text-center">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">نموذج أولي — Prototype</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
            اختر النظام الذي تريد استعراضه
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
            يضم النظام خمسة واجهات مختلفة تخدم كل طرف في عملية الشحن — من المدير العام وحتى المستلم النهائي
          </p>
        </div>
      </div>

      {/* System Cards */}
      <div className="flex-1 max-w-6xl mx-auto px-5 py-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {VIEWS.map((view, idx) => {
            const isPrimary = view.color === 'primary';
            const isWide = idx === 4; // last card spans full on xl
            return (
              <button
                key={view.key}
                onClick={() => setCurrentView(view.key)}
                className={`group text-right border-2 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 hover:shadow-lg active:scale-[0.98] bg-card ${
                  isWide ? 'xl:col-span-1' : ''
                } ${
                  isPrimary
                    ? 'border-border hover:border-primary/60 hover:shadow-primary/10'
                    : 'border-border hover:border-secondary/60 hover:shadow-secondary/10'
                }`}
              >
                {/* Icon + arrow */}
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                    isPrimary ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                  }`}>
                    {view.icon}
                  </div>
                  <svg
                    className={`w-5 h-5 mt-1 transition-transform group-hover:-translate-x-1 ${
                      isPrimary ? 'text-primary/50' : 'text-secondary/50'
                    }`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-lg font-bold text-foreground leading-tight">{view.title}</h3>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{view.subtitle}</p>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{view.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {view.tags.map(tag => (
                    <span
                      key={tag}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        isPrimary
                          ? 'bg-primary/10 text-primary'
                          : 'bg-secondary/10 text-secondary'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* System Architecture Note */}
        <div className="mt-12 border border-border rounded-2xl p-6 bg-card">
          <h3 className="font-bold text-base mb-4 text-foreground">مخطط سير العمل في النظام</h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm overflow-x-auto pb-2">
            {[
              { label: 'الوكيل', sub: 'يستلم الطرد ويسجله', color: 'bg-primary/10 text-primary border-primary/30' },
              { label: '←', sub: '', color: 'text-muted-foreground text-xl font-light', plain: true },
              { label: 'فرع الإرسال', sub: 'يفحص ويُحضّر للنقل', color: 'bg-secondary/10 text-secondary border-secondary/30' },
              { label: '←', sub: '', color: 'text-muted-foreground text-xl font-light', plain: true },
              { label: 'النقل بين المحافظات', sub: 'سائق النقل', color: 'bg-muted text-muted-foreground border-border' },
              { label: '←', sub: '', color: 'text-muted-foreground text-xl font-light', plain: true },
              { label: 'فرع التسليم', sub: 'مدير المحافظة يُسند سائقاً', color: 'bg-secondary/10 text-secondary border-secondary/30' },
              { label: '←', sub: '', color: 'text-muted-foreground text-xl font-light', plain: true },
              { label: 'السائق', sub: 'يُسلّم ويحدّث الحالة', color: 'bg-primary/10 text-primary border-primary/30' },
              { label: '←', sub: '', color: 'text-muted-foreground text-xl font-light', plain: true },
              { label: 'المستلم', sub: 'يتابع عبر التتبع العام', color: 'bg-green-50 text-green-800 border-green-200' },
            ].map((step, i) =>
              step.plain ? (
                <span key={i} className="shrink-0 text-muted-foreground text-lg">←</span>
              ) : (
                <div key={i} className={`shrink-0 border rounded-xl px-3 py-2 text-center ${step.color}`}>
                  <p className="font-semibold text-sm">{step.label}</p>
                  {step.sub && <p className="text-[10px] mt-0.5 opacity-80">{step.sub}</p>}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/80 py-6 mt-4">
        <div className="max-w-6xl mx-auto px-5 text-center text-xs text-muted-foreground">
          <p>© 2025 هدهد سبأ — رسولك الرقمي · نموذج أولي للعرض على العميل</p>
        </div>
      </footer>
    </main>
  );
}
