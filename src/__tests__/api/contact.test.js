import { POST } from '../../app/api/contact/route';

// Mock environment variables
process.env.BREVO_API_KEY = 'test-api-key';

// Mock fetch
global.fetch = jest.fn();

describe('/api/contact', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should handle contact form submission', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test Message',
      }),
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ messageId: 'test-message-id' }),
    });

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
        subject: 'Test Subject',
        message: 'Test Message',
      }),
    };

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });
});
