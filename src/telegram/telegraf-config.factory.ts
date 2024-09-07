import { ConfigService } from '@nestjs/config';
import {
    TelegrafModuleAsyncOptions,
    TelegrafModuleOptions
} from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';

const sessions = new LocalSession({ database: 'sessions_db.json' });

const telegrafModuleOptions = (
    config: ConfigService
): TelegrafModuleOptions => {
    return {
        token: config.get('TELEGRAM_BOT_TOKEN'),
        middlewares: [sessions.middleware()]
    };
};

export const options = (): TelegrafModuleAsyncOptions => {
    return {
        inject: [ConfigService],
        useFactory: (config: ConfigService) => telegrafModuleOptions(config)
    };
};
