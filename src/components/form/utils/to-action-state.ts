import z, { ZodError } from "zod";

export type ActionState = {
  status?: "SUCCESS" | "ERROR";
  message: string;
  payload?: FormData;
  data?: unknown;
  fieldErrors: Record<string, string[] | undefined>;
  timestamp: number;
};

export const EMPTY_ACTION_STATE: ActionState = {
  message: "",
  fieldErrors: {},
  timestamp: Date.now(),
};

const fromErrorToActionState = (
  error: unknown,
  formData?: FormData,
): ActionState => {
  if (error instanceof ZodError) {
    // zod errors case
    const flattenError = z.flattenError(error).fieldErrors;
    return {
      timestamp: Date.now(),
      status: "ERROR",
      message: "",
      fieldErrors: flattenError,
      payload: formData,
      // fieldErros will be used to show validation errors for each field in the form
    };
  } else if (error instanceof Error) {
    // db or other errors case
    return {
      timestamp: Date.now(),
      status: "ERROR",
      message: error.message,
      fieldErrors: {},
      payload: formData,
    };
  } else {
    return {
      timestamp: Date.now(),
      status: "ERROR",
      message: "Something went wrong",
      // generic error message for unexpected error types
      fieldErrors: {},
      payload: formData,
      // default values for the form will be taken from the payload in case of an error
    };
  }
};

// utility function to create a success action state with a message
export const toActionState = (
  status: ActionState["status"],
  message: string,
  formData?: FormData,
  data?: unknown,
): ActionState => {
  return {
    timestamp: Date.now(),
    status,
    message,
    fieldErrors: {},
    payload: formData,
    data,
  };
};
export default fromErrorToActionState;
