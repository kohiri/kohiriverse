import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function GlassCalendar({ memories, onSelectDate, onClose, onResetMemories }) {
  // Find current active month from the memories, or default to September 2026
  const [currentDate, setCurrentDate] = useState(() => {
    if (memories.length > 0) {
      const firstDate = new Date(memories[0].date);
      return new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
    }
    return new Date(2026, 8, 1); // Sept 2026
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Map memories by date string "YYYY-MM-DD"
  const memoryDateMap = {};
  memories.forEach((mem) => {
    if (mem.date) {
      memoryDateMap[mem.date] = mem;
    }
  });

  // Calculate calendar grid days
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    const targetMem = memoryDateMap[dateStr];
    if (targetMem) {
      onSelectDate(targetMem.id);
      onClose();
    }
  };

  // Build grid cells
  const cells = [];
  // Empty leading cells
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push({ key: `empty-${i}`, empty: true });
  }
  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    const hasMemory = !!memoryDateMap[dateStr];

    cells.push({
      key: `day-${day}`,
      day,
      dateStr,
      hasMemory,
      memory: memoryDateMap[dateStr]
    });
  }

  return (
    <div className="calendar-overlay" onClick={onClose}>
      <div className="calendar-panel" onClick={(e) => e.stopPropagation()}>
        <div className="calendar-header">
          <div className="calendar-month-title">
            {monthNames[month]} {year}
          </div>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <button className="calendar-nav-btn" onClick={prevMonth} aria-label="Previous Month">
              <ChevronLeft size={16} />
            </button>
            <button className="calendar-nav-btn" onClick={nextMonth} aria-label="Next Month">
              <ChevronRight size={16} />
            </button>
            <button 
              className="calendar-nav-btn" 
              onClick={onClose} 
              style={{ marginLeft: '6px' }}
              aria-label="Close Calendar"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="calendar-grid-weekdays">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>

        <div className="calendar-grid-days">
          {cells.map((cell) => {
            if (cell.empty) {
              return <div key={cell.key} className="cal-day-cell empty" />;
            }
            return (
              <div
                key={cell.key}
                className={`cal-day-cell ${cell.hasMemory ? 'has-memory' : ''}`}
                onClick={() => cell.hasMemory && handleDayClick(cell.day)}
                title={cell.hasMemory ? `Memory: ${cell.memory.displayDate}` : undefined}
              >
                <span>{cell.day}</span>
                {cell.hasMemory && <div className="cal-memory-indicator" />}
              </div>
            );
          })}
        </div>

        <div className="calendar-legend">
          <span>Dates with memories are marked</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div className="cal-memory-indicator" style={{ position: 'static' }} />
              <span>Active</span>
            </div>
            {onResetMemories && (
              <button 
                type="button" 
                onClick={() => {
                  if (window.confirm("Reset all memories to original defaults?")) {
                    onResetMemories();
                    onClose();
                  }
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.35)',
                  fontSize: '10px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0
                }}
              >
                Restore Defaults
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
