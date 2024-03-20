import React, { FC } from 'react';
import GoogleMapReact from 'google-map-react';
import MapMarker from '@/appIcons/location.jpg';
import Image from 'next/image';

type Props = {
  lat: string;
  lng: string;
  height?: number;
};
const ElementMap: FC<Props> = ({ lat, lng, height = 600 }) => {
  const LocationMarker = ({ icon }: any) => (
    <Image src={icon} alt="map marker" width={60} height={60} />
  );

  return (
    <div className={`w-full h-[600px] mb-3 `}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: 'AIzaSyChibV0_W_OlSRJg2GjL8TWVU8CzpRHRAE',
          language: 'en',
          region: 'US',
        }}
        defaultCenter={{
          lat: parseInt(lat),
          lng: parseInt(lng),
        }}
        defaultZoom={11}
      >
        <LocationMarker
          lat={parseInt(lat)}
          lng={parseInt(lng)}
          icon={MapMarker}
        />
      </GoogleMapReact>
    </div>
  );
};

export default ElementMap;
