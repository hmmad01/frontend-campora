/**
 * @file App.tsx
 * @description Komponen root aplikasi yang membungkus seluruh routing menggunakan RouterProvider dari react-router.
 */

import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  return <RouterProvider router={router} />;
}
