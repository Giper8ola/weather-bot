import { Module } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';
import { UtilsModule } from './utils/utils.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TelegramModule,
        UtilsModule,
        CacheModule.register({
            isGlobal: true
        })
    ]
})
export class AppModule {}
