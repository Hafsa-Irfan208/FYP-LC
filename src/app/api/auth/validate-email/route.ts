import axios from 'axios';

export async function POST(req) {
  const { email } = await req.json(); // Parse the email from the request body
  const ZERO_BOUNCE_API_KEY = process.env.ZERO_BOUNCE_API_KEY // Replace with your API key
  const ZERO_BOUNCE_API_URL = 'https://api.zerobounce.net/v2/validate';

  try {
    // Call ZeroBounce API
    const response = await axios.get(ZERO_BOUNCE_API_URL, {
      params: {
        api_key: ZERO_BOUNCE_API_KEY,
        email: email,
      },
    });

    // Extract status and sub_status from the API response
    const { status, sub_status } = response.data;

    // Determine if the email is valid
    if (status === 'valid') {
      return new Response(JSON.stringify({ isValid: true, isDisposable: false }), { status: 200 });
    } else if (sub_status === 'disposable') {
      return new Response(JSON.stringify({ isValid: false, isDisposable: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ isValid: false, isDisposable: false }), { status: 200 });
    }
  } catch (error) {
    console.error('Error calling ZeroBounce API:', error);
    return new Response(JSON.stringify({ error: 'Validation failed' }), { status: 500 });
  }
}
