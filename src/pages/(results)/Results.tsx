import React, { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import supabase from 'src/supabase-client';
import { Shift } from 'src/types/shift';
import { ConfirmModal } from 'src/components/modals/ConfirmModal';
import { ShiftForm } from '../(shifts)/ShiftForm';

// 🌟 Responsive Styling
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableWrapper: {
    width: '100%',
    overflowX: 'auto', // Allows horizontal scrolling on small screens
  },
  table: {
    width: '100%',
    // minWidth: '400px', // Prevents columns from squishing too much
    borderCollapse: 'collapse' as const,
    border: '1px solid #ddd',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  th: {
    backgroundColor: '#ffd204',
    color: '#000',
    padding: '12px',
    textAlign: 'center' as const,
    fontSize: '18px',
  },
  tr: {
    transition: 'background-color 0.3s ease-in-out',
  },
  td: {
    padding: '0.75rem 0',
    textAlign: 'center' as const,
    fontSize: '16px',
    borderBottom: '1px solid #ddd',
    cursor: 'pointer',
  },
  tdHover: {
    backgroundColor: '#f1f1f1',
  },
  // Media Queries for Mobile Devices
  // '@media (max-width: 600px)': {
  //   th: {
  //     fontSize: '14px',
  //     padding: '8px',
  //   },
  //   td: {
  //     fontSize: '14px',
  //     padding: '8px',
  //   },
  //   table: {
  //     minWidth: '100%', // Allows the table to be scrollable on small screens
  //     padding: '0.5rem',
  //   },
  // },
};

export const Results = () => {
  const [startOfWeek, setStartOfWeek] = useState(dayjs().startOf('isoWeek'));
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedShifts, setSelectedShifts] = useState<Shift[]>([]);
  const [daysOfWeek, setDaysOfWeek] = useState<{ day: string; date: Dayjs }[]>([
    { day: 'Monday', date: dayjs().startOf('isoWeek') },
    { day: 'Tuesday', date: dayjs().startOf('isoWeek').add(1, 'day') },
    { day: 'Wednesday', date: dayjs().startOf('isoWeek').add(2, 'day') },
    { day: 'Thursday', date: dayjs().startOf('isoWeek').add(3, 'day') },
    { day: 'Friday', date: dayjs().startOf('isoWeek').add(4, 'day') },
    { day: 'Saturday', date: dayjs().startOf('isoWeek').add(5, 'day') },
    { day: 'Sunday', date: dayjs().startOf('isoWeek').add(6, 'day') },
  ]);

  // ✨ Adding Hover Effect via Inline Styles
  const applyHoverEffect = () => {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((row) => {
      row.addEventListener(
        'mouseover',
        () => ((row as HTMLElement).style.backgroundColor = '#f8f9fa')
      );
      row.addEventListener(
        'mouseout',
        () => ((row as HTMLElement).style.backgroundColor = 'transparent')
      );
    });
  };

  // 🎬 Apply hover effect when the component mounts
  useEffect(() => {
    applyHoverEffect();
  }, []);

  useEffect(() => {
    fetchShifts();
  }, [startOfWeek]);

  const updateWeek = (direction: 'next' | 'prev') => {
    let nextStartOfWeek;
    if (direction === 'prev') nextStartOfWeek = startOfWeek.subtract(1, 'week');
    else nextStartOfWeek = startOfWeek.add(1, 'week');
    setStartOfWeek(nextStartOfWeek);

    setDaysOfWeek([
      { day: 'Monday', date: dayjs(nextStartOfWeek).startOf('isoWeek') },
      { day: 'Tuesday', date: dayjs(nextStartOfWeek).startOf('isoWeek').add(1, 'day') },
      { day: 'Wednesday', date: dayjs(nextStartOfWeek).startOf('isoWeek').add(2, 'day') },
      { day: 'Thursday', date: dayjs(nextStartOfWeek).startOf('isoWeek').add(3, 'day') },
      { day: 'Friday', date: dayjs(nextStartOfWeek).startOf('isoWeek').add(4, 'day') },
      { day: 'Saturday', date: dayjs(nextStartOfWeek).startOf('isoWeek').add(5, 'day') },
      { day: 'Sunday', date: dayjs(nextStartOfWeek).startOf('isoWeek').add(6, 'day') },
    ]);
  };

  const fetchShifts = async () => {
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .gte('shift_date', startOfWeek) // Greater than or equal to startDate
      .lte('shift_date', startOfWeek.add(6, 'day')); // Less than or equal to endDate
    if (error) console.error('Error fetching shifts:', error);
    if (data) setShifts(data);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2>Results</h2>
        <div style={{ display: 'flex', alignItems: 'center', margin: '0 auto' }}>
          <IconButton onClick={() => updateWeek('prev')}>
            <ArrowBackIosNew />
          </IconButton>
          <h3>Week of {startOfWeek.format('DD-MM-YYYY')}</h3>
          <IconButton onClick={() => updateWeek('next')}>
            <ArrowForwardIos />
          </IconButton>
        </div>
      </div>
      <div style={styles.container}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Day</th>
              <th style={styles.th}>Open</th>
              <th style={styles.th}>Mid</th>
              <th style={styles.th}>Close</th>
            </tr>
          </thead>
          <tbody>
            {daysOfWeek.map((day) => {
              const shiftsForDay = (type: number) =>
                shifts.filter((shift) => {
                  const shiftDate = dayjs(shift.shift_date);
                  return shiftDate.isSame(day.date, 'day') && shift.shift_type === type;
                });
              /* shift_type 0 = Open 1 = Mid 2 = Close */
              const openShifts = shiftsForDay(0);
              const mostRecentOpenShift = openShifts[openShifts.length - 1];
              const midShifts = shiftsForDay(1);
              const mostRecentMidShift = midShifts[midShifts.length - 1];
              const closeShifts = shiftsForDay(2);
              const mostRecentCloseShift = closeShifts[closeShifts.length - 1];
              return (
                <tr key={day.day} style={styles.tr}>
                  <td style={styles.td}>
                    {day.day}
                    <br />({day.date.format('DD-MM')})
                  </td>
                  <td
                    style={styles.td}
                    onClick={() => openShifts.length && setSelectedShifts(openShifts)}
                  >
                    <div>{mostRecentOpenShift?.score}</div>
                    <div>{mostRecentOpenShift?.shift_leader}</div>
                  </td>
                  <td
                    style={styles.td}
                    onClick={() => midShifts.length && setSelectedShifts(midShifts)}
                  >
                    <div>{mostRecentMidShift?.score}</div>
                    <div>{mostRecentMidShift?.shift_leader}</div>
                  </td>
                  <td
                    style={styles.td}
                    onClick={() => closeShifts.length && setSelectedShifts(closeShifts)}
                  >
                    <div>{mostRecentCloseShift?.score}</div>
                    <div>{mostRecentCloseShift?.shift_leader}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        isOpen={selectedShifts.length > 0}
        onCancel={() => setSelectedShifts([])}
        cancelBtnText="close"
        headerText={`Score: ${selectedShifts[selectedShifts.length - 1]?.score}`}
      >
        {/* <div style={{ textAlign: 'center' }}>
          <h2>Score: {selectedShifts[selectedShifts.length - 1]?.score}</h2>
        </div> */}
        <ShiftForm shift={selectedShifts[selectedShifts.length - 1]} />
      </ConfirmModal>
    </>
  );
};
