import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import AddBookPage from './pages/AddBookPage'
import LibraryPage from './pages/LibraryPage'
import IssueBookPage from './pages/IssueBookPage'
import ReturnBookPage from './pages/ReturnBookPage'
import IssuedBooksTrackingPage from './pages/IssuedBooksTrackingPage'
import AvailableBooksPage from './pages/AvailableBooksPage'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import { RequireAuth, RequireRole } from './auth/RequireAuth'
import MyIssuedBooksPage from './pages/MyIssuedBooksPage'
import HomeRedirect from './auth/HomeRedirect'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/" element={<HomeRedirect />} />

          <Route element={<AppLayout />}>
            {/* Student-accessible */}
            <Route path="/books/available" element={<AvailableBooksPage />} />
            <Route path="/books" element={<LibraryPage />} />
            <Route path="/my/issued" element={<MyIssuedBooksPage />} />

            {/* Admin-only */}
            <Route element={<RequireRole role="ADMIN" />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/books/add" element={<AddBookPage />} />
              <Route path="/books/issue" element={<IssueBookPage />} />
              <Route path="/books/return" element={<ReturnBookPage />} />
              <Route path="/issued" element={<IssuedBooksTrackingPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
