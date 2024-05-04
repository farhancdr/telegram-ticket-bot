import axios from 'axios';
import { IRailwayResponse } from './interfaces/RailwayResponse';
import { UserInput } from './interfaces/UserInput';

const TRAIN_NAME = [
  'COXS BAZAR EXPRESS (813)',
  'COXS BAZAR EXPRESS (814)',

  'SONAR BANGLA EXPRESS (787)',
  'SONAR BANGLA EXPRESS (788)',

  'PARJOTAK EXPRESS (815)',
  'PARJOTAK EXPRESS (816)',

  'TURNA (741)',
  'TURNA (742)',

  'SUBORNO EXPRESS (701)',
  'SUBORNO EXPRESS (702)',
];

export const fetchAndProcessData = async (
  trainDetails: UserInput,
): Promise<string> => {
  const url = `https://railspaapi.shohoz.com/v1.0/web/bookings/search-trips-v2?from_city=${trainDetails.source}&to_city=${trainDetails.destination}&date_of_journey=${trainDetails.date}&seat_class=S_CHAIR`;

  const response = await axios.get<IRailwayResponse>(url);
  const data = response.data;

  if (data && data.data && data.data.trains) {
    const trains = data.data.trains;
    let finalMessage = '';

    trains.forEach((train) => {
      const { trip_number, seat_types } = train;

      seat_types.forEach((seat) => {
        const { type, seat_counts } = seat;
        const { online } = seat_counts;

        if (online > 0 && TRAIN_NAME.includes(trip_number)) {
          const message = `${trip_number} - ${type} has <b> ${online} </b> number of seats available.`;
          finalMessage = `${finalMessage} ${message}`;
        }
      });
    });
    return finalMessage;
  }
};
