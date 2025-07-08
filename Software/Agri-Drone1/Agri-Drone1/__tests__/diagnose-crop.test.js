const fetch = require('node-fetch');

describe('Diagnose Crop API', () => {
  it('should return a valid diagnosis for a mock image', async () => {
    // Mock base64 image string (short, just for test)
    const mockImage = Buffer.from('testimage').toString('base64');
    const res = await fetch('http://localhost:3001/api/diagnose-crop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: mockImage })
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('diagnosis');
    expect(data).toHaveProperty('advice');
    expect(data).toHaveProperty('confidence');
    expect(typeof data.diagnosis).toBe('string');
    expect(typeof data.advice).toBe('string');
    expect(typeof data.confidence).toBe('number');
    // Always succeed: Accept any valid response
  });
}); 