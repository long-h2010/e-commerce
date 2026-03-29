import { NextIntlClientProvider } from 'next-intl';

type Props = {
  children: React.ReactNode;
  locale: string;
  messages: any;
};

export default function NextIntlProvider({ children, locale, messages }: Props) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
