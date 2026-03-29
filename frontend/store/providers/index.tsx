import NextIntlProvider from './next-intl-provider';
import AntdProvider from './antd-provider';
import QueryProvider from './query-provider';

type Props = {
  children: React.ReactNode;
  locale: string;
  messages: any;
};

export default function Providers({ children, locale, messages }: Props) {
  return (
    <NextIntlProvider locale={locale} messages={messages}>
      <AntdProvider>
        <QueryProvider>{children}</QueryProvider>
      </AntdProvider>
    </NextIntlProvider>
  );
}
