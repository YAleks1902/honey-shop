import { createBrowserRouter, Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AuthModal from '@/features/auth/AuthModal';
import HomePage from '@/pages/HomePage';
import CatalogPage from '@/pages/CatalogPage';
import ProductPage from '@/pages/ProductPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrdersPage from '@/pages/account/OrdersPage';
import ProfilePage from '@/pages/account/ProfilePage';
import AddressPage from '@/pages/account/AddressPage';
import BlogPage from '@/pages/BlogPage';
import BlogPostPage from '@/pages/BlogPostPage';
import AboutPage from '@/pages/AboutPage';
import DeliveryPage from '@/pages/DeliveryPage';
import ContactsPage from '@/pages/ContactsPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import NotFoundPage from '@/pages/NotFoundPage';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminProductForm from '@/pages/admin/AdminProductForm';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminCategories from '@/pages/admin/AdminCategories';
import AdminBlog from '@/pages/admin/AdminBlog';
import AdminUsers from '@/pages/admin/AdminUsers';

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AuthModal />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/catalog', element: <CatalogPage /> },
      { path: '/catalog/:slug', element: <ProductPage /> },
      { path: '/cart', element: <CartPage /> },
      { path: '/checkout', element: <CheckoutPage /> },
      { path: '/account/orders', element: <OrdersPage /> },
      { path: '/account/profile', element: <ProfilePage /> },
      { path: '/account/address', element: <AddressPage /> },
      { path: '/blog', element: <BlogPage /> },
      { path: '/blog/:slug', element: <BlogPostPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/delivery', element: <DeliveryPage /> },
      { path: '/contacts', element: <ContactsPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'products', element: <AdminProducts /> },
      { path: 'products/:id', element: <AdminProductForm /> },
      { path: 'orders', element: <AdminOrders /> },
      { path: 'categories', element: <AdminCategories /> },
      { path: 'blog', element: <AdminBlog /> },
      { path: 'users', element: <AdminUsers /> },
    ],
  },
]);
