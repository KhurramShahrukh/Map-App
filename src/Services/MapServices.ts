import axios from 'axios';

import { ACCESS_TOKEN } from '../Common/Constants';
import { LocationType } from '../Common/Types';

export const geocodeAddress = async (address: string) => {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${ACCESS_TOKEN}`
    );
    return response.data.features[0].geometry.coordinates;
  } catch (error) {
    throw new Error(`Error in geocodeAddress ${error}`);
  }
};

export const fetchRoute = async (waypoints: LocationType[]) => {
  try {
    const coordinates = waypoints
      .map((waypoint) => `${waypoint.longitude},${waypoint.latitude}`)
      .join(';');
    const response = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${ACCESS_TOKEN}`
    );
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: response.data.routes[0].geometry.coordinates,
          },
        },
      ],
    };
  } catch (error) {
    throw new Error(`Error in fetchRoute ${error}`);
  }
};