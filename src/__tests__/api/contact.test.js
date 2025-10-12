import { POST } from '../../app/api/contact/route';

// Mock environment variables
process.env.BREVO_API_KEY = 'test-api-key';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'test-supabase-url';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-supabase-key';

// Mock Supabase
jest.mock('../../utils/supabaseServerClient', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    from: jest.fn(() => ({
      insert: jest.fn().mockResolvedValue({ error: null }),
    })),
  })),
}));

// Mock email functions
jest.mock('../../utils/brevoEmail', () => ({
  sendContactNotificationEmail: jest.fn().mockResolvedValue(true),
  sendContactAutoReplyEmail: jest.fn().mockResolvedValue(true),
}));

describe('/api/contact', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should handle contact form submission', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        details: 'Test Message',
      }),
    };

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should handle missing required fields', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        name: '',
        email: 'test@example.com',
        phone: '1234567890',
        details: 'Test Message',
      }),
    };

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(422);
    expect(data.error).toBe('Name and email are required.');
  });

  it('should handle missing email field', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        name: 'Test User',
        email: '',
        phone: '1234567890',
        details: 'Test Message',
      }),
    };

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(422);
    expect(data.error).toBe('Name and email are required.');
  });

  it('should handle Supabase insert error', async () => {
    // Mock Supabase to return an error
    const mockSupabase = require('../../utils/supabaseServerClient').default();
    mockSupabase.from().insert.mockResolvedValueOnce({ error: { message: 'Database error' } });

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        details: 'Test Message',
      }),
    };

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Unable to save your message right now. Please try again.');
  });

  it('should handle invalid JSON request', async () => {
    const mockRequest = {
      json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
    };

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Unexpected error while submitting the form.');
  });
});
