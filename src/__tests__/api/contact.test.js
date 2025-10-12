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
      insert: jest.fn().mockResolvedValue({ error: null })
    }))
  }))
}));

// Mock email functions
jest.mock('../../utils/brevoEmail', () => ({
  sendContactNotificationEmail: jest.fn().mockResolvedValue(true),
  sendContactAutoReplyEmail: jest.fn().mockResolvedValue(true)
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
});
