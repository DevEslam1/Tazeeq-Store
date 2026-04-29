import { useDispatch } from 'react-redux';
import { showBanner, hideBanner, BannerType } from '../store/slices/uiSlice';
import { useCallback } from 'react';

export function useBanner() {
  const dispatch = useDispatch();

  const show = useCallback((message: string, type: BannerType = 'info', duration: number = 3000) => {
    dispatch(showBanner({ message, type, duration }));
  }, [dispatch]);

  const showSuccess = useCallback((message: string, duration?: number) => {
    show(message, 'success', duration);
  }, [show]);

  const showError = useCallback((message: string, duration?: number) => {
    show(message, 'error', duration);
  }, [show]);

  const showInfo = useCallback((message: string, duration?: number) => {
    show(message, 'info', duration);
  }, [show]);

  const showWarning = useCallback((message: string, duration?: number) => {
    show(message, 'warning', duration);
  }, [show]);

  const hide = useCallback(() => {
    dispatch(hideBanner());
  }, [dispatch]);

  return {
    show,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    hide
  };
}
