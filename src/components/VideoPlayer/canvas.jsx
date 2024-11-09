import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import PlayIcon from "./images/play.svg";
import PauseIcon from "./images/pause.svg";

export default function VideoCanvas({
  videoRef,
  video,
  zoomBlocks,
  isPlaying,
  handlePlayPause,
  handleTimeUpdate,
  currentTime,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const videoElement = videoRef.current;
    if (!canvas || !videoElement) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawFrame = () => {
      if (videoElement.paused || videoElement.ended) return;

      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const activeZoomBlock = zoomBlocks.find(
        (block) =>
          currentTime >= block.startTime && currentTime <= block.endTime
      );

      if (activeZoomBlock) {
        const { x, y, scale } = activeZoomBlock;

        // Calculate the dimensions of the zoom area
        const zoomWidth = canvas.width / scale;
        const zoomHeight = canvas.height / scale;

        // Calculate the source rectangle (area to be zoomed)
        const sourceX = Math.max(
          0,
          Math.min(x - zoomWidth / 2, canvas.width - zoomWidth)
        );
        const sourceY = Math.max(
          0,
          Math.min(y - zoomHeight / 2, canvas.height - zoomHeight)
        );

        // Draw the zoomed portion
        ctx.drawImage(
          videoElement,
          sourceX,
          sourceY,
          zoomWidth,
          zoomHeight,
          0,
          0,
          canvas.width,
          canvas.height
        );
      } else {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      }

      requestAnimationFrame(drawFrame);
    };

    videoElement.addEventListener("play", drawFrame);
    drawFrame();

    return () => {
      videoElement.removeEventListener("play", drawFrame);
    };
  }, [zoomBlocks, video, videoRef, currentTime]);

  return (
    <div className="mb-4 relative">
      <video
        ref={videoRef}
        src={video}
        className="hidden"
        onTimeUpdate={handleTimeUpdate}
      />
      <canvas ref={canvasRef} className="w-full aspect-video bg-black" />
      <div className="absolute bottom-4 left-4 space-x-2">
        <button
          className="px-4 py-2 bg-theme-purple text-white rounded"
          onClick={handlePlayPause}
        >
          <img
            src={isPlaying ? PauseIcon : PlayIcon}
            alt="play-icon"
            className="h-4 w-4 fill-white"
          />
        </button>
      </div>
    </div>
  );
}

VideoCanvas.propTypes = {
  videoRef: PropTypes.shape({
    current: PropTypes.instanceOf(HTMLVideoElement),
  }),
  video: PropTypes.string,
  zoomBlocks: PropTypes.array,
  isPlaying: PropTypes.bool,
  handlePlayPause: PropTypes.func,
  handleTimeUpdate: PropTypes.func,
  currentTime: PropTypes.number,
};
