import jwt, { JwtPayload } from 'jsonwebtoken';

const axios = require('axios').default;

export class JWKSetStore {
  keySet: Record<string ,any>;
  tenantId: string;
  lastRefresh: Date | undefined;
  refreshWindowTime: number;

  constructor(tenantId : string) {
    this.keySet = {};
    this.tenantId = tenantId;
    this.refreshWindowTime = 30; // hypothetic number - 30 seconds
    this.refresh();
  }

  public getPublicKey(kid : string) {
    if(new Date().getTime() - this.lastRefresh!.getTime() < this.refreshWindowTime * 1000) {
      this.refresh();
    }
    const publicKey = this.keySet[kid].getPublicKey();
    if(publicKey) {
      return publicKey;
    } else {
      throw new Error('invalid kid');
    }
  };

  public async refresh() : Promise<void> {
    const newKeySet = await axios.get(`https://login.microsoftonline.com/${this.tenantId}/discovery/v2.0/keys`);
    this.lastRefresh = new  Date();
    this.setKeySet({ newKeySet });
  }

  private setKeySet(newKeySet: Record<string, any>) : void {
    this.keySet = newKeySet;
  }

  public getKeyIdFromHeader(token: string) : string {
    return JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString())['kid']
    || '';
  }

  public verifyToken(token: string): JwtPayload  { // instead of using JWTPayload i can careate an interface that extends it - which would be more fitting to my software
    const kid = this.getKeyIdFromHeader(token);
    const publicKey = this.getPublicKey(kid);
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

    if (typeof decoded === 'object') {
      return decoded as JwtPayload;
    }

    throw new Error('Invalid token payload');
  };
};
