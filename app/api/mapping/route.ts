// api/alerts.ts

export const fetchAlertsStream = (url: string): EventSource => {
    const sse = new EventSource(url);
  
    // Error handling
    sse.onerror = (event) => {
      console.error('SSE Error:', event);
      sse.close(); // Close the connection on error
    };
  
    return sse;
  };
  