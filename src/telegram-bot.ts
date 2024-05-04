import TelegramBot from 'node-telegram-bot-api';
import { Message, SendMessageOptions } from 'node-telegram-bot-api';
import { UserInputs } from './interfaces/UserInput';
import {
  getUserInputSummary,
  receiveAndValidateUserInput,
  resetUserInput,
} from './utils';
import { ADMIN_USER_ID, validLocations } from './constants';

interface TelegramBotInstance {
  sendMessage: (
    chatId: number | string,
    text: string,
    options?: SendMessageOptions,
  ) => Promise<Message>;
  onMessageReceived: (callback: (msg: Message) => void) => void;
}

export const handleMessage = (
  bot: TelegramBot,
  msg: Message,
  userInputs: UserInputs,
) => {
  if (msg.text) {
    const chatId = msg.chat.id.toString();
    const inputMessage = msg.text.trim().toLowerCase();

    if (!userInputs[chatId]) {
      userInputs[chatId] = {};
    }

    // Check if the message is from the admin user and the command is /reset-all
    if (inputMessage === '/resetall') {
      if (chatId !== ADMIN_USER_ID) {
        bot.sendMessage(chatId, 'This is only-admin feature');
      }

      for (const chatId in userInputs) {
        delete userInputs[chatId];
      }
      bot.sendMessage(chatId, 'User inputs reset for all users.');
    }

    if (inputMessage === '/reset') {
      resetUserInput(userInputs, chatId);
      bot.sendMessage(chatId, 'Input reset. Please enter the details again.');
    } else if (inputMessage === '/current') {
      const summary = getUserInputSummary(userInputs, chatId);
      bot.sendMessage(chatId, summary);
    } else if (inputMessage === '/start') {
      bot.sendMessage(
        chatId,
        `Please enter train details in the following format:

source:- Dhaka (Should be one of ${validLocations.join(', ')})
destination:- Chattogram (Should be one of ${validLocations.join(', ')})
date:- 10-May-2024`,
      );
    } else {
      const validationResult = receiveAndValidateUserInput(
        userInputs,
        inputMessage,
        chatId,
      );

      if (typeof validationResult === 'string') {
        bot.sendMessage(chatId, validationResult);
      } else {
        if (
          validationResult.source &&
          validationResult.destination &&
          validationResult.date
        ) {
          bot.sendMessage(
            chatId,
            'All details entered. Fetching train details...',
          );
        }
      }
    }
  }
};
