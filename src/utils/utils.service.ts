import { BadRequestException, Injectable } from '@nestjs/common';
import { transliterationMap } from '../core/constants';
import { Context } from 'telegraf';
import puppeteer from 'puppeteer';

@Injectable()
export class UtilsService {
    transliterate(text) {
        return text
            .toLowerCase()
            .split('')
            .map((char) => transliterationMap[char] || char)
            .join('');
    }

    parseString(str: string) {
        return str
            .split('')
            .filter((el) => el != '\n' && el != '\t')
            .join('');
    }

    getTranslatedCity(str: string) {
        const transliteratedCity = this.transliterate(str);
        return transliteratedCity.replace(/\s+/g, '_');
    }

    async getCityFromCoordinates(latitude: any, longitude: any) {
        const apiKey = process.env.GEOCODE_API_KEY;
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new BadRequestException({
                message:
                    'Произошла ошибка при получении вашего местоположения, попробуйте еще раз'
            });
        }
        const data = await response.json();

        const result = data.results[0];
        return (
            result.components.city ||
            result.components.town ||
            result.components.village
        );
    }

    async getWeather(ctx: Context, town: string) {
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null
        });
        const page = await browser.newPage();
        try {
            await page.exposeFunction('parseString', this.parseString);

            const res = await page.goto(
                `https://pogoda.mail.ru/prognoz/${town}/`,
                {
                    waitUntil: 'networkidle2'
                }
            );

            if (res.status() === 404) {
                await ctx.reply(
                    'Допущена ошибка в указании города, попробуйте ввести название города еще раз'
                );
                return;
            }

            await page.setViewport({ width: 1920, height: 1080 });

            const data = await page.evaluate(async () => {
                const returnedObject = {
                    today: {
                        about: '',
                        now: {
                            temp: ''
                        },
                        periods: []
                    },
                    after: []
                };

                const about = document.querySelector(
                    'div.information__header__left__date'
                );
                const nowTemp = document.querySelector(
                    'div.information__content__temperature'
                );

                const nowPeriods = document.querySelectorAll(
                    'div.information__content__period'
                );

                const afterPeriods = document.querySelectorAll('a.day__link');

                returnedObject.today.about = await this.parseString(
                    about.textContent
                );
                returnedObject.today.now.temp = await this.parseString(
                    nowTemp.textContent
                );

                for (let i = 0; i < nowPeriods.length; i++) {
                    const arr = [];
                    for (let j = 0; j <= 2; j++) {
                        if (j === 1)
                            arr.push(
                                nowPeriods[i].children[j].getAttribute('title')
                            );
                        else arr.push(nowPeriods[i].children[j].textContent);
                    }
                    returnedObject.today.periods.push(arr.join(' '));
                }

                for (let i = 0; i < afterPeriods.length; i++) {
                    const obj = {
                        dayByPeriod: afterPeriods[i].children[0].textContent,
                        state: afterPeriods[i].children[3].getAttribute(
                            'title'
                        ),
                        day: afterPeriods[i].children[2].textContent
                            .split('')
                            .splice(0, 4)
                            .join(''),
                        night: afterPeriods[i].children[2].children[0]
                            .textContent
                    };

                    returnedObject.after.push(obj);
                }

                return returnedObject;
            });
            await ctx.replyWithHTML(
                `<b>Текущий день:</b>\n\n` +
                    `${data.today.about}\n` +
                    `<b>температура сейчас:  </b>` +
                    `${data.today.now.temp}\n` +
                    `${data.today.periods[0]}\n` +
                    `${data.today.periods[1]}\n\n`
            );
            await ctx.replyWithHTML(
                `<b>Последующие дни:</b>\n\n` +
                    `${data.after
                        .map(
                            (el) =>
                                `<b>${el.dayByPeriod}:  </b>${el.state}\n` +
                                `<b>Температура днем:  </b>${el.day}\n` +
                                `<b>Температура ночью:  </b>${el.night}\n\n`
                        )
                        .join('')}`
            );
        } catch (e) {
            throw new BadRequestException({
                message:
                    'Произошла ошибка при получении данных, попробуйте еще раз'
            });
        } finally {
            await browser.close();
        }
    }
}
