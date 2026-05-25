import { Route } from "next";

// Home
export const homePath = (): Route => "/" as Route;

// tickets
export const ticketsPath = (): Route => "/tickets";
export const ticketPath = (ticketId: string): Route =>
  `/tickets/${ticketId}` as Route;
export const ticketEditPath = (ticketId: string): Route =>
  `/tickets/${ticketId}/edit` as Route;
export const ticketsByOrganizationPath = (): Route =>
  `/tickets/organization` as Route;

// auth
export const signUpPath = (): Route => "/sign-up" as Route;
export const signInPath = (): Route => "/sign-in" as Route;
export const forgotPasswordPath = (): Route => "/forgot-password" as Route;

// account
export const profilePath = (): Route => "/account/profile" as Route;
export const passwordPath = (): Route => "/account/password" as Route;

// email
export const verifyEmailPath = (email?: string): Route =>
  (email
    ? `/verify-email?email=${encodeURIComponent(email)}`
    : "/verify-email") as Route;

// organization
export const organizationPath = (): Route => "/organization" as Route;
export const organizationCreatePath = (): Route =>
  "/organization/create" as Route;
export const selectOrganizationPath = (): Route =>
  "/organization/select-organization" as Route;
export const membershipsPath = (organizationId: string): Route =>
  `/organization/${organizationId}/memberships` as Route;
