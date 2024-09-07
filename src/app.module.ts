import { Module } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';
import { UtilsModule } from './utils/utils.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TelegramModule,
        UtilsModule
    ]
})
export class AppModule {}
