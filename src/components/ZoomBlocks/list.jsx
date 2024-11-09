import { formatTime } from '../../utils'

export default function ZoomBlocksList({ zoomBlocks, selectedBlock, onBlockClick, onDeleteBlock,handleAddZoomBlock }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg h-[calc(100vh-200px)] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-2 text-black">Zoom Blocks</h2>
      <div className="space-y-2">
        {zoomBlocks.map(block => (
          <div 
            key={block.id} 
            className={`mb-2 p-2 bg-white rounded shadow text-black ${selectedBlock?.id === block.id ? 'border-2 border-theme-purple' : ''}`}
            onClick={() => onBlockClick(block)}
          >
            <p>Start: {formatTime(block.startTime)}</p>
            <p>End: {formatTime(block.endTime)}</p>
            <p>Scale: {block.scale.toFixed(2)}x</p>
            <button 
              className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteBlock(block.id)
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                onClick={handleAddZoomBlock}
              >
                Add Zoom Block
              </button>
            </div>
    </div>
  )
}