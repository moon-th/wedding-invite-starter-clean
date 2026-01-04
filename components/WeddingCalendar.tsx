// components/WeddingCalendar.tsx
import React from 'react';

type WeddingCalendarProps = {
  year: number;       // 예: 2026
  month: number;      // 예: 5  (1~12)
  weddingDay: number; // 예: 9
};

// 해당 연/월의 달력을 주 단위 배열로 생성
function createCalendar(year: number, month: number): number[][] {
  // month는 1~12, Date는 0~11
  const firstDay = new Date(year, month - 1, 1);
  const firstWeekday = firstDay.getDay(); // 0:일 ~ 6:토
  const lastDate = new Date(year, month, 0).getDate(); // 마지막 날짜

  const weeks: number[][] = [];
  let currentWeek: number[] = [];

  // 1일 앞의 빈칸 채우기
  for (let i = 0; i < firstWeekday; i++) {
    currentWeek.push(0);
  }

  // 실제 날짜 채우기
  for (let day = 1; day <= lastDate; day++) {
    currentWeek.push(day);

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // 마지막 주 남은 칸 0으로 채우기
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(0);
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

export function WeddingCalendar({ year, month, weddingDay }: WeddingCalendarProps) {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const weeks = createCalendar(year, month);

  const weekdayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const weddingDate = new Date(year, month - 1, weddingDay);
  const weddingWeekdayLabel = weekdayNames[weddingDate.getDay()];
  const fullLabel = `${year}년 ${month}월 ${weddingDay}일 ${weddingWeekdayLabel}`;

  return (
    <section className="calendar-section">
      <div className="calendar-inner">
        <p className="eyebrow">Wedding Day</p>
        <p className="calendar-title">{fullLabel}</p>
        <p className="calendar-month-label">{month}월</p>

        <div className="calendar-grid">
          {/* 요일 헤더 */}
          {days.map((d, idx) => (
            <div
              key={d}
              className={
                'calendar-head' +
                (idx === 0 ? ' calendar-sun' : '') +
                (idx === 6 ? ' calendar-sat' : '')
              }
            >
              {d}
            </div>
          ))}

          {/* 날짜 셀 */}
          {weeks.map((week, wi) =>
            week.map((day, di) => {
              if (day === 0) {
                return <div key={`${wi}-${di}`} className="calendar-cell-empty" />;
              }

              const isWeddingDay = day === weddingDay;
              const isSun = di === 0;
              const isSat = di === 6;

              return (
                <div
                  key={`${wi}-${di}`}
                  className={
                    'calendar-cell-day' +
                    (isWeddingDay ? ' calendar-cell-wedding' : '') +
                    (!isWeddingDay && isSun ? ' calendar-sun' : '') +
                    (!isWeddingDay && isSat ? ' calendar-sat' : '')
                  }
                >
                  {day}
                </div>
              );
            }),
          )}
        </div>

       
      </div>
    </section>
  );
}
