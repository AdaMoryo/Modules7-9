export type JWK = {
    kty: 'RSA';
    kid: string;
    use: string;
    n: string;
    e: string;
    [key: string]: any;
  };

export type JWKSetResponse = {
    keys: JWK[];
  };
