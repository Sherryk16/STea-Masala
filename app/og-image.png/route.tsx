import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Stea Masala – Premium Masala Tea';
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
          backgroundImage: 'linear-gradient(135deg, #1a0a00 0%, #2d1810 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #D4A017, #FF6F00)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            }}
          >
            ☕ Stea Masala
          </div>
        </div>
        
        <div
          style={{
            fontSize: 36,
            color: '#ffffff',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
            fontWeight: 300,
          }}
        >
          Premium Masala Tea
        </div>
        
        <div
          style={{
            marginTop: 20,
            fontSize: 24,
            color: '#D4A017',
            textAlign: 'center',
          }}
        >
          Cardamom · Cinnamon · Saffron · Assam Black Tea
        </div>
        
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 20,
            color: '#ffffff',
            opacity: 0.6,
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
