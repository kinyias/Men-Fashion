import { NextResponse } from 'next/server';

const VIETTEL_POST_LOGIN_URL = 'https://partner.viettelpost.vn/v2/user/Login';
const VIETTEL_POST_CALCULATE_PRICE_URL = 'https://partner.viettelpost.vn/v2/order/getPrice';
const SHIPPING_SERVICES = ['STK', 'SCN', 'SHT'];

export async function POST(request: Request) {
  try {
    const priceRequest = await request.json();

    // First login to get token
    const loginResponse = await fetch(VIETTEL_POST_LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        USERNAME: process.env.NEXT_PUBLIC_VIETTEL_POST_USERNAME,
        PASSWORD: process.env.NEXT_PUBLIC_VIETTEL_POST_PASSWORD
      }),
      cache: 'no-store'
    });

    if (!loginResponse.ok) {
      return NextResponse.json(
        { error: `Login failed: ${loginResponse.statusText}` },
        { status: loginResponse.status }
      );
    }

    const loginData = await loginResponse.json();
    const token = loginData.data.token;

    // Calculate prices for all shipping services in parallel
    const pricePromises = SHIPPING_SERVICES.map(service => 
      fetch(VIETTEL_POST_CALCULATE_PRICE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          ...priceRequest,
          ORDER_SERVICE: service
        }),
        cache: 'no-store'
      }).then(res => res.json())
    );

    const results = await Promise.all(pricePromises);

    // Map the results to include the service type
    const priceData = results.map((result, index) => ({
      service: SHIPPING_SERVICES[index],
      ...result.data
    }));

    return NextResponse.json({
      status: 200,
      error: false,
      message: "OK",
      data: priceData
    });

  } catch (error) {
    console.error('Proxy calculate price error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}