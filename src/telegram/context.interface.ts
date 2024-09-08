import { Context as ContextTelegraf } from 'telegraf';

export interface Context extends ContextTelegraf {
    session: {
        type?: 'city/celsius' | 'celsius' | 'fahrenheit' | 'city/fahrenheit';
    };
}
