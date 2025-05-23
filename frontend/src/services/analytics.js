import ReactGA from 'react-ga';

/**
 * Initialize Google Analytics with the measurement ID
 * Only initializes in production environment
 */
export const initGA = () => {
  const id = process.env.REACT_APP_GA_MEASUREMENT_ID;
  
  if (id && process.env.NODE_ENV === 'production') {
    ReactGA.initialize(id);
    console.log('Google Analytics initialized successfully');
    return true;
  } else {
    console.log('Google Analytics not initialized (either not in production or missing ID)');
    return false;
  }
};

/**
 * Track a page view
 * @param {string} path - The path to track
 */
export const trackPageView = (path) => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.pageview(path);
  }
};

/**
 * Track an event
 * @param {string} category - Event category
 * @param {string} action - Event action
 * @param {string} label - Event label (optional)
 * @param {number} value - Event value (optional)
 */
export const trackEvent = (category, action, label = null, value = null) => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.event({
      category,
      action,
      label,
      value
    });
  }
};
