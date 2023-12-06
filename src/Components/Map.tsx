import 'mapbox-gl/dist/mapbox-gl.css';

import React, { Fragment, useEffect, useState } from 'react'
import ReactMapGl,
{
    Marker,
    ViewportProps,
    NavigationControl,
    Popup,
    Source,
    Layer
} from 'react-map-gl'
import { useSelector } from 'react-redux';

import { LocationType, PinLocationInterface, RootState } from '../Common/Types';
import { ACCESS_TOKEN } from '../Common/Constants';
import { fetchRoute, geocodeAddress } from '../Services/MapServices';

const Map: React.FC = () => {
    const addresses = useSelector((state: RootState) => state.Drop.parsedAddresses);
    const [viewPort, setViewPort] = useState<ViewportProps>({
        longitude: -122.0113,
        latitude: 37.33484,
        zoom: 10
    });
    const [searchAddress, setSearchAddress] = useState<string>('');
    const [searchPinLocation, setSearchPinLocation] = useState<LocationType | null>(null);
    const [pinLocations, setPinLocations] = useState<PinLocationInterface[]>([]);
    const [routeSource, setRouteSource] = useState<any | null>(null);

    const generatePinsOnMapHandler = async (address: string) => {
        try {
            const coordinates = await geocodeAddress(address);
            setPinLocations((prevState: PinLocationInterface[]) => [
                ...prevState,
                {
                    longitude: coordinates[0],
                    latitude: coordinates[1],
                    address: address.split(' ')[0]
                }
            ]);
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    const searchHandler = async () => {
        try {
            const coordinates = await geocodeAddress(searchAddress);
            setSearchPinLocation({
                longitude: coordinates[0],
                latitude: coordinates[1]
            });
            setViewPort({
                longitude: coordinates[0],
                latitude: coordinates[1],
                zoom: 16,
            });
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    useEffect(() => {
        if (addresses.length > 0) {
            addresses.forEach((address: string) => {
                setPinLocations([])
                generatePinsOnMapHandler(address)
            })
        }
    }, [addresses])

    const fetchRouteHandler = async (waypoints: LocationType[]) => {
        try {
            const routeSource = await fetchRoute(waypoints);
            setRouteSource(routeSource);
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    useEffect(() => {
        if (searchPinLocation && pinLocations.length > 0) {
            fetchRouteHandler([searchPinLocation, ...pinLocations])
        }
    }, [searchPinLocation, pinLocations]);

    return (<>
        <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', marginTop: '1rem' }}>
            <h3 style={{ margin: 0 }}>Search:</h3>
            &nbsp;
            <input
                onKeyDown={(e) => { if (e.key === 'Enter') searchHandler() }}
                onChange={(e) => { setSearchAddress(e.target.value) }}
                value={searchAddress}
            />
        </div>
        <div style={{ margin: '1rem 0 3rem', width: '100%', height: '70vh' }}>
            <ReactMapGl
                {...viewPort}
                width='100%'
                height='100%'
                mapboxApiAccessToken={ACCESS_TOKEN}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                onViewportChange={(viewPort: ViewportProps) => setViewPort(viewPort)}
                transitionDuration={300}
            >
                {pinLocations.length > 0 ?
                    pinLocations.map((pinLocation: PinLocationInterface, index: number) =>
                        <Fragment key={index}>
                            <Marker
                                latitude={pinLocation?.latitude}
                                longitude={pinLocation?.longitude}
                                offsetLeft={-24}
                                offsetTop={-48}
                            >
                                <img style={{ width: '3rem', height: 'auto' }} src='/pin.png' alt='pin-icon' />
                            </Marker>
                            <Popup
                                latitude={pinLocation.latitude}
                                longitude={pinLocation.longitude}
                                closeButton={false}
                                offsetTop={-48}
                            >
                                {pinLocation.address}
                            </Popup>
                        </Fragment>
                    )
                    :
                    null}
                {searchPinLocation ?
                    <Marker
                        latitude={searchPinLocation?.latitude}
                        longitude={searchPinLocation?.longitude}
                        offsetLeft={-24}
                        offsetTop={-48}
                    >
                        <img style={{ width: '3rem', height: 'auto' }} src='/red-pin.png' alt='red-pin-icon' />
                    </Marker>
                    :
                    null}
                <div style={{ position: 'absolute', top: 10, left: 10 }}>
                    <NavigationControl showCompass showZoom />
                </div>
                {routeSource &&
                    <Source type="geojson" data={routeSource}>
                        <Layer
                            id="route"
                            type="line"
                            paint={{
                                'line-color': '#0074D9',
                                'line-width': 3,
                            }}
                        />
                    </Source>}
            </ReactMapGl>
        </div>
    </>
    )
}

export default Map