'use client'
import { NextPage } from 'next';
import { useAppSelector } from '@/lib/hooks'
import {useLocale, useTranslations} from 'next-intl';

const HomePage = () => {

    // const t = useTranslations('Index');
    // const locale = useLocale();
    // const user = useAppSelector((state) => state.user)
    return (
        <div>
            {/* {user.value} */}
            {/* {t('title')} */}
            {/* {locale} */}
        </div>
    );
};

export default HomePage;
