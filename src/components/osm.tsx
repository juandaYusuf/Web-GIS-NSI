'use client'
import { Circle, CircleMarker, FeatureGroup, LayersControl, MapContainer, Marker, Polygon, Polyline, Popup, Rectangle, TileLayer } from "react-leaflet"
import L from 'leaflet'
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState, useImperativeHandle } from "react";
import { Spinner } from "@nextui-org/react";



type TIconAttr = L.Icon<{
  iconUrl: string;
  iconRetinaUrl: string;
  iconAnchor: [number, number];
  popupAnchor: [number, number];
  iconSize: [number, number];
  iconShadowSize: number[];
}>

type TPoilygon = [
  [number, number],
  [number, number],
  [number, number]
]

type TReactangle = [
  [number, number],
  [number, number]
]

type TProps = {
  scrollToZoom: boolean
  zoomControl: boolean
  coordinate: (coor: L.LatLng | undefined) => void
  goToDefLoc: boolean
}

type TColorOptions = {
  purple: {
    color: string
  }
  green: {
    color: string
  }
  red: {
    color: string
  },
  yellow: {
    color: string
  }
}

type TLine = [
  [
    [number, number],
    [number, number],
    [number, number],
  ]
]

type TMultiLine = [
  [
    [number, number],
    [number, number],
    [number, number],
  ],
  [
    [number, number],
    [number, number],
    [number, number],
  ]
]

export default function Osm({ scrollToZoom, zoomControl, coordinate, goToDefLoc = false }: TProps) {

  const [myLocate, setMyLocate] = useState<[number, number]>([-6.1754, -253.1717])
  const [loading, setLoading] = useState<boolean>(false)
  const position: [number, number] = [-6.1754, -253.1717]
  const tileAttr: string = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  const tileURL: string = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  const colorOptions: TColorOptions = {
    purple: {
      color: 'purple'
    },
    green: {
      color: 'green'
    },
    red: {
      color: 'red'
    },
    yellow: {
      color: 'yellow'
    }
  }
  const map = useRef<L.Map>(null);
  const polygon: TPoilygon = [
    [-6.1754, -253.1717],
    [-6.1500, -253.1817],
    [-6.1797, -253.1917],
  ]
  const rectangle: TReactangle = [
    [-6.1754, -253.1717],
    [-6.1954, -253.1517],
  ]
  const line: TLine = [
    [
      [-6.1754, -253.1717],
      [-6.1754, -253.1917],
      [-6.1954, -253.1917],
    ],
  ]
  const multiLine: TMultiLine = [
    [
      [-6.1754, -253.1717],
      [-6.1554, -253.1517],
      [-6.1654, -253.1517],
    ],
    [
      [-6.1754, -253.1717],
      [-6.1554, -253.1517],
      [-6.1454, -253.1617],
    ],
  ]
  const iconAttr: TIconAttr = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    iconSize: [25, 41],
    iconShadowSize: [4, 62],
  })

  const scrollToZoomHandler = (isEnabled: boolean, ref: React.RefObject<L.Map>) => {
    if (ref.current) {
      if (isEnabled) {
        ref.current.scrollWheelZoom.enable()
      } else {
        ref.current.scrollWheelZoom.disable()
      }
    }
  }

  const goToMyLocate = () => {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        setMyLocate([latitude, longitude])
        if (map.current) {
          map.current.flyTo([latitude, longitude], map.current.getZoom())
          setLoading(false)
        }
      })
    }
  }

  const goToDeffaultLocate = () => {
    setMyLocate([-6.1754, -253.1717])
    if (map.current) {
      map.current.flyTo([-6.1754, -253.1717], map.current.getZoom())
    }
  }


  const showZoomControlHandler = (isEnabled: boolean, ref: React.RefObject<L.Map>) => {
    if (ref.current) {
      if (isEnabled) {
        ref.current.zoomControl.addTo(ref.current)
      } else {
        ref.current.zoomControl.remove()
      }
    }
  }

  useEffect(() => {
    if (map.current) {
      scrollToZoomHandler(scrollToZoom, map)
      showZoomControlHandler(zoomControl, map)
    }
  }, [scrollToZoom, zoomControl])

  useEffect(() => {
    if (map.current) {
      map.current.on('move', () => {
        coordinate(map.current?.getCenter())
      })
    }

    return () => {
      if (map.current) {
        map.current.off('move')
      }
    }
  }, [map, coordinate])

  useEffect(() => goToDeffaultLocate(), [goToDefLoc])



  return (
    <MapContainer ref={map} style={{ width: '100%', height: '100vh' }} zoomControl={true} center={position} zoom={13} scrollWheelZoom={false}>
      <TileLayer attribution={tileAttr} url={tileURL} />
      <LayersControl position="topright">
        <LayersControl.Overlay checked name="Show marker">
          <Marker icon={iconAttr} position={[myLocate[0], myLocate[1]]}>
            <Popup>
              <div className="w-[200px]">
                {
                  myLocate[0] === position[0] && myLocate[1] === position[1]
                    ?
                    <>
                      <div className="font-bold">
                        {!!loading
                          ?
                          <div className="flex gap-2">
                            <Spinner size="sm" color="primary" />
                            <p>Finding your location... </p>
                          </div>
                          :
                          <div className="flex">
                            <p>This is Jakarta</p>
                          </div>
                        }
                      </div>
                      <p className="text-blue-500 cursor-pointer hover:underline" onClick={goToMyLocate}>Go to my location</p>
                    </>
                    :
                    <>
                      <div className="font-bold">
                        {!!loading
                          ?
                          <div className="flex gap-2">
                            <Spinner size="sm" color="primary" />
                            <p>Finding your location... </p>
                          </div>
                          :
                          <div className="flex">
                            <p>This is your location</p>
                          </div>
                        }
                      </div>
                      <p className="text-blue-500 cursor-pointer hover:underline" onClick={goToDeffaultLocate}>Go to default location</p>
                    </>
                }
              </div>
            </Popup>
          </Marker>

        </LayersControl.Overlay>
        <LayersControl.Overlay name="Show polygon">
          <Polygon pathOptions={colorOptions.green} positions={polygon} >
            <Popup>
              This is Polygon
            </Popup>
          </Polygon>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Show Rectangle">
          <Rectangle bounds={rectangle} pathOptions={colorOptions.purple} >
            <Popup>
              This is Rectangle
            </Popup>
          </Rectangle>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Show single Line">
          <Polyline pathOptions={colorOptions.red} positions={line} />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Show Circle">
        <FeatureGroup pathOptions={colorOptions.yellow}>
            <Circle center={[-6.1954, -253.1917]} radius={400}>
              <Popup>Popup in Circle 1</Popup>
            </Circle>
            <Circle center={[-6.1454, -253.1617]} radius={400}>
              <Popup>Popup in Circle 2</Popup>
            </Circle>
            <Circle center={[-6.1654, -253.1517]} radius={400}>
              <Popup>Popup in Circle 3</Popup>
            </Circle>
        </FeatureGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Show multi Line">
          <Polyline pathOptions={colorOptions.red} positions={multiLine} />
        </LayersControl.Overlay>
      </LayersControl>

    </MapContainer>
  )
}