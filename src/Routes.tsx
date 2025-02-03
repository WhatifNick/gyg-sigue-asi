import { createBrowserRouter, createHashRouter } from 'react-router-dom';
import App from './App';
import { Results } from './pages/(results)/Results';
import { FormPage } from './pages/(shifts)/FormPage';

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    // errorElement: <PageNotFound />,
    children: [
      {
        path: 'form',
        element: <FormPage />,
      },
      {
        path: 'results',
        element: <Results />,
      },
    ],
  },
]);
