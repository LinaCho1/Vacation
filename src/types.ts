export interface Schedule {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
  person: '조운' | '지윤';
  location: string;
  period: 1 | 2 | 3;  // 구간 1, 2, 3
  dayOfWeek: number[];  // 0: 일요일, 1: 월요일, ..., 6: 토요일
  timeSlot: string;  // 시간대 (예: "11:00-12:30")
} 