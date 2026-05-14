import { initialTickets } from "@/data";
import { Ticket } from "../type";

const getTickets = async (): Promise<readonly Ticket[]> => {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

  return new Promise((resolve) => resolve(initialTickets));
};

export default getTickets;
