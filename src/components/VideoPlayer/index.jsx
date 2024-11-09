import { useState, useRef, useEffect } from "react";
import VideoCanvas from "./canvas";
import ZoomBlocksList from "../ZoomBlocks/list";
import ZoomBlockPanel from "../ZoomBlocks/editor";
import Timeline from "./timline";
import PlusIcon from "./images/plus.svg";
import EmptyFile from "./images/empty-file.svg";

export default function VideoEditor() {
  const [video, setVideo] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomBlocks, setZoomBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const videoRef = useRef(null);
  const inputFileRef = useRef(null);

  const handleUploadVideoClick = () => {
    if (inputFileRef) inputFileRef.current.click();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setVideo(videoUrl);
      setTimeout(()=> handlePlayPause(), 100);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleAddZoomBlock = () => {
    const newBlock = {
      id: Date.now().toString(),
      startTime: currentTime,
      endTime: Math.min(currentTime + 5, duration),
      x: videoRef.current.videoWidth / 2,
      y: videoRef.current.videoHeight / 2,
      scale: 1.5,
    };
    setZoomBlocks([...zoomBlocks, newBlock]);
  };

  const handleBlockClick = (block) => {
    setSelectedBlock(block);
    setIsEditPanelOpen(true);
  };

  const handleBlockUpdate = (updatedBlock) => {
    setZoomBlocks(
      zoomBlocks.map((block) =>
        block.id === updatedBlock.id ? updatedBlock : block
      )
    );
    setSelectedBlock(updatedBlock);
  };

  const handleDeleteBlock = (id) => {
    setZoomBlocks(zoomBlocks.filter((block) => block.id !== id));
    if (selectedBlock?.id === id) {
      setSelectedBlock(null);
      setIsEditPanelOpen(false);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("loadedmetadata", () => {
        setDuration(videoRef.current.duration);
      });
    }
  }, [video]);

  return (
    <div className="container mx-auto p-4">
      <div className="border-b pb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black pb-2">Video Editor</h1>
        {!video && (
          <div>
            <div
              className="border rounded-full text-white flex items-center justify-center p-2 pr-3 bg-theme-purple border-cyan-600 cursor-pointer"
              onClick={handleUploadVideoClick}
            >
              <img src={PlusIcon} alt="plus-icon" className="w-4 h-4 mx-2" />
              Upload video
            </div>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="h-0 w-0 hidden"
              ref={inputFileRef}
            />
          </div>
        )}
      </div>

      {!video && (
        <div className="mt-64 w-full">
          <img src={EmptyFile} alt="empty file" className="h-24 w-24 mx-auto" />
          <div className="mt-4 text-center text-black">Upload a video to continue</div>
        </div>
      )}

      {video && (
        <div className="flex flex-col lg:flex-row gap-4 mt-6">
          <div className="w-full lg:w-[65%] order-1">
            <VideoCanvas
              videoRef={videoRef}
              video={video}
              zoomBlocks={zoomBlocks}
              isPlaying={isPlaying}
              handlePlayPause={handlePlayPause}
              handleTimeUpdate={handleTimeUpdate}
              currentTime={currentTime}
            />
            <Timeline
              duration={duration}
              currentTime={currentTime}
              zoomBlocks={zoomBlocks}
              onTimelineClick={(time) => {
                if (videoRef.current) {
                  videoRef.current.currentTime = time;
                }
              }}
              onBlockClick={handleBlockClick}
              onBlockUpdate={handleBlockUpdate}
            />
          </div>
          <div className="w-full lg:w-[35%] order-2">
            <ZoomBlocksList
              zoomBlocks={zoomBlocks}
              selectedBlock={selectedBlock}
              onBlockClick={handleBlockClick}
              onDeleteBlock={handleDeleteBlock}
              handleAddZoomBlock={handleAddZoomBlock}
            />
           
          </div>
        </div>
      )}
      <ZoomBlockPanel
        selectedBlock={selectedBlock}
        onBlockUpdate={handleBlockUpdate}
        duration={duration}
        isOpen={isEditPanelOpen}
        onClose={() => setIsEditPanelOpen(false)}
      />
    </div>
  );
}
