import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';

/**
 * Custom hook to send GA4 page-view hits on every route change.
 */
export default function usePageView() {
  const location = useLocation();

  useEffect(() => {
    const id = process.env.REACT_APP_GA_MEASUREMENT_ID;
    if (!id || process.env.NODE_ENV !== 'production') return;

    ReactGA.pageview(location.pathname + location.search);
  }, [location]);
}
