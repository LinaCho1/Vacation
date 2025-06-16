import React, { useState } from 'react';
import { Paper, Box, Typography, Button, Chip, IconButton } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Schedule } from '../types';
import { format, getDay, differenceInMinutes } from 'date-fns';
import TodoList from './TodoList';
import { format as formatDate } from 'date-fns';

interface CalendarProps {
  events: Schedule[];
  onDeleteEvent: (eventId: string) => void;
}

const SLOT_HEIGHT = 48; // 1시간 슬롯의 높이(px)
const PERSONS = ['조운', '지윤'] as const;

type Person = typeof PERSONS[number];

function Calendar({ events, onDeleteEvent }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const getEventsForDate = (date: Date): Schedule[] => {
    const dayOfWeek = getDay(date); // 0: 일요일, 1: 월요일, ..., 6: 토요일
    return events.filter((event: Schedule) => {
      // 해당 날짜가 이벤트 기간 내에 있는지 확인
      const isInPeriod = date >= event.start && date <= event.end;
      // 해당 요일에 수업이 있는지 확인
      const isOnDay = event.dayOfWeek.includes(dayOfWeek);
      return isInPeriod && isOnDay;
    }).sort((a: Schedule, b: Schedule) => {
      const timeA = a.timeSlot.split('-')[0];
      const timeB = b.timeSlot.split('-')[0];
      return timeA.localeCompare(timeB);
    });
  };

  // 오전 8시부터 저녁 9시까지 1시간 단위로 시간대 생성
  const timeSlots = Array.from({ length: 14 }, (_, i) =>
    `${(i + 8).toString().padStart(2, '0')}:00`
  );

  const filteredEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  // 시간 문자열(HH:MM)을 Date 객체로 변환 (선택한 날짜 기준)
  const getSlotDate = (baseDate: Date, time: string) => {
    const [hour, minute] = time.split(':');
    const d = new Date(baseDate);
    d.setHours(Number(hour), Number(minute), 0, 0);
    return d;
  };

  // 각 슬롯마다 해당 슬롯이 일정의 범위(시작~끝)에 걸쳐 있으면 반환
  const getEventsInSlotByPerson = (slotTime: string) => {
    const slotStart = getSlotDate(selectedDate!, slotTime);
    const nextSlot = getSlotDate(selectedDate!, `${(parseInt(slotTime.split(':')[0]) + 1).toString().padStart(2, '0')}:00`);
    const result: { [person in Person]: { event: Schedule, isStart: boolean, isEnd: boolean, height: number } | null } = { '조운': null, '지윤': null };
    filteredEvents.forEach(event => {
      const [startStr, endStr] = event.timeSlot.split('-');
      const eventStart = getSlotDate(selectedDate!, startStr);
      const eventEnd = getSlotDate(selectedDate!, endStr);
      // 이 슬롯이 일정의 범위에 걸쳐 있으면
      if (slotStart < eventEnd && nextSlot > eventStart) {
        const isStart = eventStart >= slotStart && eventStart < nextSlot;
        const isEnd = eventEnd > slotStart && eventEnd <= nextSlot;
        // 이 슬롯에서 차지하는 높이 계산
        let minutes = 60;
        if (isStart && isEnd) {
          minutes = differenceInMinutes(eventEnd, eventStart);
        } else if (isStart) {
          minutes = differenceInMinutes(nextSlot, eventStart);
        } else if (isEnd) {
          minutes = differenceInMinutes(eventEnd, slotStart);
        }
        result[event.person as Person] = { event, isStart, isEnd, height: (minutes / 60) * SLOT_HEIGHT };
      }
    });
    return result;
  };

  // borderRadius 스타일 (시작/끝/한칸짜리)
  const getSlotBoxRadius = (isStart: boolean, isEnd: boolean) => {
    if (isStart && isEnd) return '12px';
    if (isStart) return '12px 12px 0 0';
    if (isEnd) return '0 0 12px 12px';
    return '0';
  };

  // 요일 한글 변환 함수
  const getKoreanDay = (date: Date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[getDay(date)];
  };

  // 도우미 안내표
  const helpers = [
    { day: '월요일', name: '엄마' },
    { day: '화요일', name: '친할머니' },
    { day: '수요일', name: '아빠' },
    { day: '목요일', name: '이모님' },
    { day: '금요일', name: '외할머니' },
  ];

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2, background: 'linear-gradient(135deg, #fffde4 0%, #f9f6ff 100%)' }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 320, ml: 2 }}>
          <DateCalendar
            value={selectedDate}
            onChange={(newDate: Date | null) => setSelectedDate(newDate)}
          />
          {/* 선택된 날짜의 To do list */}
          {selectedDate && (
            <Box sx={{ mt: 2, width: '100%' }}>
              <TodoList person="조운" date={formatDate(selectedDate, 'yyyy-MM-dd')} month={formatDate(selectedDate, 'yyyy-MM')} />
              <TodoList person="지윤" date={formatDate(selectedDate, 'yyyy-MM-dd')} month={formatDate(selectedDate, 'yyyy-MM')} />
            </Box>
          )}
        </Box>
        <Box sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#7c4dff', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 1, fontSize: '2rem' }}>
            {selectedDate
              ? `${format(selectedDate, 'yyyy년 MM월 dd일')} (${getKoreanDay(selectedDate)}) 🌈`
              : '날짜를 선택하세요'}
          </Typography>
          {/* 도우미 안내표 */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            {helpers.map((helper, idx) => {
              const emojis = ['👩‍👧', '👵', '👨‍👧', '👩‍🦰', '👵'];
              const bgColors = ['#ffe0b2', '#b3e5fc', '#c8e6c9', '#f8bbd0', '#ffe066'];
              return (
                <Box key={helper.day} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: bgColors[idx], borderRadius: 2, px: 2, py: 0.5, fontSize: 15, minWidth: 70 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{emojis[idx]} {helper.day}</Typography>
                  <Typography sx={{ fontSize: 14 }}>{helper.name}</Typography>
                </Box>
              );
            })}
          </Box>
          {/* 상단에 조운/지윤 컬러 라벨 */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Chip label="조운" sx={{ bgcolor: '#b3e5fc', color: '#222', fontWeight: 700, borderRadius: 2, px: 2, fontSize: 15 }} />
            <Chip label="지윤" sx={{ bgcolor: '#f8bbd0', color: '#222', fontWeight: 700, borderRadius: 2, px: 2, fontSize: 15 }} />
          </Box>
          <Box>
            {timeSlots.map((timeSlot) => {
              const eventsByPerson = getEventsInSlotByPerson(timeSlot);
              // 각 인물별로 해당 슬롯에서 시작하는 일정의 height를 구함
              const slotHeights = PERSONS.map(person => {
                const info = eventsByPerson[person];
                if (info && info.isStart) {
                  // 시작 슬롯이면 height 반환
                  const event = info.event;
                  const [startStr, endStr] = event.timeSlot.split('-');
                  const eventStart = getSlotDate(selectedDate!, startStr);
                  const eventEnd = getSlotDate(selectedDate!, endStr);
                  return (differenceInMinutes(eventEnd, eventStart) / 60) * SLOT_HEIGHT;
                }
                return SLOT_HEIGHT;
              });
              const maxSlotHeight = Math.max(...slotHeights, SLOT_HEIGHT);
              return (
                <Box key={timeSlot} sx={{ mb: 0, display: 'flex', alignItems: 'flex-start', borderLeft: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0', position: 'relative', p: 0, minHeight: `${SLOT_HEIGHT}px` }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ width: 60, minWidth: 60, textAlign: 'right', pt: '12px', zIndex: 2, background: '#fff', m: 0, p: 0, mr: 2 }}>
                    {timeSlot}
                  </Typography>
                  <Box sx={{ flex: 1, ml: 0, display: 'flex', gap: 0, position: 'relative', p: 0, m: 0, zIndex: 1 }}>
                    {PERSONS.map(person => {
                      const info = eventsByPerson[person];
                      if (info) {
                        const { event, isStart, isEnd } = info;
                        // height 계산
                        const slotStart = getSlotDate(selectedDate!, timeSlot);
                        const nextSlot = getSlotDate(selectedDate!, `${(parseInt(timeSlot.split(':')[0]) + 1).toString().padStart(2, '0')}:00`);
                        const [startStr, endStr] = event.timeSlot.split('-');
                        const eventStart = getSlotDate(selectedDate!, startStr);
                        const eventEnd = getSlotDate(selectedDate!, endStr);
                        let height = SLOT_HEIGHT;
                        let top = 0;
                        if (isStart && isEnd) {
                          height = (differenceInMinutes(eventEnd, eventStart) / 60) * SLOT_HEIGHT;
                          top = (differenceInMinutes(eventStart, slotStart) / 60) * SLOT_HEIGHT;
                        } else if (isStart) {
                          height = (differenceInMinutes(nextSlot, eventStart) / 60) * SLOT_HEIGHT;
                          top = (differenceInMinutes(eventStart, slotStart) / 60) * SLOT_HEIGHT;
                        } else if (isEnd) {
                          height = (differenceInMinutes(eventEnd, slotStart) / 60) * SLOT_HEIGHT;
                        } else {
                          height = SLOT_HEIGHT;
                        }
                        // 30분 시작일 경우 Paper/텍스트 Box의 height/top을 50%/50%로 조정
                        let paperTop = 0;
                        let paperHeight = '100%';
                        if (isStart) {
                          const [, startMinute] = event.timeSlot.split('-')[0].split(':');
                          if (parseInt(startMinute, 10) === 30) {
                            paperTop = SLOT_HEIGHT / 2;
                            paperHeight = '50%';
                          }
                        }
                        // 활동별 이모지 매핑
                        const activityEmojis: { [key: string]: string } = {
                          '피아노': '🎹',
                          '삼성레포츠 수영': '🏊',
                          '서리풀수영장': '🏊',
                          '소미아트': '🎨',
                          '구몬': '📒',
                          '축구대표팀': '⚽',
                          '축구': '⚽',
                          '축구1:1': '⚽',
                          '방문과외': '👩‍🏫',
                          '발레1': '🩰',
                          '발레2': '🩰',
                          '발레3': '🩰',
                        };
                        return (
                          <Box key={event.id + '-' + timeSlot} sx={{ width: '50%', height: `${height}px`, position: 'relative', p: 0, m: 0 }}>
                            {/* 항상 배경용 Paper 렌더링 */}
                            <Paper
                              sx={{
                                bgcolor: person === '조운' ? '#b3e5fc' : '#f8bbd0',
                                height: paperHeight,
                                minHeight: '24px',
                                width: '100%',
                                borderRadius: 3,
                                boxShadow: '0 2px 8px 0 #e1bee7',
                                border: 'none',
                                position: 'absolute',
                                top: paperTop,
                                left: 0,
                                m: 0,
                                zIndex: 1,
                                overflow: 'visible',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {/* 삭제 버튼은 isStart일 때만, Paper 내부 오른쪽 상단에 */}
                              {isStart && (
                                <>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => onDeleteEvent(event.id)}
                                    sx={{ position: 'absolute', top: 4, right: 4, zIndex: 2, bgcolor: '#fff', borderRadius: 2 }}
                                  >
                                    <Typography component="span" sx={{ fontSize: 14, fontWeight: 'bold', lineHeight: 1 }}>×</Typography>
                                  </IconButton>
                                  <Box sx={{
                                    p: 1, pr: 4,
                                    width: '100%',
                                    height: '100%',
                                    overflow: 'visible',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
                                    <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700, fontSize: 18 }}>
                                      <span style={{ fontSize: 22 }}>{activityEmojis[event.title] || ''}</span>
                                      {event.title}
                                      <Chip
                                        label={person}
                                        size="small"
                                        sx={{ ml: 1, mr: 1, bgcolor: person === '조운' ? '#90caf9' : '#f48fb1', color: '#222', fontWeight: 700, borderRadius: 2, px: 1, fontSize: 15 }}
                                      />
                                      {event.timeSlot}
                                    </Typography>
                                  </Box>
                                </>
                              )}
                            </Paper>
                          </Box>
                        );
                      } else {
                        return <Box key={person + '-' + timeSlot} sx={{ width: '50%', height: `${SLOT_HEIGHT}px`, p: 0, m: 0, position: 'relative', zIndex: 1, background: 'transparent' }} />;
                      }
                    })}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default Calendar; 