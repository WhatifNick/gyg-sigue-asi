import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { ShiftForm } from './pages/(shifts)/ShiftForm';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    // errorElement: <PageNotFound />,
    children: [
      {
        path: 'form',
        element: <ShiftForm />,
      },
      {
        path: 'results',
        element: <div>Results shown here</div>,
      },
    ],
  },
]);
