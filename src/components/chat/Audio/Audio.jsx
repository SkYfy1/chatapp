import React, { useEffect, useState } from 'react'

const Audio = ({ controls, audioMessage, }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState();
    const handleAudio = () => {
        if (!isPlaying) {
            controls.current?.play();
            setIsPlaying(true)
        } else {
            controls.current?.pause();
            setIsPlaying(false)
        }
    }

    const handleLoadedMetadata = () => {
        if (controls.current) {
            // console.log('duration?')
            setDuration(controls.current.duration);
        }
    };

    // useEffect(() => {
    //     console.log("Blob URL:", audioMessage);
    //     console.log("Audio readyState:", controls.current?.readyState);
    //     console.log("Audio duration:", controls.current?.duration);
    // })

    return (
        <div className='audioControls'>
            <audio onLoadedMetadata={handleLoadedMetadata} ref={controls} src={audioMessage}></audio>
            <button onClick={handleAudio}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                </svg>
            </button>
            <button onClick={handleAudio}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                </svg>
            </button>
            {duration && <p>Длительность: {duration.toFixed(2)} сек</p>}
        </div>
    )
}

export default Audio
