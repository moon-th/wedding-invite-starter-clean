// components/KakaoMap.tsx
'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

type Props = {
  address?: string;
  place?: string;
  fallbackLat?: number;
  fallbackLng?: number;
  height?: number;
};

declare global {
  interface Window {
    kakao: any;
  }
}

export default function KakaoMap({
  address,
  place,
  fallbackLat = 37.5665,
  fallbackLng = 126.978,
  height = 240,
}: Props) {
  const key = process.env.NEXT_PUBLIC_KAKAO_API_KEY || '';
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready || !mapRef.current || !window.kakao?.maps) return;

    window.kakao.maps.load(() => {
      const maps = window.kakao.maps;
      const defaultCenter = new maps.LatLng(fallbackLat, fallbackLng);

      if (!mapInstance.current) {
        mapInstance.current = new maps.Map(mapRef.current, {
          center: defaultCenter,
          level: 3,
          draggable: false,
          scrollwheel: false,
          disableDoubleClick: true,
          disableDoubleClickZoom: true,
        });
        mapInstance.current.setDraggable(false);
        mapInstance.current.setZoomable(false);
        markerInstance.current = new maps.Marker({ position: defaultCenter });
        markerInstance.current.setMap(mapInstance.current);
      } else {
        mapInstance.current.setCenter(defaultCenter);
        markerInstance.current?.setPosition(defaultCenter);
      }

      const target = address || place;
      if (target && maps.services) {
        const geocoder = new maps.services.Geocoder();
        geocoder.addressSearch(target, (result: any[], status: string) => {
          if (status === maps.services.Status.OK && result?.length) {
            const { y, x } = result[0];
            const loc = new maps.LatLng(Number(y), Number(x));
            mapInstance.current.setCenter(loc);
            markerInstance.current?.setPosition(loc);
          }
        });
      }
    });
  }, [ready, address, place, fallbackLat, fallbackLng]);

  if (!key) {
    return <div className="kakao-map" style={{ height }}>카카오맵 키가 없습니다.</div>;
  }

  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&libraries=services&autoload=false`}
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />
      <div className="kakao-map" ref={mapRef} style={{ height }} />
    </>
  );
}
