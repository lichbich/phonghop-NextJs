import type { Metadata } from 'next'
import ClientLayout from './clientLayout';
import StoreProvider from '@/providers/StoreProvider';
import { NextIntlClientProvider, useMessages } from 'next-intl';

export const metadata: Metadata = {
    title: "PhongHop.vn",
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: { locale: string }
}) {

    const messages = useMessages();

    return (
        <html lang={params.locale}>
            <body tabIndex={-1}>
                <NextIntlClientProvider locale={params.locale} messages={messages}>
                    <ClientLayout params={params}>
                        <StoreProvider>
                            {children}
                        </StoreProvider>
                    </ClientLayout>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}