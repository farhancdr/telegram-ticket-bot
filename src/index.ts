import * as cron from 'node-cron';
import figlet from 'figlet';
import { StartBot } from './telegram-bot';
import { fetchAndProcessData } from './fetch-train';
import { UserInputs } from './interfaces/UserInput';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const userInputs: UserInputs = {};
const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

StartBot(bot, userInputs);

cron.schedule('* * * * *', async () => {
  for (const chatId in userInputs) {
    const userInput = userInputs[chatId];
    if (
      userInput &&
      userInput.source &&
      userInput.destination &&
      userInput.date
    ) {
      try {
        const trainMessage = await fetchAndProcessData(userInput);
        bot.sendMessage(chatId, trainMessage, { parse_mode: 'HTML' });
      } catch (error) {
        console.error('Error fetching train details:', error);
        bot.sendMessage(
          chatId,
          'Error fetching train details. Please try again later.',
        );
      }
    }
  }
});

app.get('/health', (req: Request, res: Response) => {
  res.send('Server is healthy!');
});

app.listen(port, () => {
  console.log(figlet.textSync('TT-BOT', { horizontalLayout: 'full' }));
  console.log(`Bot Started and Server is running on http://localhost:${port}`);
});
