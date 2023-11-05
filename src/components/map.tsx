'use client'

import { Button, Checkbox } from "@nextui-org/react";
import { Burger } from "@/icons/burger";
import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Mouse } from "@/icons/mouse";
import { ZoomControl } from "@/icons/zoomControl";
import Coordinate from "@/icons/coordinate";
import { Geoloc } from "./geoloc";

const OSMWithNoSSR = dynamic(() => import("./osm"), {
  ssr: false,
});


export default function Map() {

  const [isCollapse, setIsCollapse] = useState<boolean>(true)
  const [goToDefLoc, setGoToDefLoc] = useState<boolean>(false)
  const [isUseScrollToZoom, setIsUseScrollToZoom] = useState<boolean>(false)
  const [isShowZoomControl, setIsShowZoomControl] = useState<boolean>(true)
  const [coordinate, setCoordinate] = useState<L.LatLng | undefined>(undefined)
  const [isShowLatLng, setIsShowLatLng] = useState<boolean>(false)
  const [isShowActionTools, setIsShowActionTools] = useState<boolean>(true)

  const CoordinateHandler = (coor: L.LatLng | undefined) => {
    setCoordinate(coor)
  }

  return (
    <div className="relative">

      {/* Side Bar */}
      <div className={`${isCollapse ? 'w-[60px]' : 'w-[300px]'} z-[991] overflow-x-hidden mt-20 backdrop-blur-md absolute duration-200 border-gray-400/40 border-2 ms-3 p-2 rounded-lg bg-white/20 shadow-xl h-[82vh] `}>
        <section className="flex items-center border-b-2 mb-2 border-gray-400/40 pb-2">
          <Button onPress={() => setIsCollapse(prev => !prev)} isIconOnly variant="light" color="primary">
            <Burger />
          </Button>
          <p className={`${isCollapse ? 'opacity-0' : 'opacity-100'} font-bold text-lg text-slate-600 text-center w-full mr-4 duration-200`}>Information</p>
        </section>
        <section className={`${isCollapse ? 'opacity-0' : 'opacity-100'} duration-200 w-[250px] overflow-hidden`}>
          <p className=" text-slate-600 font-bold">Settings</p>
          <Checkbox isSelected={isUseScrollToZoom} onValueChange={setIsUseScrollToZoom}><p className="text-slate-500">Use scroll to zoom in/out</p></Checkbox>
          <Checkbox isSelected={isShowZoomControl} onValueChange={setIsShowZoomControl}><p className="text-slate-500">Show zoom control</p></Checkbox>
          <Checkbox isSelected={isShowLatLng} onValueChange={setIsShowLatLng}><p className="text-slate-500">Show coordinate</p></Checkbox>
          <Checkbox isSelected={isShowActionTools} onValueChange={setIsShowActionTools}><p className="text-slate-500">Show action tool indicators</p></Checkbox>
        </section>
      </div>

      {/* Top Bar */}
      <div className={`z-[991] w-full absolute top-0 flex justify-center items-center p-3 duration-200 ${isShowActionTools ? 'translate-y-[0%]' : 'translate-y-[-100%]'}`}>
        <div className="border-2 border-gray-400/40 flex justify-center p-2 gap-2 items-center backdrop-blur-md h-[50px] w-auto bg-white/20 shadow-xl rounded-lg">

          <div title={`${isUseScrollToZoom ? 'Scroll to zoom is enabled' : 'Scroll to zoom is disabled'}`} className={`w-[35px] border border-gray-300 rounded-md flex justify-center items-center h-full ${isUseScrollToZoom ? 'bg-blue-500/50' : 'bg-white/50'}`} >
            <Mouse color={`${isUseScrollToZoom ? 'blue' : 'grey'}`} isFill={isUseScrollToZoom} />
          </div>

          <div title={`${isShowZoomControl ? 'Zoom control is enabled' : 'Zoom control is disabled'}`} className={`w-[35px] border border-gray-300 rounded-md flex justify-center items-center h-full ${isShowZoomControl ? 'bg-blue-500/50' : 'bg-white/50'}`}>
            <ZoomControl color={`${isShowZoomControl ? 'blue' : 'grey'}`} isFill={isShowZoomControl} />
          </div>

          <div title={`border border-gray-300 ${isShowLatLng ? 'Lat and Lng is shown' : 'Lat and Lng is hidden'}`} className={`${isShowLatLng ? 'w-[300px] bg-gray-400/50' : 'w-[35px] bg-white/50'} overflow-hidden duration-200 rounded-md flex justify-center items-center h-full`}>
            {
              isShowLatLng
                ?
                <div className="w-[310px] flex overflow-hidden justify-center items-center">
                  {
                    !!coordinate?.lat
                      ?
                      <>
                        <p className="font-semibold truncate text-slate-600 px-2 w-[120px]">lat: {coordinate?.lat.toFixed(4)}</p>
                        <p className="font-semibold truncate text-slate-600 px-2 w-[140px]">lng: {coordinate?.lng.toFixed(4)}</p>
                      </>
                      :
                      <p className="text-slate-600 truncate w-[300px] text-center">Drag map to see coordinate</p>
                  }
                </div>
                :
                <Coordinate color={`${isShowLatLng ? 'blue' : 'grey'}`} isFill={isShowLatLng} />
            }
          </div>
        </div>

        <div className="border-2 ml-2 border-gray-400/40 flex justify-center p-2 gap-2 items-center backdrop-blur-md h-[50px] w-auto bg-white/20 shadow-xl rounded-lg">
          <div title="Click to go to default location" onClick={() => setGoToDefLoc(prev => !prev)} className={`w-[35px] border border-gray-300 rounded-md flex justify-center items-center h-full duration-200 cursor-pointer bg-white/50 hover:bg-white/80`}>
            <Geoloc color="gray" />
          </div>
        </div>

      </div>
      <OSMWithNoSSR scrollToZoom={isUseScrollToZoom} zoomControl={isShowZoomControl} coordinate={CoordinateHandler} goToDefLoc={goToDefLoc} />
    </div>
  )
}