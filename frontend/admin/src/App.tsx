import { Refine } from '@refinedev/core';
import { DevtoolsPanel, DevtoolsProvider } from '@refinedev/devtools';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import { useNotificationProvider } from '@refinedev/antd';
import '@refinedev/antd/dist/reset.css';
import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from '@refinedev/react-router';
import { App as AntdApp } from 'antd';
import { BrowserRouter } from 'react-router';
import { AntdThemeProvider, authProvider, dataProvider } from '@/providers';
import { AppRoutes } from '@/router/app-routes';
import { resources } from '@/resources';

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <AntdThemeProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider(import.meta.env.VITE_API_URL)}
                authProvider={authProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerProvider}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: 'NmiSqJ-VKC5Bn-TvnDvq',
                }}
                resources={resources}
              >
                <AppRoutes />
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </AntdThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
