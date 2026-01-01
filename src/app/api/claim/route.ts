import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const REGION_FORMS: Record<string, string> = {
  north: 'https://docs.google.com/forms/d/e/1FAIpQLSc0KGfFk0IpFbqE_AUbNw_NJpEkYL-YJ4u4b7s99jfmJSUJrA/viewform?usp=header',
  south: 'https://docs.google.com/forms/d/e/1FAIpQLSccAnMTp4Xki0X9Sk8l-P3kvq5czjaOb7Hv-fAX3wh0iuZeTg/viewform?usp=header',
  central: 'https://docs.google.com/forms/d/e/1FAIpQLSd2m-muL-6MW3A4EEhm4iyXZRjx2h5E86ibHOKS8T2qs6uuwg/viewform?usp=header',
  east: 'https://docs.google.com/forms/d/e/1FAIpQLScBAQuG4nEpXU4fUc8SV8T16XVHYHenVdV9WmuKdaq46nMw6w/viewform?usp=header',
  west: 'https://docs.google.com/forms/d/e/1FAIpQLSc-0OMMf6C4_z0TdL7249oH4gDur3NPrl8a8mx86WgJWRflGQ/viewform?usp=header',
};

const MAX_LIMIT = 7;

// Initialize Redis from the environment variables Vercel set for you
const redis = Redis.fromEnv();

export async function POST(request: Request) {
  try {
    const { region } = await request.json();

    if (!region || !REGION_FORMS[region]) {
      return NextResponse.json({ error: 'Invalid region' }, { status: 400 });
    }

    const key = `quota:${region}`;

    // 1. Increment count
    const currentCount = await redis.incr(key);

    // 2. Check limit
    if (currentCount > MAX_LIMIT) {
      // Optional: Decrement it back so the number stays accurate at 7
      await redis.decr(key);

      return NextResponse.json({
        error: 'Sorry, the quota for this region (7 people) is full.'
      }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      redirectUrl: REGION_FORMS[region]
    });

  } catch (error) {
    console.error('Redis Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

