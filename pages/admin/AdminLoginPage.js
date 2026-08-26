import { expect } from '@playwright/test';

export class AdminLoginPage {
    constructor(page) {
        this.page = page;
        this.emailInput = page.getByRole('textbox', { name: 'Email*' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password*' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.ssoLoginButton = page.getByText('Sign in with Microsoft', { exact: true });
    }

    async open() {
        await this.page.goto('/admin/login');
    }

    async login(email, password) {
        await this.emailInput.fill(email);
        await this.passwordInput.click();   // Makes the field editable
        await this.passwordInput.fill(password);
        await this.loginButton.click();

        await expect(this.page).toHaveURL(/dashboard|users/);
    }

    async ssoLogin() {
        await this.ssoLoginButton.click();
    }

    async searchUser({ mobile, pan, email } = {}) {
        const params = new URLSearchParams({
            utf8: '✓',
            commit: 'Filter',
            order: 'id_desc',
        });

        if (mobile) params.append('q[mobile_equals]', mobile);
        if (pan) params.append('q[pan_equals]', pan);
        if (email) params.append('q[email_equals]', email);

        await this.page.goto(`/admin/users?${params.toString()}`);

        // Ensure we weren't redirected to login
        await expect(this.page).toHaveURL(/\/admin\/users/);
    }

    async expectNoUserFound() {
        await expect(this.page.getByText('No Users found')).toBeVisible();
    }
}