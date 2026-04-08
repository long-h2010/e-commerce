import { themeStore } from "@/stores";
import { RefineThemes } from "@refinedev/antd";
import { ConfigProvider, theme } from "antd";

export const AntdThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { mode } = themeStore();

  return (
    <ConfigProvider
      theme={{
          ...RefineThemes.Blue,
        algorithm:
          mode === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
};
