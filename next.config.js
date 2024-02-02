/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();

const nextConfig = withNextIntl({
    env: {
        API_URL: process.env.API_URL
    }
})

module.exports = nextConfig
