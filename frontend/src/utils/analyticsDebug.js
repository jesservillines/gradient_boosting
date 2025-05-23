/**
 * Utility to debug Google Analytics tracking
 * This will help verify that Google Analytics is working correctly
 */

// Check if Google Analytics is loaded
export const checkGALoaded = () => {
  if (typeof window === 'undefined') return false;
  
  // Check if GA is loaded by looking for the gtag function
  if (window.gtag) {
    console.log('✅ Google Analytics (gtag) is loaded');
    return true;
  }
  
  // Check for GA4 dataLayer
  if (window.dataLayer) {
    console.log('✅ Google Analytics dataLayer is present');
    return true;
  }
  
  // Check for ReactGA
  if (window.ga) {
    console.log('✅ Google Analytics (ga) is loaded');
    return true;
  }
  
  console.log('❌ Google Analytics is not detected');
  return false;
};

// Check environment variables
export const checkGAConfig = () => {
  const id = process.env.REACT_APP_GA_MEASUREMENT_ID;
  const env = process.env.NODE_ENV;
  
  console.log('Environment:', env);
  console.log('GA Measurement ID:', id ? 'Configured' : 'Not configured');
  
  if (id && env === 'production') {
    console.log('✅ Google Analytics configuration is valid');
    return true;
  } else {
    console.log('❌ Google Analytics will not initialize with current configuration');
    console.log('   - GA only initializes in production environment');
    console.log('   - Make sure REACT_APP_GA_MEASUREMENT_ID is set in Netlify');
    return false;
  }
};

// Manually trigger a test event
export const sendTestEvent = () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('⚠️ Test event not sent - not in production environment');
    return false;
  }
  
  try {
    if (window.gtag) {
      window.gtag('event', 'test_event', {
        'event_category': 'testing',
        'event_label': 'GA Test',
        'value': 1
      });
      console.log('✅ Test event sent via gtag');
      return true;
    } else if (window.ga) {
      window.ga('send', 'event', 'testing', 'test_event', 'GA Test', 1);
      console.log('✅ Test event sent via ga');
      return true;
    } else {
      console.log('❌ Could not send test event - GA not initialized');
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending test event:', error);
    return false;
  }
};
