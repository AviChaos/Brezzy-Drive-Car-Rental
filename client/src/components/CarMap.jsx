import React, { useEffect, useState } from 'react'

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',

  iconUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',

  shadowUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
})

function ChangeView({ center }) {

  const map = useMap()

  useEffect(() => {

    map.setView(center, 13)

  }, [center, map])

  return null
}

const CarMap = ({ location }) => {

  const [position, setPosition] = useState([19.0760, 72.8777])

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchCoordinates = async () => {

      try {

        setLoading(true)

        const response = await fetch(

          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`

        )

        const data = await response.json()

        if (data.length > 0) {

          setPosition([

            parseFloat(data[0].lat),

            parseFloat(data[0].lon)

          ])

        }

      }

      catch (error) {

        console.log(error)

      }

      finally {

        setLoading(false)

      }

    }

    if (location) {

      fetchCoordinates()

    }

  }, [location])

  return (

    <div className='mt-8'>

      <h1 className='text-xl font-medium mb-4'>

        Pickup Location

      </h1>

      {loading ? (

        <div className='h-80 flex items-center justify-center border border-borderColor rounded-xl'>

          Loading Map...

        </div>

      ) : (

        <div className='h-80 rounded-xl overflow-hidden'>

          <MapContainer

            center={position}

            zoom={13}

            scrollWheelZoom={false}

            style={{

              height: '100%',

              width: '100%'

            }}

          >

            <ChangeView center={position} />

            <TileLayer

              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

            />

            <Marker position={position}>

              <Popup>

                {location}

              </Popup>

            </Marker>

          </MapContainer>

        </div>

      )}

    </div>

  )

}

export default CarMap