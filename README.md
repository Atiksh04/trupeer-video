# basic video zoom editor

### Deployed URL - https://mellow-toffee.netlify.app/

### Running locally - 
- Clone this repository
- Install dependencies using - `npm install` or `yarn`
- Start the local server - `npm run dev` or `yarn dev`

### Tech used - 
- React JS 
- Tailwind CSS

### Implemented Features
- Allows users to upload a video.
- Displays a video timeline representing the length of the uploaded video.
- Supports zoom blocks with full CRUD functionality.
- Enables direct editing of start times, end times and moving zoom blocks on the video timeline.
- Provides a live video preview with zoom blocks that update dynamically even when edited.

### Workflow
- After the video is uploaded, a hidden video element is rendered along with a visible canvas element for the video preview.
- A timeline component with second-by-second markings and labels is displayed.
- When a zoom block is created, the rendering logic checks the start and end times and applies the zoom effect to the live preview on the canvas.
- The zoom block on the timeline is draggable, allowing users to move or resize the block easily.
 
