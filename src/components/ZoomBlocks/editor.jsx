import CloseIcon from "./images/close.svg"

export default function ZoomBlockPanel({ selectedBlock, onBlockUpdate, duration, isOpen, onClose }) {
  if (!selectedBlock) return null;

  return (
    <div className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out min-w-[500px] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-black mb-4">Edit Zoom Block</h2>
        <button 
          className="absolute top-4 right-4 bg-white text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <img src={CloseIcon} alt="close-icon" className="h-4 w-4"/>
        </button>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input 
              type="number" 
              value={parseFloat(selectedBlock.startTime).toFixed(1)}
              onChange={(e) => onBlockUpdate({...selectedBlock, startTime: Number(e.target.value)})}
              min={0}
              max={duration}
              step={0.1}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input 
              type="number" 
              value={parseFloat(selectedBlock.endTime).toFixed(1)}
              onChange={(e) => onBlockUpdate({...selectedBlock, endTime: Number(e.target.value)})}
              min={0}
              max={duration}
              step={0.1}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">X Coordinate</label>
            <input 
              type="number" 
              value={selectedBlock.x}
              onChange={(e) => onBlockUpdate({...selectedBlock, x: Number(e.target.value)})}
              min={0}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Y Coordinate</label>
            <input 
              type="number" 
              value={selectedBlock.y}
              onChange={(e) => onBlockUpdate({...selectedBlock, y: Number(e.target.value)})}
              min={0}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Scale Factor</label>
            <input 
              type="number" 
              value={selectedBlock.scale}
              onChange={(e) => onBlockUpdate({...selectedBlock, scale: Number(e.target.value)})}
              min={1}
              step={0.1}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            />
          </div>
        </div>
      </div>
    </div>
  )
}