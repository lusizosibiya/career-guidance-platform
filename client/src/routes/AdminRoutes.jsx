import { Route } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import InstitutionsPage from "../pages/admin/InstitutionsPage";
import CoursesPage from "../pages/admin/CoursesPage";

const adminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="institutions" element={<InstitutionsPage />} />
    <Route path="courses" element={<CoursesPage />} />
  </Route>
);

export default adminRoutes;