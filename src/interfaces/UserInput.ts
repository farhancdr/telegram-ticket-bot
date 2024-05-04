export interface UserInput {
  source?: string;
  destination?: string;
  date?: string;
}

export interface UserInputs {
  [chatId: string]: UserInput;
}
