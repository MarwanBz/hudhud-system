// =============================================
// هدهد سبأ - Shared Types & Mock Data
// =============================================

export type ShipmentStatus =
  | 'received'
  | 'at_origin_branch'
  | 'in_transit'
  | 'at_destination_branch'
  | 'out_for_delivery'
  | 'delivered'
  | 'rejected'
  | 'postponed'
  | 'ready_for_pickup';

export type ServiceType = 'standard' | 'express' | 'international';

export interface Shipment {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  governorate: string;
  address: string;
  value: number;
  weight: number;
  serviceType: ServiceType;
  status: ShipmentStatus;
  agentId: string;
  agentName: string;
  driverId?: string;
  driverName?: string;
  branchId: string;
  branchName: string;
  createdAt: string;
  updatedAt: string;
  events: ShipmentEvent[];
}

export interface ShipmentEvent {
  id: string;
  status: ShipmentStatus;
  description: string;
  location: string;
  timestamp: string;
  actor: string;
}

export interface Governorate {
  id: string;
  name: string;
  managerId: string;
  managerName: string;
  agentsCount: number;
  driversCount: number;
  shipmentCount: number;
  revenue: number;
  branchAddress: string;
  branchPhone: string;
}

export interface Agent {
  id: string;
  name: string;
  phone: string;
  governorate: string;
  governorateId: string;
  shipmentCount: number;
  earnings: number;
  commissionRate: number;
  status: 'active' | 'inactive';
  joinDate: string;
  walletBalance: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  governorate: string;
  governorateId: string;
  assignedShipments: number;
  deliveredToday: number;
  status: 'active' | 'inactive' | 'on_route';
  vehicle: string;
  licenseNumber: string;
  rating: number;
}

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  received: 'تم الاستلام من الوكيل',
  at_origin_branch: 'في فرع الإرسال',
  in_transit: 'في الطريق',
  at_destination_branch: 'وصل فرع التسليم',
  out_for_delivery: 'في متناول السائق للتوصيل',
  delivered: 'تم التسليم',
  rejected: 'مرفوض',
  postponed: 'مؤجل',
  ready_for_pickup: 'جاهز للاستلام من الفرع',
};

export const STATUS_COLORS: Record<ShipmentStatus, string> = {
  received: 'bg-blue-100 text-blue-800',
  at_origin_branch: 'bg-purple-100 text-purple-800',
  in_transit: 'bg-yellow-100 text-yellow-800',
  at_destination_branch: 'bg-indigo-100 text-indigo-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  postponed: 'bg-gray-100 text-gray-800',
  ready_for_pickup: 'bg-teal-100 text-teal-800',
};

export const SERVICE_LABELS: Record<ServiceType, string> = {
  standard: 'عادي',
  express: 'سريع',
  international: 'دولي',
};

export const GOVERNORATES: Governorate[] = [
  { id: 'gov-1', name: 'عدن', managerId: 'mgr-1', managerName: 'أحمد السيد', agentsCount: 12, driversCount: 8, shipmentCount: 342, revenue: 85000, branchAddress: 'شارع التسعين، بجوار البنك الأهلي', branchPhone: '771234567' },
  { id: 'gov-2', name: 'صنعاء', managerId: 'mgr-2', managerName: 'محمد الحربي', agentsCount: 18, driversCount: 14, shipmentCount: 512, revenue: 128000, branchAddress: 'شارع حدة، بالقرب من السفارة', branchPhone: '779876543' },
  { id: 'gov-3', name: 'تعز', managerId: 'mgr-3', managerName: 'علي الشرجبي', agentsCount: 9, driversCount: 6, shipmentCount: 218, revenue: 54500, branchAddress: 'شارع جمال، مقابل المدرسة', branchPhone: '770123456' },
  { id: 'gov-4', name: 'حضرموت', managerId: 'mgr-4', managerName: 'سعيد بن عمر', agentsCount: 7, driversCount: 5, shipmentCount: 156, revenue: 39000, branchAddress: 'شارع السيلة، المكلا', branchPhone: '775678901' },
  { id: 'gov-5', name: 'الحديدة', managerId: 'mgr-5', managerName: 'حسن المطري', agentsCount: 6, driversCount: 4, shipmentCount: 124, revenue: 31000, branchAddress: 'شارع الكورنيش، مقابل الميناء', branchPhone: '773456789' },
  { id: 'gov-6', name: 'مأرب', managerId: 'mgr-6', managerName: 'ناصر العواضي', agentsCount: 4, driversCount: 3, shipmentCount: 87, revenue: 21750, branchAddress: 'مأرب المدينة، حي الورود', branchPhone: '776543210' },
];

