export class DataGenerator {

    static randomMobile() {
        return `9${Math.floor(100000000 + Math.random() * 900000000)}`;
    }

    static randomEmail() {
        return `qa${Date.now()}@snapmint.com`;
    }

    static randomOrderId() {
        return `${Math.floor(Math.random() * 999999)}`;
    }

    static randomPan() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';

        let pan_letters_pre = '';
        for (let i = 0; i < 3; i++) {
            pan_letters_pre += letters.charAt(Math.floor(Math.random() * letters.length));
        }

        const pan_letter_five = letters.charAt(Math.floor(Math.random() * letters.length));

        let pan_digits = '';
        for (let i = 0; i < 4; i++) {
            pan_digits += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }

        const pan_letter_last = letters.charAt(Math.floor(Math.random() * letters.length));

        return `${pan_letters_pre}P${pan_letter_five}${pan_digits}${pan_letter_last}`;
    }
}