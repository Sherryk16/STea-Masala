import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a0a00, #2d1810)',
          borderRadius: '50%',
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 'bold',
            letterSpacing: 1,
            background: 'linear-gradient(135deg, #D4A017, #FF6F00)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
          }}
        >
          ST
        </div>
      </div>
    ),
    {
      width: 32,
      height: 32,
    }
  );
}
