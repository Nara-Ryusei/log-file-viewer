// Utility functions for formatting log data

// Formats datetime from "YYYYMMDD HH:mm:ss" to "YYYY-MM-DD HH:mm:ss"
export function formatDatetime(datetime) {
  if (!datetime || typeof datetime !== 'string' || datetime.length < 15) return datetime;
  const datePart = datetime.substring(0, 8);
  const timePart = datetime.substring(9);
  const formattedDate = datePart.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
  return `${formattedDate} ${timePart}`;
}

// Returns style object for log level based on its value.
export function getLevelStyle(level) {
  const levelLower = level.toLowerCase();
  let backgroundColor = '';
  switch (levelLower) {
    case 'error':
      backgroundColor = '#f44336';
      break;
    case 'notice':
      backgroundColor = '#2196F3';
      break;
    case 'warn':
    case 'warning':
      backgroundColor = '#ff9800';
      break;
    case 'info':
      backgroundColor = '#4caf50';
      break;
    default:
      backgroundColor = '#9e9e9e';
  }
  return { backgroundColor, color: '#fff', padding: '4px 8px', borderRadius: '4px', textAlign: 'center' };
}
