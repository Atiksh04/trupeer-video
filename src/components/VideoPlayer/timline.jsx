import React, { useRef, useState, useMemo } from "react";
import { formatTime } from "../../utils";
import RightArrow from "./images/forward.svg";
import PropTypes from "prop-types";

export default function Timeline({
  duration,
  currentTime,
  zoomBlocks,
  onTimelineClick,
  onBlockUpdate,
}) {
  const timelineRef = useRef(null);
  const [draggingBlock, setDraggingBlock] = useState(null);
  const [dragType, setDragType] = useState(null); // 'start', 'end', or 'move'

  const handleTimelineClick = (e) => {
    if (timelineRef.current && !draggingBlock) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickedTime = (x / rect.width) * duration;
      onTimelineClick(clickedTime);
    }
  };

  const handleMouseDown = (e, block, type) => {
    e.stopPropagation();
    setDraggingBlock(block);
    setDragType(type);
  };

  const handleMouseMove = (e) => {
    if (draggingBlock && timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newTime = Math.max(
        0,
        Math.min((x / rect.width) * duration, duration)
      );

      let updatedBlock = { ...draggingBlock };

      if (dragType === "start") {
        updatedBlock.startTime = Math.min(newTime, draggingBlock.endTime - 0.1);
      } else if (dragType === "end") {
        updatedBlock.endTime = Math.max(newTime, draggingBlock.startTime + 0.1);
      } else if (dragType === "move") {
        const blockDuration = draggingBlock.endTime - draggingBlock.startTime;
        updatedBlock.startTime = Math.max(
          0,
          Math.min(newTime, duration - blockDuration)
        );
        updatedBlock.endTime = updatedBlock.startTime + blockDuration;
      }

      onBlockUpdate(updatedBlock);
    }
  };

  const handleMouseUp = () => {
    setDraggingBlock(null);
    setDragType(null);
  };

  const timeIntervals = useMemo(() => {
    const intervals = [0];
    const numberOfIntervals = 4;
    for (let i = 1; i < numberOfIntervals; i++) {
      intervals.push((i / numberOfIntervals) * duration);
    }
    intervals.push(duration);
    return intervals;
  }, [duration]);

  return (
    <>
      <div className="text-black mb-4 mt-4">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
      <div
        className="relative"
        ref={timelineRef}
        onClick={handleTimelineClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="w-full h-24 bg-gray-200 rounded relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 opacity-30"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>

          {zoomBlocks.map((block) => (
            <div
              key={block.id}
              className="absolute top-0 h-full bg-green-500 opacity-50 cursor-move rounded-l-md rounded-r-md"
              style={{
                left: `${(block.startTime / duration) * 100}%`,
                width: `${
                  ((block.endTime - block.startTime) / duration) * 100
                }%`,
              }}
              onMouseDown={(e) => handleMouseDown(e, block, "move")}
            >
              <div
                className="absolute left-0 top-0 w-2 h-full bg-yellow-500 cursor-w-resize flex items-center rounded-l-md select-none"
                onMouseDown={(e) => {
                  handleMouseDown(e, block, "start");
                }}
              >
                <img src={RightArrow} alt="left" className="h-2 w-2" />
              </div>
              <div
                className="absolute right-0 top-0 w-2 h-full bg-yellow-500 cursor-e-resize flex items-center rounded-r-md select-none"
                onMouseDown={(e) => {
                  handleMouseDown(e, block, "end");
                }}
              >
                <img
                  src={RightArrow}
                  alt="right"
                  className="h-2 w-2 rotate-180"
                />
              </div>
            </div>
          ))}
          <div
            className="absolute top-0 w-0.5 h-full bg-red-500"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          ></div>
          {timeIntervals.map((time, index) => (
            <div
              key={index}
              className="absolute top-0 w-px h-2 bg-gray-400"
              style={{ left: `${(time / duration) * 100}%` }}
            ></div>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-600 flex justify-between relative">
          {timeIntervals.map((time, index) => (
            <React.Fragment key={index}>
              <div
                className="absolute"
                style={{ left: `${(time / duration) * 100}%`, transform: 'translateX(-50%)' }}
              >
                <span>{formatTime(time)}</span>
              </div>
              {index === timeIntervals.length - 1 && (
                <div className="flex-grow" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

Timeline.propTypes = {
  onBlockUpdate: PropTypes.func,
  duration: PropTypes.number,
  currentTime: PropTypes.number,
  zoomBlocks: PropTypes.array,
  onTimelineClick: PropTypes.func,
};