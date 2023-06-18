import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import * as firebase from 'firebase-admin';

const firebase_params = {
  projectId: 'amia-74eee',
  privateKey:
    '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCqjRMAFr+ykccQ\n3u1sy9Vo87VgVJMxv5QNpQALS65n7746Jr3F9dDVnZ3lKYHUSCnuhpWWsgrVYuKJ\ndzPgTbwem+7wErQuMXgGk3tBTgqfCJMRZtrgwL5XuiVtbzEu5Icr6x8B5K2CJBV1\nwx2KZDUgG9MayMZ/Rp0lWteCKFRGIgpKf4eVbDrtSOlOq6HyO0CkoCJhMx5TdCI2\nXGCol9qC3jsz3Du3pAiBPg+c4YnJbw4jiK9La+tsSPf2H1XgO9de0s/VHL81CcGY\n6+wfdNeUip2i2211NRG20tXl/O5f6btBPlPLSz+ORSG+US2QmMxYR1dDZO++eVG0\n0UHixTahAgMBAAECggEAPvEqinVa0PGo6EqFkAnX3FBY51C/M/RylOiIkCKhnn0l\nlLt4fQb/x95QB+NeJTRuuTdVHJTfl6nTVg02iXjWzOsabuJQOd4K4E5shgjhtZiK\nAjmV3K11cdXiezU2jwpK8oPm4SF+gVGE0/2quMjLrGpoafGgBBfQ5hjVARWWKH1K\nxVcaIvdoUepsof74lfUC56jVG2zBD+iWA/Sw3OGykqZc2VUbi5TJ6slOdioXBbS9\nRd3j94ZUdPFQmPaEdrqvoEnefudW06cAN92i9gFY3u9sIAKPKQzMIzsQ4cwpya0g\nFpvCRlaDJ0uQQuVkroIu9P1u6E5eT2LLXTa3STPNKwKBgQDxCvEk1jt8vunPKHbp\nmNkE8CZnc5fBboqHXGrkIpjOC+YW416InpdZtz8hGp9Xp8HGuq8+7233ft9N0pL7\n2iDLNjg+ezLh0lT7b27ejdGMfxMUf3R1MxxaJSLX/r18+WPglrZ1cRh61Fqnl16n\nehCFtGP1CO4cT3PwGRboEh8KBwKBgQC1Ilg0T/FCg8I5hbVBo/B30/TS+oALbJkO\n62vZeD8ZzCMzA5yPTKJrqBYWdx4w4n7nTqa1pVVlbS9ZbgOBqkjEtszYljWcFyP5\nruFQ03mXjaOpV5N/IQPxcx4VnSVV6hlCsqlDfZ8Oxt/OtiMS3J8Bn2bOY1PisZcx\n4hI08JYwFwKBgHAPajR59IX2K7THVyEakiodi30k3DRtM7HiYT9WZjvEhF+3rMdP\nE4X+DzdQrSuPLiM5vyc/IJyjOyVu9C5qJjzTJCrIE8uwgRmzoJOO0xDCMxigeH/U\nFyZBhYVtRKLJPom3B3Rp87uG5e5sDPFHak7+oknUsP4wYfIJeADEC/IZAoGATI+w\nwqPLsTaqANBQVedqe+u+PvMc7jc/1ruRgYE/ArNzaVuscDGPMXwBogtFWppR04k+\nE+dHWjC1Y9KJbuRAD83Idf+/tzNcxGuz1wscCQAYXjqjIIge946V98LNhiwF81g7\nDUjq0z8iWGhKGO3h07jBppj7WwV/h9krou7SPI8CgYB2wt7ipsvnCV8aADZ51GFr\nkAm8x28oS2vfc+oJCL62pLNWLRPJMz/Elo7oweWlXfAT4/49xP4cYdBC5kn2/Ghi\nbXHofxwn/JlbB9LoKw5kss6ir0b4YaZr5nBablw2xNNCz2yy4IbVbvr0P9tWVuTo\nulzaHB+b0WtomVrOcXhbMw==\n-----END PRIVATE KEY-----\n',
  clientEmail: 'firebase-adminsdk-rkljc@amia-74eee.iam.gserviceaccount.com',
};

// const firebase_params = {
//   type: process.env.FIREBASE_PROJECT_TYPE,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
//   privateKey: process.env.FIREBASE_PRIVATE_KEY,
//   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//   clientId: process.env.FIREBASE_CLIENT_ID,
//   authUri: process.env.FIREBASE_AUTH_URI,
//   tokenUri: process.env.FIREBASE_TOKEN_URI,
//   authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
//   clientC509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
// };

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  private defaultApp: any;
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
    this.defaultApp = firebase.initializeApp({
      credential: firebase.credential.cert(firebase_params),
    });
  }

  async validate(token: string) {
    const firebaseUser: any = await this.defaultApp
      .auth()
      .verifyIdToken(token, true)
      .catch((err) => {
        throw new UnauthorizedException(err.message);
      });
    if (!firebaseUser) {
      throw new UnauthorizedException();
    }
    return firebaseUser;
  }
}
