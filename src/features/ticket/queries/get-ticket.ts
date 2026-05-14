import { initialTickets } from "@/data";
import { Ticket } from "../type";

const getTicket = async (ticketId: string): Promise<Ticket | null> => {
  const ticket = initialTickets.find((ticket) => ticket.id === ticketId);

  // throw new Error("Failed to fetch ticket"); // Simulate an error

  await new Promise((resolve) => setTimeout(resolve, 2000));
  return new Promise((resolve) => resolve(ticket as Ticket | null));
};

export default getTicket;
