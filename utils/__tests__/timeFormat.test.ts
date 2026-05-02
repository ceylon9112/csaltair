import { formatPerformanceRange, formatTime12, formatTimeRange12 } from '../time';

describe('formatTime12', () => {
  it('converts afternoon / evening', () => {
    expect(formatTime12('18:45')).toBe('6:45 PM');
    expect(formatTime12('12:00')).toBe('12:00 PM');
    expect(formatTime12('23:59')).toBe('11:59 PM');
  });
  it('converts morning / noon edge', () => {
    expect(formatTime12('00:30')).toBe('12:30 AM');
    expect(formatTime12('09:05')).toBe('9:05 AM');
    expect(formatTime12('11:59')).toBe('11:59 AM');
  });
  it('accepts optional seconds', () => {
    expect(formatTime12('18:45:00')).toBe('6:45 PM');
    expect(formatTime12(' 18:45:30 ')).toBe('6:45 PM');
  });
});

describe('formatTimeRange12', () => {
  it('joins with en dash', () => {
    expect(formatTimeRange12('17:00', '18:30')).toBe('5:00 PM–6:30 PM');
  });
});

describe('formatPerformanceRange', () => {
  it('includes 12-hour times', () => {
    expect(formatPerformanceRange('2026-04-24', '18:45', '20:30')).toMatch(/6:45 PM/);
    expect(formatPerformanceRange('2026-04-24', '18:45', '20:30')).toMatch(/8:30 PM/);
  });
});
