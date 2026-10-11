import { LayoutDashboard, Package, Tags, Truck, ClipboardList, ArrowLeftRight, UserRound } from 'lucide-react';
export const navigation = [
  { group:'Overview', items:[['Dashboard','/','LayoutDashboard']] },
  { group:'Catalog', items:[['Products','/products','Package'],['Categories','/categories','Tags'],['Suppliers','/suppliers','Truck']] },
  { group:'Operations', items:[['Purchase orders','/purchase-orders','ClipboardList','admin'],['Inventory','/inventory','ArrowLeftRight'],['Transactions','/transactions','ArrowLeftRight','admin']] },
  { group:'Account', items:[['Profile','/profile','UserRound']] },
];
export const iconByName = { LayoutDashboard, Package, Tags, Truck, ClipboardList, ArrowLeftRight, UserRound };
