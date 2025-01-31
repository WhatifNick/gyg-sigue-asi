export interface Shift {
  id?: number;
  created_at?: string;
  shift_leader: string;
  shift_date: string;
  shift_type: ShiftType;
  under_4_min: number;
  over_8_min: number;
  miam: number;
  complaints: number;
  temps: boolean;
  temps_desc: string | null;
  cleaning: boolean;
  cleaning_desc: string | null;
  cash_variance: string | null;
  notes: string | null;
  score: number;
}

export enum ShiftType {
  Open = 0,
  Mid = 1,
  Close = 2,
}
