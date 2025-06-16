import React, { useEffect, useState } from 'react';
import { Box, Checkbox, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

const TODOS = [
  { text: '영어책 1권 읽기', emoji: '📚', color: '#ffe0b2' },
  { text: '한글책 1권 읽기', emoji: '📖', color: '#c8e6c9' },
  { text: '내셔널 지오그래픽 1권 읽기', emoji: '🌏', color: '#b3e5fc' },
  { text: '구몬 수학 풀기', emoji: '➗', color: '#f8bbd0' },
  { text: '워들리 와이즈 2쪽 풀기', emoji: '📝', color: '#fff9c4' },
];

interface TodoListProps {
  person: '조운' | '지윤';
  date: string; // yyyy-MM-dd
  month: string; // yyyy-MM
}

const getStorageKey = (person: string, date: string) => `todo-${person}-${date}`;

const TodoList: React.FC<TodoListProps> = ({ person, date, month }) => {
  const [checked, setChecked] = useState<boolean[]>([false, false, false, false, false]);

  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey(person, date));
    if (saved) {
      setChecked(JSON.parse(saved));
    } else {
      setChecked([false, false, false, false, false]);
    }
  }, [person, date]);

  const handleToggle = (idx: number) => {
    const newChecked = [...checked];
    newChecked[idx] = !newChecked[idx];
    setChecked(newChecked);
    localStorage.setItem(getStorageKey(person, date), JSON.stringify(newChecked));
  };

  // 오늘의 점수
  const todayScore = checked.filter(Boolean).length * 20;

  // 이달의 점수 계산
  const getMonthScore = () => {
    let total = 0;
    // 해당 월의 1~31일 모두 조회
    for (let d = 1; d <= 31; d++) {
      const dayStr = `${month}-${d.toString().padStart(2, '0')}`;
      const saved = localStorage.getItem(getStorageKey(person, dayStr));
      if (saved) {
        const arr = JSON.parse(saved);
        total += arr.filter((v: boolean) => v).length * 20;
      }
    }
    return total;
  };
  const monthScore = getMonthScore();

  return (
    <Box sx={{ mb: 2, alignItems: 'flex-start' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>{person} To do list</Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        오늘의 점수: <b>{todayScore}</b>점 / 이달의 점수: <b>{monthScore}</b>점
      </Typography>
      <List dense>
        {TODOS.map((todo, idx) => (
          <ListItem
            key={todo.text}
            disablePadding
            sx={{
              py: 0,
              minHeight: 0,
              mb: 0,
              '&:not(:last-child)': { marginBottom: 0 },
              background: checked[idx] ? todo.color : '#fff',
              borderRadius: 2,
              transition: 'background 0.2s',
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, ml: 1, mr: 0 }}>
              <Checkbox
                edge="start"
                checked={checked[idx]}
                tabIndex={-1}
                disableRipple
                onChange={() => handleToggle(idx)}
                sx={{ color: checked[idx] ? '#ff9800' : undefined }}
              />
            </ListItemIcon>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{ fontSize: 22, marginRight: 4 }}>{todo.emoji}</span>
              <ListItemText
                primary={todo.text}
                sx={{
                  textDecoration: checked[idx] ? 'line-through' : 'none',
                  color: checked[idx] ? 'text.disabled' : 'text.primary',
                  fontWeight: 500,
                  fontSize: 16,
                }}
              />
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TodoList; 