import type { Severity } from './types';

export type Channel = 'in_app' | 'sms' | 'whatsapp';

export const SEVERITY_CHANNEL: Record<Severity, Channel> = {
  NORMAL: 'in_app',
  HIGH: 'sms',
  CRITICAL: 'whatsapp',
};

export const CHANNEL_LABEL: Record<Channel, string> = {
  in_app: 'In-app push',
  sms: 'SMS',
  whatsapp: 'WhatsApp',
};

export const CHANNEL_STYLE: Record<
  Channel,
  { card: string; icon: string; badge: string; dot: string }
> = {
  in_app: {
    card: 'border-primary-light/30 bg-primary-light/5',
    icon: 'bg-primary-light/15 text-primary-dark',
    badge: 'bg-primary-light text-white',
    dot: 'bg-primary-light',
  },
  sms: {
    card: 'border-amber-300 bg-amber-50',
    icon: 'bg-amber-100 text-amber-700',
    badge: 'bg-amber-500 text-white',
    dot: 'bg-amber-500',
  },
  whatsapp: {
    card: 'border-violet-300 bg-violet-50',
    icon: 'bg-violet-100 text-violet-700',
    badge: 'bg-violet-600 text-white',
    dot: 'bg-violet-600',
  },
};

export function channelForSeverity(severity: Severity): Channel {
  return SEVERITY_CHANNEL[severity];
}
