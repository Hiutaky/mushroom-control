import NodeWebcam from "node-webcam"

export const getVideoSources = () => {
    NodeWebcam.list( function( list ) {
        console.log(list)
    
    });
}