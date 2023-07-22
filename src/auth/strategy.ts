import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import * as firebase from 'firebase-admin';
import { PrismaService } from 'src/prisma.service';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { Doctor } from '@prisma/client';

const firebase_params = {
  type: process.env.FIREBASE_PROJECT_TYPE,
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, '\n')
    : undefined,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  clientId: process.env.FIREBASE_CLIENT_ID,
  authUri: process.env.FIREBASE_AUTH_URI,
  tokenUri: process.env.FIREBASE_TOKEN_URI,
  authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  clientC509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, 'firebase-auth') {
  private defaultApp: firebase.app.App;

  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
    this.defaultApp = firebase.initializeApp({
      credential: firebase.credential.cert(firebase_params),
    });
  }

  async validate(token: string): Promise<Doctor | DecodedIdToken> {
    const firebaseUser = await this.defaultApp.auth().verifyIdToken(token, true);

    if (!firebaseUser) {
      throw new UnauthorizedException();
    }

    const user = await this.prisma.doctor.findUnique({
      where: { firebaseUserUID: firebaseUser.user_id },
    });

    return user ? user : firebaseUser;
  }
}
