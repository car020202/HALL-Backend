import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RolModule } from './rol/rol.module';

@Module({
  imports: [AuthModule, RolModule],
})
export class AppModule {}
