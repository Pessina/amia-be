import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma.service';
import { FirebaseAuthStrategy } from './auth/strategy';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, FirebaseAuthStrategy],
})
export class AppModule {}
