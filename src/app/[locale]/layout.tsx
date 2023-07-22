import {useLocale} from 'next-intl';

export default function LocaleLayout({children, params}) {
  const locale = useLocale();
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
