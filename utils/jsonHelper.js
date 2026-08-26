import fs from 'fs';

export class JsonHelper {
  static updateMerchantDemo({ mobile, pan, email }) {
    const file = './test-data/merchantDemo.json';

    const data = JSON.parse(fs.readFileSync(file, 'utf8'));

    if (mobile !== undefined) {
      data.mobile = mobile;
    }

    if (pan !== undefined) {
      data.pan = pan;
    }

    if (email !== undefined) {
      data.email = email;
    }

    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  }
}