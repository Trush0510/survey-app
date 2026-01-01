import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// Map your regions to the actual Google Form URLs here
const REGION_FORMS: Record<string, string> = {
  north: 'https://docs.google.com/forms/d/e/1FAIpQLSc0KGfFk0IpFbqE_AUbNw_NJpEkYL-YJ4u4b7s99jfmJSUJrA/viewform?usp=header',
  south: 'https://docs.google.com/forms/d/e/1FAIpQLSccAnMTp4Xki0X9Sk8l-P3kvq5czjaOb7Hv-fAX3wh0iuZeTg/viewform?usp=header',
  central: 'https://docs.google.com/forms/d/e/1FAIpQLSd2m-muL-6MW3A4EEhm4iyXZRjx2h5E86ibHOKS8T2qs6uuwg/viewform?usp=header',
  east:  'https://docs.google.com/forms/d/e/1FAIpQLScBAQuG4nEpXU4fUc8SV8T16XVHYHenVdV9WmuKdaq46nMw6w/viewform?usp=header',
  west:  'https://docs.google.com/forms/d/e/1FAIpQLSc-0OMMf6C4_z0TdL7249oH4gDur3NPrl8a8mx86WgJWRflGQ/viewform?usp=header',
};

const MAX_LIMIT = 7;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const region = body.region;

    if (!region || !REGION_FORMS[region]) {
      return NextResponse.json({ error: 'Invalid region' }, { status: 400 });
    }

    // Define a unique key for this region's counter
    const counterKey = `quota_region_${region}`;

    // ATOMIC OPERATION:
    // 1. Increment the counter
    // 2. Get the new value immediately
    const currentCount = await kv.incr(counterKey);

    // If we just exceeded the limit (e.g., it became 8), revert it and block the user.
    if (currentCount > MAX_LIMIT) {
      // Optional: Decrement it back so the number stays accurate at 7 (not strictly necessary but cleaner)
      await kv.decr(counterKey);
      
      return NextResponse.json({ 
        error: 'Sorry, the quota for this region (7 people) is full.' 
      }, { status: 403 });
    }

    // If success, return the Form URL
    return NextResponse.json({ 
      success: true, 
      redirectUrl: REGION_FORMS[region] 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
