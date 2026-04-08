import { Logo } from '@/components/atoms';
import { Header } from '@/components/organisms';
import { ResourceName } from '@/lib/constants';
import { ThemedLayout, ThemedSider } from '@refinedev/antd';
import { Authenticated } from '@refinedev/core';
import { Outlet, Route, Routes } from 'react-router';
import { Login } from '@/pages/login';
import { Dashboard } from '@/pages/dashboard';
import { UserCreate, UserEdit, UserList, UserShow } from '@/pages/users';
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from '@/pages/categories';
import {
  ProductCreate,
  ProductEdit,
  ProductList,
  ProductShow,
} from '@/pages/products';
import Temp from '@/pages/temp';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route
        element={
          <ThemedLayout
            Header={(props) => <Header {...props} />}
            Sider={(props) => (
              <ThemedSider {...props} fixed Title={() => <Logo />} />
            )}
          >
            <Authenticated redirectOnFail='/login' key={'app'}>
              <Outlet />
            </Authenticated>
          </ThemedLayout>
        }
      >
        <Route index element={<Dashboard />} />

        <Route path={ResourceName.USERS}>
          <Route index element={<UserList />} />
          <Route path='create' element={<UserCreate />} />
          <Route path='show/:id' element={<UserShow />} />
          <Route path='edit/:id' element={<UserEdit />} />
        </Route>

        <Route path={ResourceName.CATEGORIES}>
          <Route index element={<CategoryList />} />
          <Route path='create' element={<CategoryCreate />} />
          <Route path='show/:id' element={<CategoryShow />} />
          <Route path='edit/:id' element={<CategoryEdit />} />
        </Route>

        <Route path={ResourceName.PRODUCTS}>
          <Route index element={<ProductList />} />
          <Route path='create' element={<ProductCreate />} />
          <Route path='show/:id' element={<ProductShow />} />
          <Route path='edit/:id' element={<ProductEdit />} />
        </Route>
      </Route>

      <Route path='temp' element={<Temp />} />
    </Routes>
  );
};
