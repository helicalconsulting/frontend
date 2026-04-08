/**
 * useApiToast - Combines API error handling with toast notifications
 * Use this hook for consistent error/success handling across the app
 */

import { useToast } from '@/components/ui/Toast';
import { getErrorMessage, handleApiError, ApiError } from '@/lib/errorHandler';
import { useCallback } from 'react';

export interface ApiToastOptions {
  successTitle?: string;
  successMessage?: string;
  errorTitle?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

export function useApiToast() {
  const { showToast } = useToast();

  /**
   * Show success toast
   */
  const showSuccess = useCallback(
    (title: string, message?: string) => {
      showToast('success', title, message);
    },
    [showToast]
  );

  /**
   * Show error toast
   */
  const showError = useCallback(
    (title: string, message?: string) => {
      showToast('error', title, message);
    },
    [showToast]
  );

  /**
   * Show warning toast
   */
  const showWarning = useCallback(
    (title: string, message?: string) => {
      showToast('warning', title, message);
    },
    [showToast]
  );

  /**
   * Show info toast
   */
  const showInfo = useCallback(
    (title: string, message?: string) => {
      showToast('info', title, message);
    },
    [showToast]
  );

  /**
   * Handle API error and show toast
   */
  const handleError = useCallback(
    (error: unknown, customTitle?: string): ApiError => {
      const apiError = handleApiError(error);
      const title = customTitle || 'Error';
      showToast('error', title, apiError.message);
      return apiError;
    },
    [showToast]
  );

  /**
   * Create mutation callbacks with toast notifications
   * Use with React Query mutations for consistent feedback
   */
  const createMutationCallbacks = useCallback(
    <TData = unknown, TError = unknown>(options: ApiToastOptions = {}) => {
      const {
        successTitle = 'Success',
        successMessage,
        errorTitle = 'Error',
        showSuccessToast = true,
        showErrorToast = true,
      } = options;

      return {
        onSuccess: (_data: TData) => {
          if (showSuccessToast) {
            showToast('success', successTitle, successMessage);
          }
        },
        onError: (error: TError) => {
          if (showErrorToast) {
            const message = getErrorMessage(error);
            showToast('error', errorTitle, message);
          }
        },
      };
    },
    [showToast]
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    handleError,
    createMutationCallbacks,
    // Re-export for convenience
    showToast,
  };
}

export default useApiToast;
