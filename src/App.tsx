import { Navigate, Outlet, useLocation } from 'react-router-dom';
import './App.css';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isoWeek from 'dayjs/plugin/isoWeek';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import weekday from 'dayjs/plugin/weekday';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { NavLink } from './components/navigation/NavLink';

function App() {
  const location = useLocation();

  // Use the plugins with dayjs
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(isoWeek);
  dayjs.extend(localizedFormat);
  dayjs.extend(weekday);
  dayjs.extend(isSameOrBefore);

  if (location?.pathname === '/') {
    return <Navigate to="/form" replace />;
  }

  return (
    <>
      <div id="App">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffd204',
            margin: '-1rem -1.5rem 1rem -1.5rem',
            position: 'relative',
            height: '3rem',
            zIndex: 1001,
            padding: '0.5rem 1rem 0rem 1rem',
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem' }}>
            <NavLink to="/form" label="Form" />
            <NavLink to="/results" label="Results" />
          </div>
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default App;
