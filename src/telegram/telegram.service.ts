import {
    Action,
    Ctx,
    Hears,
    Message,
    On,
    Start,
    Update
} from 'nestjs-telegraf';
import { Telegram } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { actionButtons, inlineButtons } from './buttons/telegram-buttons';
import { UtilsService } from '../utils/utils.service';
import { Context } from './context.interface';

@Update()
export class TelegramService extends Telegram {
    private _token: string;
    constructor(
        private readonly config: ConfigService,
        private readonly utilsService: UtilsService
    ) {
        super(config.get('TELEGRAM_BOT_TOKEN'));
        this._token = config.get('TELEGRAM_BOT_TOKEN');
    }

    @Start()
    async onStart(@Ctx() ctx: Context) {
        await ctx.reply(
            'Привет, я бот, который подскажет тебе прогноз погоды',
            actionButtons()
        );
        ctx.session.type = 'celsius';
    }

    @On('location')
    async getLocation(@Ctx() ctx: Context) {
        const { latitude, longitude } = ctx.message.location;
        const city = await this.utilsService.getCityFromCoordinates(
            latitude,
            longitude,
            ctx
        );
        const validCity = this.utilsService.getTranslatedCity(city);
        await this.utilsService.getWeather(
            ctx,
            validCity,
            ctx.session.type as 'celsius' | 'fahrenheit'
        );
    }

    @Hears('Выбор города')
    async hearsCity(@Ctx() ctx: Context) {
        await ctx.reply(
            'Напишите город, в котором хотите узнать прогноз погоды'
        );
        if (ctx.session.type === 'celsius') ctx.session.type = `city/celsius`;
        if (ctx.session.type === 'fahrenheit')
            ctx.session.type = `city/fahrenheit`;
    }

    @Hears('Выбор единицы измерения')
    async hearsMeasuring(@Ctx() ctx: Context) {
        await ctx.reply('Выберите единицу измерения', inlineButtons());
    }

    @Action('changeCelsius')
    async changeCelsius(@Ctx() ctx: Context) {
        ctx.session.type = 'celsius';
        await ctx.reply('Установлено отображению температуры по цельсию');
        return;
    }

    @Action('changeFahrenheit')
    async changeFahrenheit(@Ctx() ctx: Context) {
        ctx.session.type = 'fahrenheit';
        await ctx.reply('Установлено отображению температуры по фаренгейту');
        return;
    }

    @On('text')
    async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
        if (!ctx.session.type) return;
        if (
            ctx.session.type === 'city/celsius' ||
            ctx.session.type === 'city/fahrenheit'
        ) {
            const validCity = this.utilsService.getTranslatedCity(message);
            await this.utilsService.getWeather(
                ctx,
                validCity,
                ctx.session.type.split('/')[1] as 'celsius' | 'fahrenheit'
            );
            return;
        }
    }
}
