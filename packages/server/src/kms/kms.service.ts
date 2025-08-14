import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeyManagementServiceClient } from '@google-cloud/kms';

@Injectable()
export class KmsService {
  private kmsClient!: KeyManagementServiceClient;
  private keyName!: string;
  constructor(private config: ConfigService) {
    this.kmsClient = new KeyManagementServiceClient();
    this.keyName = this.kmsClient.cryptoKeyPath(
      this.config.get<string>('GOOGLE_CLOUD_PROJECT') || '',
      this.config.get<string>('KMS_LOCATION') || '', // e.g., "asia-southeast1"
      this.config.get<string>('KMS_KEYRING') || '', // e.g., "my-key-ring"
      this.config.get<string>('KMS_KEY') || '' // e.g., "my-key"
    );
  }

  async encrypt(plainText: string): Promise<string> {
    try {
      const plaintextBuffer = Buffer.from(plainText, 'utf-8');
      const [result] = await this.kmsClient.encrypt({
        name: this.keyName,
        plaintext: plaintextBuffer,
      });

      if (!result.ciphertext) {
        throw new Error('KMS encryption failed: ciphertext is undefined');
      }
      return Buffer.from(result.ciphertext).toString('base64');
    } catch (error) {
      throw new HttpException(
        `Error at encrypt: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async decrypt(encryptedText: string): Promise<string> {
    try {
      const ciphertext = Buffer.from(encryptedText, 'base64');
      const [result] = await this.kmsClient.decrypt({
        name: this.keyName,
        ciphertext: ciphertext,
      });

      if (!result.plaintext) {
        throw new Error('KMS decrypt failed: ciphertext is undefined');
      }
      const plaintext = result.plaintext.toString();

      return plaintext;
    } catch (error) {
      throw new HttpException(
        `Error at decrypt: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  maskMiddleFixed(text: string): string {
    if (text.length <= 8) {
      throw new HttpException(
        `Error length not match`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    const start = text.slice(0, 4);
    const end = text.slice(-4);
    return `${start}********${end}`;
  }

  maskAllExceptFirstAndLast4(text: string): string {
    if (text.length <= 8) return '*'.repeat(text.length); // mask everything if too short

    const start = text.slice(0, 4);
    const end = text.slice(-4);
    const maskedMiddle = '*'.repeat(text.length - 8);

    return `${start}${maskedMiddle}${end}`;
  }
}
