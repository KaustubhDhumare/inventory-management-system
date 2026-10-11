import { format, formatDistanceToNow } from 'date-fns';
export const formatCurrency = (n) => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(n ?? 0);
export const formatNumber = (n) => new Intl.NumberFormat('en-IN').format(n ?? 0);
export const formatCompact = (n) => new Intl.NumberFormat('en-IN',{notation:'compact',maximumFractionDigits:1}).format(n ?? 0);
export const formatDate = (value) => value ? format(new Date(value),'dd MMM yyyy') : '—';
export const formatTimestamp = (value) => value ? format(new Date(value),'dd MMM yyyy, h:mm a') : '—';
export const relativeDate = (value) => value ? formatDistanceToNow(new Date(value),{addSuffix:true}) : '—';
export const refName = (ref, field='name') => typeof ref === 'object' ? ref?.[field] || ref?.name || '—' : ref || '—';
export const refId = (ref) => typeof ref === 'object' ? ref?._id : ref;
