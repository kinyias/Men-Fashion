import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string || 'Uploaded Image';
    const description = formData.get('description') as string || 'Uploaded from Men Fashion';
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png', 'image/apng', 'image/tiff'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} not supported. Allowed types: ${allowedTypes.join(', ')}` },
        { status: 400 }
      );
    }

    console.log('File type:', file.type); // Log file type for debugging
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Convert buffer to base64
    const base64String = buffer.toString('base64');
    
    // Upload to Imgur
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64String,
        type: 'base64',
        title: title,
        description: description
      })
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Imgur API Error:', response.status, response.statusText);
      console.error('Error details:', result);
      throw new Error(result.data?.error || `Error uploading to Imgur: ${response.status}`);
    }
    
    return NextResponse.json({
      url: result.data.link,
      deleteHash: result.data.deletehash
    });
  } catch (error) {
    console.error('Error uploading to Imgur:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error uploading to Imgur' },
      { status: 500 }
    );
  }
}