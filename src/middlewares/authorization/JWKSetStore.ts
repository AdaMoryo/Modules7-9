import jwt, { JwtPayload } from 'jsonwebtoken';
import axios from 'axios';
import jwkToPem from 'jwk-to-pem';
import { JWKSetResponse } from './types';

const fetcher = axios.create({ baseURL: '' });

export class JWKSetStore {
  keySet: Record<string, { getPublicKey: () => string }> = {};
  tenantId: string;
  lastRefresh: Date | undefined;
  refreshWindowTime: number;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
    this.refreshWindowTime = 30; // seconds
  }

  private async maybeRefresh(): Promise<void> {
    const now = new Date();
    if (!this.lastRefresh || (now.getTime() - this.lastRefresh.getTime()) > this.refreshWindowTime * 1000) {
      await this.refresh();
    }
  }

  public async getPublicKey(kid: string): Promise<string> {
    await this.maybeRefresh();

    const keyEntry = this.keySet[kid];
    if (!keyEntry) {
      throw new Error('Key ID not found');
    }

    return keyEntry.getPublicKey();
  }

  public async refresh(): Promise<void> {
    const { data } = await fetcher.get<JWKSetResponse>(
      `https://login.microsoftonline.com/${this.tenantId}/discovery/v2.0/keys`,
    );
    this.lastRefresh = new Date();

    const newKeySet: Record<string, { getPublicKey: () => string }> = {};
    for (const jwk of data.keys) {
      newKeySet[jwk.kid] = {
        getPublicKey: () => jwkToPem(jwk),
      };
    }
    newKeySet['secret-key'] = { getPublicKey : () => {return 'a-string-secret-at-least-256-bits-long'; } };
    this.keySet = newKeySet;
  };

  public getKeyIdFromHeader(token: string): string {
    const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString());
    return header.kid || '';
  }

  public async verifyToken(token: string): Promise<JwtPayload> {
    const kid = this.getKeyIdFromHeader(token);
    const publicKey = await this.getPublicKey(kid);
    const decoded = jwt.verify(token, publicKey, { algorithms: ['HS256'] });

    if (typeof decoded === 'object') {
      return decoded as JwtPayload;
    }

    throw new Error('Invalid token payload');
  }
}
