import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import CreatorDashboard from "./pages/CreatorDashboard";
import UploadPage from "./pages/UploadPage";
import EngagementPage from "./pages/EngagementPage";
import EarningsPage from "./pages/EarningsPage";
import RevenuePage from "./pages/RevenuePage";
import AdminCreatorViewPage from "./pages/AdminCreatorViewPage";

const App = () => (
  <Routes>
    <Route path="/" element={<AuthPage />} />
    <Route
      path="/admin"
      element={
        <ProtectedRoute role="admin">
          <Layout>
            <AdminDashboard />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/creator"
      element={
        <ProtectedRoute role="creator">
          <Layout>
            <CreatorDashboard />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/upload"
      element={
        <ProtectedRoute>
          <Layout>
            <UploadPage />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/earnings"
      element={
        <ProtectedRoute role="creator">
          <Layout>
            <EarningsPage />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/engagement"
      element={
        <ProtectedRoute>
          <Layout>
            <EngagementPage />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/creator/:creatorId"
      element={
        <ProtectedRoute role="admin">
          <Layout>
            <AdminCreatorViewPage />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/revenue"
      element={
        <ProtectedRoute>
          <Layout>
            <RevenuePage />
          </Layout>
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