export const AGENTS: Agent[] = [
  { id: 'agt-1', name: 'وليد الغداري', phone: '771111111', governorate: 'عدن', governorateId: 'gov-1', shipmentCount: 87, earnings: 4350, commissionRate: 5, status: 'active', joinDate: '2023-03-15', walletBalance: 2100 },
  { id: 'agt-2', name: 'فارس القحطاني', phone: '772222222', governorate: 'عدن', governorateId: 'gov-1', shipmentCount: 63, earnings: 3150, commissionRate: 5, status: 'active', joinDate: '2023-05-20', walletBalance: 1450 },
  { id: 'agt-3', name: 'نادر الزبيدي', phone: '773333333', governorate: 'صنعاء', governorateId: 'gov-2', shipmentCount: 112, earnings: 5600, commissionRate: 5, status: 'active', joinDate: '2023-01-10', walletBalance: 3200 },
  { id: 'agt-4', name: 'سالم العبيدي', phone: '774444444', governorate: 'صنعاء', governorateId: 'gov-2', shipmentCount: 95, earnings: 4750, commissionRate: 5, status: 'active', joinDate: '2023-02-28', walletBalance: 2800 },
  { id: 'agt-5', name: 'عمر الحمزي', phone: '775555555', governorate: 'تعز', governorateId: 'gov-3', shipmentCount: 54, earnings: 2700, commissionRate: 5, status: 'inactive', joinDate: '2023-07-01', walletBalance: 700 },
  { id: 'agt-6', name: 'مازن الشامي', phone: '776666666', governorate: 'حضرموت', governorateId: 'gov-4', shipmentCount: 41, earnings: 2050, commissionRate: 5, status: 'active', joinDate: '2023-09-12', walletBalance: 950 },
];

export const DRIVERS: Driver[] = [
  { id: 'drv-1', name: 'أحمد البيلي', phone: '777777771', governorate: 'عدن', governorateId: 'gov-1', assignedShipments: 6, deliveredToday: 4, status: 'on_route', vehicle: 'هوندا 2020', licenseNumber: 'ADN-1234', rating: 4.8 },
  { id: 'drv-2', name: 'خالد الهاشمي', phone: '777777772', governorate: 'عدن', governorateId: 'gov-1', assignedShipments: 5, deliveredToday: 5, status: 'active', vehicle: 'تويوتا 2019', licenseNumber: 'ADN-5678', rating: 4.6 },
  { id: 'drv-3', name: 'يوسف الجبلي', phone: '777777773', governorate: 'صنعاء', governorateId: 'gov-2', assignedShipments: 8, deliveredToday: 3, status: 'on_route', vehicle: 'نيسان 2021', licenseNumber: 'SNA-2345', rating: 4.9 },
  { id: 'drv-4', name: 'رامي الصبري', phone: '777777774', governorate: 'صنعاء', governorateId: 'gov-2', assignedShipments: 4, deliveredToday: 4, status: 'active', vehicle: 'كيا 2022', licenseNumber: 'SNA-6789', rating: 4.7 },
  { id: 'drv-5', name: 'طارق المعمري', phone: '777777775', governorate: 'تعز', governorateId: 'gov-3', assignedShipments: 3, deliveredToday: 2, status: 'inactive', vehicle: 'هيونداي 2020', licenseNumber: 'TAZ-3456', rating: 4.3 },
];

