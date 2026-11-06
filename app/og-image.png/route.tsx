import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'ST Lounge – Premium Tea Collection';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a0a00',
          backgroundImage:
            'radial-gradient(circle at 20% 0%, rgba(212,160,23,0.25), transparent 40%), linear-gradient(135deg, #1a0a00 0%, #2d1810 100%)',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 84,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #D4A017, #FF6F00)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            }}
          >
            ST Lounge
          </div>
        </div>

        <div
          style={{
            fontSize: 38,
            color: '#ffffff',
            textAlign: 'center',
            maxWidth: 820,
            lineHeight: 1.35,
            fontWeight: 300,
          }}
        >
          A World of Tea &amp; Flavours
        </div>

        <div
          style={{
            marginTop: 22,
            fontSize: 23,
            color: '#E5A122',
            textAlign: 'center',
          }}
        >
          Golden Patti · Traditional Flavours · Green Tea Collection
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 20,
            color: '#ffffff',
            opacity: 0.55,
          }}
        >
          steamasala.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
