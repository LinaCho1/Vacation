import React, { useState, useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import Calendar from './components/Calendar';
import { Schedule } from './types';

const STORAGE_KEY = 'vacation-schedules';

// 초기 스케줄 데이터
const initialSchedules: Schedule[] = [
  // 조운이 구간 1
  {
    id: '1',
    title: '피아노',
    start: new Date('2025-06-13'),
    end: new Date('2025-07-14'),
    description: '피아노 레슨',
    person: '조운',
    location: '피아노 학원',
    period: 1,
    dayOfWeek: [1, 2, 3, 4, 5], // 월~금
    timeSlot: '11:00-12:30'
  },
  {
    id: '2',
    title: '삼성레포츠 수영',
    start: new Date('2025-06-13'),
    end: new Date('2025-07-14'),
    description: '수영 레슨',
    person: '조운',
    location: '삼성레포츠',
    period: 1,
    dayOfWeek: [2, 3, 4, 5], // 화~금
    timeSlot: '09:00-10:00'
  },
  {
    id: '3',
    title: '서리풀수영장',
    start: new Date('2025-06-13'),
    end: new Date('2025-07-14'),
    description: '수영 레슨',
    person: '조운',
    location: '서리풀수영장',
    period: 1,
    dayOfWeek: [1], // 월
    timeSlot: '18:00-20:00'
  },
  {
    id: '4',
    title: '소미아트',
    start: new Date('2025-06-13'),
    end: new Date('2025-07-14'),
    description: '미술 레슨',
    person: '조운',
    location: '소미아트',
    period: 1,
    dayOfWeek: [3], // 수
    timeSlot: '16:30-18:00'
  },
  {
    id: '5',
    title: '구몬',
    start: new Date('2025-06-13'),
    end: new Date('2025-07-14'),
    description: '구몬 학습',
    person: '조운',
    location: '구몬',
    period: 1,
    dayOfWeek: [3], // 수
    timeSlot: '19:45-20:00'
  },
  {
    id: '6',
    title: '축구대표팀',
    start: new Date('2025-06-13'),
    end: new Date('2025-07-14'),
    description: '축구 훈련',
    person: '조운',
    location: '축구장',
    period: 1,
    dayOfWeek: [2], // 화
    timeSlot: '19:00-20:20'
  },
  {
    id: '7',
    title: '축구',
    start: new Date('2025-06-13'),
    end: new Date('2025-07-14'),
    description: '축구 레슨',
    person: '조운',
    location: '축구장',
    period: 1,
    dayOfWeek: [4], // 목
    timeSlot: '17:00-18:00'
  },
  {
    id: '8',
    title: '축구1:1',
    start: new Date('2025-06-13'),
    end: new Date('2025-07-14'),
    description: '1:1 축구 레슨',
    person: '조운',
    location: '축구장',
    period: 1,
    dayOfWeek: [5], // 금
    timeSlot: '18:00-19:00'
  },

  // 지윤이 구간 1
  {
    id: '9',
    title: '피아노',
    start: new Date('2025-06-13'),
    end: new Date('2025-07-14'),
    description: '피아노 레슨',
    person: '지윤',
    location: '피아노 학원',
    period: 1,
    dayOfWeek: [1, 2, 3, 4, 5], // 월~금
    timeSlot: '11:00-12:30'
  },
  {
    id: '10',
    title: '삼성레포츠 수영',
    start: new Date('2025-06-13'),
    end: new Date('2025-07-14'),
    description: '수영 레슨',
    person: '지윤',
    location: '삼성레포츠',
    period: 1,
    dayOfWeek: [2, 3, 4, 5], // 화~금
    timeSlot: '09:00-10:00'
  },
  {
    id: '11',
    title: '서리풀수영장',
    start: new Date('2025-06-13'),
    end: new Date('2025-07-14'),
    description: '수영 레슨',
    person: '지윤',
    location: '서리풀수영장',
    period: 1,
    dayOfWeek: [1], // 월
    timeSlot: '18:00-20:00'
  },
  {
    id: '12',
    title: '소미아트',
    start: new Date('2025-06-13'),
    end: new Date('2025-07-14'),
    description: '미술 레슨',
    person: '지윤',
    location: '소미아트',
    period: 1,
    dayOfWeek: [3], // 수
    timeSlot: '16:30-18:00'
  },
  {
    id: '13',
    title: '구몬',
    start: new Date('2025-06-13'),
    end: new Date('2025-07-14'),
    description: '구몬 학습',
    person: '지윤',
    location: '구몬',
    period: 1,
    dayOfWeek: [3], // 수
    timeSlot: '19:45-20:00'
  },
  {
    id: '14',
    title: '발레1',
    start: new Date('2025-06-13'),
    end: new Date('2025-07-14'),
    description: '발레 레슨',
    person: '지윤',
    location: '발레 학원',
    period: 1,
    dayOfWeek: [2], // 화
    timeSlot: '15:30-18:00'
  },
  {
    id: '15',
    title: '발레2',
    start: new Date('2025-06-13'),
    end: new Date('2025-07-14'),
    description: '발레 레슨',
    person: '지윤',
    location: '발레 학원',
    period: 1,
    dayOfWeek: [4], // 목
    timeSlot: '16:30-18:00'
  },
  {
    id: '16',
    title: '발레3',
    start: new Date('2025-06-13'),
    end: new Date('2025-07-14'),
    description: '발레 레슨',
    person: '지윤',
    location: '발레 학원',
    period: 1,
    dayOfWeek: [5], // 금
    timeSlot: '15:30-16:30'
  },

  // 조운이 구간 2
  {
    id: '17',
    title: '피아노',
    start: new Date('2025-07-15'),
    end: new Date('2025-07-27'),
    description: '피아노 레슨',
    person: '조운',
    location: '피아노 학원',
    period: 2,
    dayOfWeek: [1, 3, 4, 5], // 월, 수~금
    timeSlot: '11:00-12:30'
  },
  {
    id: '18',
    title: '방문과외',
    start: new Date('2025-07-15'),
    end: new Date('2025-07-27'),
    description: '방문과외',
    person: '조운',
    location: '집',
    period: 2,
    dayOfWeek: [2], // 화
    timeSlot: '09:00-13:00'
  },
  {
    id: '19',
    title: '삼성레포츠 수영',
    start: new Date('2025-07-15'),
    end: new Date('2025-07-27'),
    description: '수영 레슨',
    person: '조운',
    location: '삼성레포츠',
    period: 2,
    dayOfWeek: [3, 4, 5], // 수~금
    timeSlot: '09:00-10:00'
  },
  {
    id: '20',
    title: '서리풀수영장',
    start: new Date('2025-07-15'),
    end: new Date('2025-07-27'),
    description: '수영 레슨',
    person: '조운',
    location: '서리풀수영장',
    period: 2,
    dayOfWeek: [1], // 월
    timeSlot: '18:00-20:00'
  },
  {
    id: '21',
    title: '소미아트',
    start: new Date('2025-07-15'),
    end: new Date('2025-07-27'),
    description: '미술 레슨',
    person: '조운',
    location: '소미아트',
    period: 2,
    dayOfWeek: [3], // 수
    timeSlot: '16:30-18:00'
  },
  {
    id: '22',
    title: '구몬',
    start: new Date('2025-07-15'),
    end: new Date('2025-07-27'),
    description: '구몬 학습',
    person: '조운',
    location: '구몬',
    period: 2,
    dayOfWeek: [3], // 수
    timeSlot: '19:45-20:00'
  },
  {
    id: '23',
    title: '축구대표팀',
    start: new Date('2025-07-15'),
    end: new Date('2025-07-27'),
    description: '축구 훈련',
    person: '조운',
    location: '축구장',
    period: 2,
    dayOfWeek: [2], // 화
    timeSlot: '19:00-20:20'
  },
  {
    id: '24',
    title: '축구',
    start: new Date('2025-07-15'),
    end: new Date('2025-07-27'),
    description: '축구 레슨',
    person: '조운',
    location: '축구장',
    period: 2,
    dayOfWeek: [4], // 목
    timeSlot: '17:00-18:00'
  },
  {
    id: '25',
    title: '축구1:1',
    start: new Date('2025-07-15'),
    end: new Date('2025-07-27'),
    description: '1:1 축구 레슨',
    person: '조운',
    location: '축구장',
    period: 2,
    dayOfWeek: [5], // 금
    timeSlot: '18:00-19:00'
  },

  // 조운이 구간 3
  {
    id: '26',
    title: '피아노',
    start: new Date('2025-07-28'),
    end: new Date('2025-08-15'),
    description: '피아노 레슨',
    person: '조운',
    location: '피아노 학원',
    period: 3,
    dayOfWeek: [1, 3, 4, 5], // 월, 수~금
    timeSlot: '11:00-12:30'
  },
  {
    id: '27',
    title: '방문과외',
    start: new Date('2025-07-28'),
    end: new Date('2025-08-15'),
    description: '방문과외',
    person: '조운',
    location: '집',
    period: 3,
    dayOfWeek: [2], // 화
    timeSlot: '09:00-13:00'
  },
  {
    id: '28',
    title: '서리풀수영장',
    start: new Date('2025-07-28'),
    end: new Date('2025-08-15'),
    description: '수영 레슨',
    person: '조운',
    location: '서리풀수영장',
    period: 3,
    dayOfWeek: [1], // 월
    timeSlot: '18:00-20:00'
  },
  {
    id: '29',
    title: '서리풀수영장',
    start: new Date('2025-07-28'),
    end: new Date('2025-08-15'),
    description: '수영 레슨',
    person: '조운',
    location: '서리풀수영장',
    period: 3,
    dayOfWeek: [3, 4, 5], // 수목금
    timeSlot: '09:00-11:00'
  },
  {
    id: '30',
    title: '소미아트',
    start: new Date('2025-07-28'),
    end: new Date('2025-08-15'),
    description: '미술 레슨',
    person: '조운',
    location: '소미아트',
    period: 3,
    dayOfWeek: [3], // 수
    timeSlot: '16:30-18:00'
  },
  {
    id: '31',
    title: '구몬',
    start: new Date('2025-07-28'),
    end: new Date('2025-08-15'),
    description: '구몬 학습',
    person: '조운',
    location: '구몬',
    period: 3,
    dayOfWeek: [3], // 수
    timeSlot: '19:45-20:00'
  },
  {
    id: '32',
    title: '축구대표팀',
    start: new Date('2025-07-28'),
    end: new Date('2025-08-15'),
    description: '축구 훈련',
    person: '조운',
    location: '축구장',
    period: 3,
    dayOfWeek: [2], // 화
    timeSlot: '19:00-20:20'
  },
  {
    id: '33',
    title: '축구',
    start: new Date('2025-07-28'),
    end: new Date('2025-08-15'),
    description: '축구 레슨',
    person: '조운',
    location: '축구장',
    period: 3,
    dayOfWeek: [4], // 목
    timeSlot: '17:00-18:00'
  },
  {
    id: '34',
    title: '축구1:1',
    start: new Date('2025-07-28'),
    end: new Date('2025-08-15'),
    description: '1:1 축구 레슨',
    person: '조운',
    location: '축구장',
    period: 3,
    dayOfWeek: [5], // 금
    timeSlot: '18:00-19:00'
  },

  // 지윤이 구간 2
  {
    id: '35',
    title: '피아노',
    start: new Date('2025-07-15'),
    end: new Date('2025-07-27'),
    description: '피아노 레슨',
    person: '지윤',
    location: '피아노 학원',
    period: 2,
    dayOfWeek: [1, 3, 4, 5], // 월, 수~금
    timeSlot: '11:00-12:30'
  },
  {
    id: '36',
    title: '방문과외',
    start: new Date('2025-07-15'),
    end: new Date('2025-07-27'),
    description: '방문과외',
    person: '지윤',
    location: '집',
    period: 2,
    dayOfWeek: [2], // 화
    timeSlot: '09:00-13:00'
  },
  {
    id: '37',
    title: '삼성레포츠 수영',
    start: new Date('2025-07-15'),
    end: new Date('2025-07-27'),
    description: '수영 레슨',
    person: '지윤',
    location: '삼성레포츠',
    period: 2,
    dayOfWeek: [3, 4, 5], // 수~금
    timeSlot: '09:00-10:00'
  },
  {
    id: '38',
    title: '서리풀수영장',
    start: new Date('2025-07-15'),
    end: new Date('2025-07-27'),
    description: '수영 레슨',
    person: '지윤',
    location: '서리풀수영장',
    period: 2,
    dayOfWeek: [1], // 월
    timeSlot: '18:00-20:00'
  },
  {
    id: '39',
    title: '소미아트',
    start: new Date('2025-07-15'),
    end: new Date('2025-07-27'),
    description: '미술 레슨',
    person: '지윤',
    location: '소미아트',
    period: 2,
    dayOfWeek: [3], // 수
    timeSlot: '16:30-18:00'
  },
  {
    id: '40',
    title: '구몬',
    start: new Date('2025-07-15'),
    end: new Date('2025-07-27'),
    description: '구몬 학습',
    person: '지윤',
    location: '구몬',
    period: 2,
    dayOfWeek: [3], // 수
    timeSlot: '19:45-20:00'
  },
  {
    id: '41',
    title: '발레1',
    start: new Date('2025-07-15'),
    end: new Date('2025-07-27'),
    description: '발레 레슨',
    person: '지윤',
    location: '발레 학원',
    period: 2,
    dayOfWeek: [2], // 화
    timeSlot: '15:30-18:00'
  },
  {
    id: '42',
    title: '발레2',
    start: new Date('2025-07-15'),
    end: new Date('2025-07-27'),
    description: '발레 레슨',
    person: '지윤',
    location: '발레 학원',
    period: 2,
    dayOfWeek: [4], // 목
    timeSlot: '16:30-18:00'
  },
  {
    id: '43',
    title: '발레3',
    start: new Date('2025-07-15'),
    end: new Date('2025-07-27'),
    description: '발레 레슨',
    person: '지윤',
    location: '발레 학원',
    period: 2,
    dayOfWeek: [5], // 금
    timeSlot: '15:30-16:30'
  },

  // 지윤이 구간 3
  {
    id: '44',
    title: '피아노',
    start: new Date('2025-07-28'),
    end: new Date('2025-08-15'),
    description: '피아노 레슨',
    person: '지윤',
    location: '피아노 학원',
    period: 3,
    dayOfWeek: [1, 3, 4, 5], // 월, 수~금
    timeSlot: '11:00-12:30'
  },
  {
    id: '45',
    title: '방문과외',
    start: new Date('2025-07-28'),
    end: new Date('2025-08-15'),
    description: '방문과외',
    person: '지윤',
    location: '집',
    period: 3,
    dayOfWeek: [2], // 화
    timeSlot: '09:00-13:00'
  },
  {
    id: '46',
    title: '서리풀수영장',
    start: new Date('2025-07-28'),
    end: new Date('2025-08-15'),
    description: '수영 레슨',
    person: '지윤',
    location: '서리풀수영장',
    period: 3,
    dayOfWeek: [1], // 월
    timeSlot: '18:00-20:00'
  },
  {
    id: '47',
    title: '서리풀수영장',
    start: new Date('2025-07-28'),
    end: new Date('2025-08-15'),
    description: '수영 레슨',
    person: '지윤',
    location: '서리풀수영장',
    period: 3,
    dayOfWeek: [3, 4, 5], // 수목금
    timeSlot: '09:00-11:00'
  },
  {
    id: '48',
    title: '소미아트',
    start: new Date('2025-07-28'),
    end: new Date('2025-08-15'),
    description: '미술 레슨',
    person: '지윤',
    location: '소미아트',
    period: 3,
    dayOfWeek: [3], // 수
    timeSlot: '16:30-18:00'
  },
  {
    id: '49',
    title: '구몬',
    start: new Date('2025-07-28'),
    end: new Date('2025-08-15'),
    description: '구몬 학습',
    person: '지윤',
    location: '구몬',
    period: 3,
    dayOfWeek: [3], // 수
    timeSlot: '19:45-20:00'
  },
  {
    id: '50',
    title: '발레1',
    start: new Date('2025-07-28'),
    end: new Date('2025-08-15'),
    description: '발레 레슨',
    person: '지윤',
    location: '발레 학원',
    period: 3,
    dayOfWeek: [2], // 화
    timeSlot: '15:30-18:00'
  },
  {
    id: '51',
    title: '발레2',
    start: new Date('2025-07-28'),
    end: new Date('2025-08-15'),
    description: '발레 레슨',
    person: '지윤',
    location: '발레 학원',
    period: 3,
    dayOfWeek: [4], // 목
    timeSlot: '16:30-18:00'
  },
  {
    id: '52',
    title: '발레3',
    start: new Date('2025-07-28'),
    end: new Date('2025-08-15'),
    description: '발레 레슨',
    person: '지윤',
    location: '발레 학원',
    period: 3,
    dayOfWeek: [5], // 금
    timeSlot: '15:30-16:30'
  }
];

function App() {
  const [schedules, setSchedules] = useState<Schedule[]>(() => {
    const savedSchedules = localStorage.getItem(STORAGE_KEY);
    if (savedSchedules) {
      return JSON.parse(savedSchedules).map((schedule: any) => ({
        ...schedule,
        start: new Date(schedule.start),
        end: new Date(schedule.end)
      }));
    }
    return initialSchedules;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
  }, [schedules]);

  const handleDeleteEvent = (eventId: string) => {
    setSchedules(schedules.filter(event => event.id !== eventId));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 900, color: '#7c4dff', letterSpacing: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <span role="img" aria-label="rainbow">🌈</span> 2025년 조운, 지윤 여름방학 스케줄 <span role="img" aria-label="school">🏫</span>
        </Typography>
        <Calendar events={schedules} onDeleteEvent={handleDeleteEvent} />
      </Box>
    </Container>
  );
}

export default App; 