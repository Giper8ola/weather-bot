import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { options } from './telegraf-config.factory';
import { UtilsModule } from '../utils/utils.module';

@Module({
    imports: [TelegrafModule.forRootAsync(options()), UtilsModule],
    providers: [TelegramService]
})
export class TelegramModule {}
