import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

export const revalidate = 0;
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata = {
  title: 'MF Sports Injury Rehab | Sydney Sports Physiotherapy & Recovery Clinic',
  description:
    'MF Sports Injury Rehab in Yagoona, Sydney offers expert sports physiotherapy, remedial massage, dry needling, cupping therapy and more. Book your recovery session today.',
  metadataBase: new URL('https://mfsportsinjuryrehab.com.au'),
  openGraph: {
    title: 'MF Sports Injury Rehab | Sydney Sports Physiotherapy & Recovery Clinic',
    description:
      'Expert sports injury rehab, remedial massage and recovery therapy in Yagoona, Sydney.',
    url: 'https://mfsportsinjuryrehab.com.au',
    siteName: 'MF Sports Injury Rehab',
    locale: 'en_AU',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body>{children}</body>
    </html>
  );
}
