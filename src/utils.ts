import { validLocations } from './constants';
import { UserInput } from './interfaces/UserInput';

export const capitalizeFirstLetter = (input: string): string => {
  const msg = input.replace(/\b\w/g, (char) => char.toUpperCase());
  return msg;
};

export const resetUserInput = (userInputs: UserInput, chatId: string) => {
  delete userInputs[chatId];
};

export const isValidDate = (dateString: string): boolean => {
  const dateRegex = /^\d{2}-[a-z][a-z]{2}-\d{4}$/;
  return dateRegex.test(dateString);
};

export const getUserInputSummary = (
  userInputs: UserInput,
  chatId: string,
): string => {
  const userInput = userInputs[chatId];
  if (!userInput || !userInput.source) return 'No information saved.';

  const summary = [];
  if (userInput.source) summary.push(`source:- ${userInput.source}`);
  if (userInput.destination)
    summary.push(`destination:- ${userInput.destination}`);
  if (userInput.date) summary.push(`date:- ${userInput.date}`);
  return summary.join('\n');
};

export const receiveAndValidateUserInput = (
  userInputs: UserInput,
  input: string,
  chatId: string,
): UserInput | string => {
  const inputParts: string[] = input.split('\n');
  const source = inputParts
    .find((part) => part.startsWith('source:-'))
    ?.split(':-')[1]
    ?.trim();
  const destination = inputParts
    .find((part) => part.startsWith('destination:-'))
    ?.split(':-')[1]
    ?.trim();
  const date = inputParts
    .find((part) => part.startsWith('date:-'))
    ?.split(':-')[1]
    ?.trim();

  if (source && validLocations.includes(source.toLowerCase())) {
    userInputs[chatId].source = capitalizeFirstLetter(source);
  } else {
    return `Invalid source. Please enter one of: ${validLocations.join(', ')}`;
  }

  if (destination && validLocations.includes(destination.toLowerCase())) {
    userInputs[chatId].destination = capitalizeFirstLetter(destination);
  } else {
    return `Invalid destination. Please enter one of: ${validLocations.join(', ')}`;
  }

  if (date && isValidDate(date.toLowerCase())) {
    userInputs[chatId].date = capitalizeFirstLetter(date);
  } else {
    return 'Invalid date format. Please use the format: 10-May-2024';
  }

  return userInputs[chatId];
};
