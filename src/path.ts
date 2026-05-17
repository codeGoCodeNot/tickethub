import { Route } from "next";

// Home

export const homePath = (): Route => "/" as Route;

// tickets

export const ticketsPath = (): Route => "/tickets";
export const ticketPath = (ticketId: string): Route =>
  `/tickets/${ticketId}` as Route;
export const ticketEditPath = (ticketId: string): Route =>
  `/tickets/${ticketId}/edit` as Route;

// auth
export const signUpPath = (): Route => "/sign-up" as Route;
export const signInPath = (): Route => "/sign-in" as Route;
export const forgotPasswordPath = (): Route => "/forgot-password" as Route;
