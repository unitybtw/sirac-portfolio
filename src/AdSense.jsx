import React, { useEffect } from 'react';

/**
 * Google AdSense Ad Unit Component
 * 
 * Usage:
 * <AdSense slot="1234567890" style={{ margin: '2rem 0' }} />
 */
export default function AdSense({ slot, style }) {
  useEffect(() => {
    try {
      // Trigger Google AdSense to load the ad in this slot container
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('AdSense ad load deferred or failed:', e.message);
    }
  }, [slot]);

  return (
    <div 
      className="adsense-ad-wrapper" 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%', 
        overflow: 'hidden',
        margin: '1.5rem 0',
        minHeight: '90px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '8px',
        border: '1px dashed rgba(255, 255, 255, 0.08)',
        ...style 
      }}
    >
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minWidth: '250px' }}
        data-ad-client="ca-pub-0000000000000000"
        data-ad-slot={slot || "0000000000"}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
