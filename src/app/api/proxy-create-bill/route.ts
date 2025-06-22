import { NextResponse } from 'next/server';

const VIETTEL_POST_LOGIN_URL = 'https://partner.viettelpost.vn/v2/user/Login';
const VIETTEL_POST_CREATE_BILL_URL =
  'https://partner.viettelpost.vn/v2/order/createOrder';

export async function POST(request: Request) {
  try {
    const billRequest = await request.json();

    // First login to get token
    const loginResponse = await fetch(VIETTEL_POST_LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        USERNAME: process.env.NEXT_PUBLIC_VIETTEL_POST_USERNAME,
        PASSWORD: process.env.NEXT_PUBLIC_VIETTEL_POST_PASSWORD,
      }),
      cache: 'no-store',
    });

    if (!loginResponse.ok) {
      return NextResponse.json(
        { error: `Login failed: ${loginResponse.statusText}` },
        { status: loginResponse.status }
      );
    }

    const loginData = await loginResponse.json();
    const token = loginData.data.token;
    // Create bill with the provided request data
    const billResponse = await fetch(VIETTEL_POST_CREATE_BILL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`,
         'Token': token
      },
      body: JSON.stringify(billRequest),
      cache: 'no-store',
    });

    if (!billResponse.ok) {
      return NextResponse.json(
        { error: `Create bill failed: ${billResponse}` },
        { status: billResponse.status }
      );
    }
    
    const billData = await billResponse.json();
    return NextResponse.json({
      status: 200,
      error: false,
      message: 'OK',
      data: billData,
    });
  } catch (error) {
    console.error('Proxy create bill error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