export const SHIPMENTS: Shipment[] = [
  {
    id: 'shp-001', trackingNumber: 'YEM-ADN-0002456',
    senderName: 'محمد علي أحمد', senderPhone: '771234567',
    receiverName: 'فاطمة حسن سعيد', receiverPhone: '779876543',
    governorate: 'صنعاء', address: 'شارع حدة، حي السبعين، مقابل المدرسة الدولية',
    value: 500, weight: 2.5, serviceType: 'express',
    status: 'out_for_delivery',
    agentId: 'agt-1', agentName: 'وليد الغداري',
    driverId: 'drv-3', driverName: 'يوسف الجبلي',
    branchId: 'gov-2', branchName: 'فرع صنعاء',
    createdAt: '2024-01-15T08:30:00Z', updatedAt: '2024-01-16T09:15:00Z',
    events: [
      { id: 'e1', status: 'received', description: 'تم استلام الطرد من الوكيل', location: 'مكتب وليد الغداري - عدن', timestamp: '2024-01-15T08:30:00Z', actor: 'وليد الغداري' },
      { id: 'e2', status: 'at_origin_branch', description: 'وصل الطرد إلى فرع عدن', location: 'فرع عدن - شارع التسعين', timestamp: '2024-01-15T11:00:00Z', actor: 'مدير فرع عدن' },
      { id: 'e3', status: 'in_transit', description: 'الطرد في الطريق إلى صنعاء', location: 'الطريق الرئيسي عدن - صنعاء', timestamp: '2024-01-15T14:00:00Z', actor: 'سائق النقل' },
      { id: 'e4', status: 'at_destination_branch', description: 'وصل الطرد إلى فرع صنعاء', location: 'فرع صنعاء - شارع حدة', timestamp: '2024-01-16T07:30:00Z', actor: 'مدير فرع صنعاء' },
      { id: 'e5', status: 'out_for_delivery', description: 'الطرد خرج للتوصيل مع السائق', location: 'فرع صنعاء', timestamp: '2024-01-16T09:15:00Z', actor: 'يوسف الجبلي' },
    ],
  },
  {
    id: 'shp-002', trackingNumber: 'YEM-SNA-0001892',
    senderName: 'عبدالله محمد النمر', senderPhone: '773456789',
    receiverName: 'سعاد علي الزيدي', receiverPhone: '775678901',
    governorate: 'عدن', address: 'كريتر، شارع الزعفران، بجوار العيادة',
    value: 1200, weight: 5.0, serviceType: 'standard',
    status: 'at_destination_branch',
    agentId: 'agt-3', agentName: 'نادر الزبيدي',
    branchId: 'gov-1', branchName: 'فرع عدن',
    createdAt: '2024-01-14T10:00:00Z', updatedAt: '2024-01-16T06:00:00Z',
    events: [
      { id: 'e1', status: 'received', description: 'تم استلام الطرد من الوكيل', location: 'مكتب نادر الزبيدي - صنعاء', timestamp: '2024-01-14T10:00:00Z', actor: 'نادر الزبيدي' },
      { id: 'e2', status: 'at_origin_branch', description: 'وصل الطرد إلى فرع صنعاء', location: 'فرع صنعاء', timestamp: '2024-01-14T13:00:00Z', actor: 'مدير فرع صنعاء' },
      { id: 'e3', status: 'in_transit', description: 'الطرد في الطريق إلى عدن', location: 'الطريق الرئيسي', timestamp: '2024-01-15T08:00:00Z', actor: 'سائق النقل' },
      { id: 'e4', status: 'at_destination_branch', description: 'وصل الطرد إلى فرع عدن - جاهز للاستلام', location: 'فرع عدن - شارع التسعين', timestamp: '2024-01-16T06:00:00Z', actor: 'مدير فرع عدن' },
    ],
  },
  {
    id: 'shp-003', trackingNumber: 'YEM-ADN-0002457',
    senderName: 'ريم صالح العمري', senderPhone: '776543210',
    receiverName: 'كريم أحمد البيضاني', receiverPhone: '778901234',
    governorate: 'تعز', address: 'حي الروضة، شارع القاهرة',
    value: 300, weight: 1.2, serviceType: 'standard',
    status: 'delivered',
    agentId: 'agt-1', agentName: 'وليد الغداري',
    driverId: 'drv-5', driverName: 'طارق المعمري',
    branchId: 'gov-3', branchName: 'فرع تعز',
    createdAt: '2024-01-13T09:00:00Z', updatedAt: '2024-01-15T16:00:00Z',
    events: [
      { id: 'e1', status: 'received', description: 'تم استلام الطرد', location: 'عدن', timestamp: '2024-01-13T09:00:00Z', actor: 'وليد الغداري' },
      { id: 'e2', status: 'at_origin_branch', description: 'في فرع عدن', location: 'فرع عدن', timestamp: '2024-01-13T12:00:00Z', actor: 'النظام' },
      { id: 'e3', status: 'in_transit', description: 'في الطريق', location: 'الطريق العام', timestamp: '2024-01-14T08:00:00Z', actor: 'النظام' },
      { id: 'e4', status: 'at_destination_branch', description: 'وصل فرع تعز', location: 'فرع تعز', timestamp: '2024-01-14T18:00:00Z', actor: 'مدير فرع تعز' },
      { id: 'e5', status: 'out_for_delivery', description: 'خرج للتوصيل', location: 'فرع تعز', timestamp: '2024-01-15T09:00:00Z', actor: 'طارق المعمري' },
      { id: 'e6', status: 'delivered', description: 'تم التسليم بنجاح', location: 'حي الروضة - تعز', timestamp: '2024-01-15T16:00:00Z', actor: 'طارق المعمري' },
    ],
  },
  {
    id: 'shp-004', trackingNumber: 'YEM-SNA-0001893',
    senderName: 'جمال حسين الوادعي', senderPhone: '774321098',
    receiverName: 'لمى نبيل الغيلاني', receiverPhone: '770987654',
    governorate: 'حضرموت', address: 'المكلا، شارع الكورنيش',
    value: 800, weight: 3.8, serviceType: 'express',
    status: 'in_transit',
    agentId: 'agt-4', agentName: 'سالم العبيدي',
    branchId: 'gov-4', branchName: 'فرع حضرموت',
    createdAt: '2024-01-16T07:00:00Z', updatedAt: '2024-01-16T10:00:00Z',
    events: [
      { id: 'e1', status: 'received', description: 'تم استلام الطرد', location: 'صنعاء', timestamp: '2024-01-16T07:00:00Z', actor: 'سالم العبيدي' },
      { id: 'e2', status: 'at_origin_branch', description: 'في فرع صنعاء', location: 'فرع صنعاء', timestamp: '2024-01-16T09:00:00Z', actor: 'النظام' },
      { id: 'e3', status: 'in_transit', description: 'في الطريق إلى حضرموت', location: 'الطريق العام', timestamp: '2024-01-16T10:00:00Z', actor: 'سائق النقل' },
    ],
  },
  {
    id: 'shp-005', trackingNumber: 'YEM-ADN-0002458',
    senderName: 'بسمة عبدالقادر السقاف', senderPhone: '779012345',
    receiverName: 'منير صادق البيحاني', receiverPhone: '771098765',
    governorate: 'الحديدة', address: 'الحديدة، شارع الكورنيش',
    value: 450, weight: 2.0, serviceType: 'standard',
    status: 'rejected',
    agentId: 'agt-2', agentName: 'فارس القحطاني',
    driverId: 'drv-1', driverName: 'أحمد البيلي',
    branchId: 'gov-5', branchName: 'فرع الحديدة',
    createdAt: '2024-01-12T11:00:00Z', updatedAt: '2024-01-14T14:00:00Z',
    events: [
      { id: 'e1', status: 'received', description: 'تم الاستلام', location: 'عدن', timestamp: '2024-01-12T11:00:00Z', actor: 'فارس القحطاني' },
      { id: 'e2', status: 'at_destination_branch', description: 'وصل الفرع', location: 'فرع الحديدة', timestamp: '2024-01-13T16:00:00Z', actor: 'النظام' },
      { id: 'e3', status: 'out_for_delivery', description: 'خرج للتوصيل', location: 'فرع الحديدة', timestamp: '2024-01-14T09:00:00Z', actor: 'أحمد البيلي' },
      { id: 'e4', status: 'rejected', description: 'رفض المستلم استلام الطرد', location: 'الحديدة', timestamp: '2024-01-14T14:00:00Z', actor: 'أحمد البيلي' },
    ],
  },
];

export const STATS = {
  totalShipments: 1439,
  deliveredToday: 87,
  inTransit: 234,
  pendingPickup: 56,
  rejected: 12,
  totalRevenue: 359250,
  monthlyRevenue: 89812,
  agentsCount: 56,
  driversCount: 40,
  governoratesCount: 6,
};
