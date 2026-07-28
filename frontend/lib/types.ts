export type EventType = 'CHECK_IN' | 'TRIAGE_STARTED' | 'TRIAGE_COMPLETE' | 'ALERT';
export type Severity = 'NORMAL' | 'HIGH';

export interface ClinicEvent {
  id: string;
  type: EventType;
  patientRef: string;
  message: string;
  severity: Severity;
  createdAt: string;
}
