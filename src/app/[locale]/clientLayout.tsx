"use client"

import React, { ReactElement, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ClientLayout({
    children,
    params
}: {
    children: ReactElement
    params: { locale: string }
}) {
    useEffect(() => {
        require('bootstrap/dist/js/bootstrap.bundle.min.js')
    }, []);

    return (
        <div key={'body'}>
            {children}
        </div>
    )
}