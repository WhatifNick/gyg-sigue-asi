import { Navigate, Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  const location = useLocation();
  console.log(111, location);

  if (location?.pathname === '/') {
    return <Navigate to="/form" replace />;
  }
  console.log(222, location);
  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
