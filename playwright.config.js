import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    timeout: 120000,

    reporter: [
        ['html'],
        ['allure-playwright'],
    ],

    projects: [
        {
            name: 'website',
            use: {
                baseURL: process.env.WEBSITE_BASE_URL,
                headless: false,
                actionTimeout: 60000,
                navigationTimeout: 60000,
            },
        },
        {
            name: 'merchant-demo',
            use: {
                baseURL: process.env.MERCHANT_DEMO_BASE_URL,
                httpCredentials: {
                    username: process.env.BASIC_AUTH_USER,
                    password: process.env.BASIC_AUTH_PASSWORD,
                },
                headless: false,
                actionTimeout: 60000,
                navigationTimeout: 60000,
            },
        },
    ],
});