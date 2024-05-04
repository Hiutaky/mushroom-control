import React, { useEffect, useRef, useState } from 'react';
import muxjs from 'mux.js';

const LiveStream = () => {
    const videoRef = useRef(null);
    const [ready, setReady] = useState(false)

    useEffect(() => {
        if( ready ) return
        setReady(true)
        console.log('running')
        const video = videoRef.current;
        const mediaSource = new MediaSource();
        video.src = URL.createObjectURL(mediaSource);
        let sourceBuffer;

        const transmuxer = new muxjs.mp4.Transmuxer();
        transmuxer.on('data', (segment) => {
            console.log('data')
            const data = new Uint8Array(segment.initSegment.byteLength + segment.data.byteLength);
            data.set(segment.initSegment, 0);
            data.set(segment.data, segment.initSegment.byteLength);
            sourceBuffer.appendBuffer(data);
        });

        const ws = new WebSocket('ws://localhost:3005');
        mediaSource.addEventListener('sourceopen', () => {
            sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
            ws.onmessage = event => {
                console.log(event)
                const reader = new FileReader();
                reader.onload = () => {
                transmuxer.push(new Uint8Array(reader.result));
                transmuxer.flush();
                };
                reader.readAsArrayBuffer(event.data);
            };
        });

        return () => {
            ws.close();
        };
    }, [videoRef.current]);

    const stopStream = () => {
        const ws = new WebSocket('ws://localhost:8080');
        ws.onopen = () => {
        ws.send('STOP');
        };
    };

    return (
        <div>
        <video ref={videoRef} autoPlay />
        <button onClick={stopStream}>Stop Stream</button>
        </div>
    );
};

export default LiveStream;