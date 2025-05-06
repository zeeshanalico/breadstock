import toast from "react-hot-toast";

export const errorHandler = (
  error: any,
  setStatus?: (message: string) => void,
  onError?: (error: any) => void
): void => {
  const errorMessage =
    error.response?.data?.message || "An unexpected error occurred.";
  console.error("Error:", error);

  if (setStatus) setStatus(errorMessage);
  if (onError) onError(error);

  // Only show a toast notification for client-side errors
  if (error.response?.status < 500) {
    toast.error(errorMessage);
  }
};