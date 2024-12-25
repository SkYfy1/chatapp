import React, { useEffect, useState, useRef } from 'react'

const Audio = ({ audioMessage }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState();
    const ref = useRef();
    const handleAudio = () => {
        if (!isPlaying) {
            ref.current?.play();
            setIsPlaying(true)
        } else {
            ref.current?.pause();
            setIsPlaying(false)
        }
    }

    // const handleLoadedMetadata = () => {
    //     if (ref.current) {
    //         // console.log('duration?')
    //         setDuration(ref.current.duration);
    //     }
    // };

    useEffect(() => {
        ref.current.addEventListener('loadedmetadata', () => {
            if (ref.current.duration === Infinity || isNaN(Number(ref.current.duration))) {
                ref.current.currentTime = 1e101
                ref.current.addEventListener('timeupdate', getDuration)
            }
        })

        function getDuration(event) {
            event.target.currentTime = 0
            event.target.removeEventListener('timeupdate', getDuration)
            setDuration(event.target.duration)
        }
    }, [])

    // useEffect(() => {
    //     const reader = new FileReader();
    //     reader.onload = () => {
    //         const arrayBuffer = reader.result; // ArrayBuffer
    //         console.log(arrayBuffer);
    //     };
    //     reader.readAsArrayBuffer(audioMessage);
    // }, [audioMessage])

    // useEffect(() => {
    //     console.log("Blob URL:", audioMessage);
    //     console.log("Audio readyState:", controls.current?.readyState);
    //     console.log("Audio duration:", controls.current?.duration);
    // })

    return (
        <div className='audioControls'>
            <audio ref={ref} src={audioMessage}></audio>
            <button onClick={handleAudio}>
                {isPlaying ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                </svg>}
            </button>
            {duration && <span className='time'>{duration.toFixed()} сек</span>}
        </div>
    )
}

export default Audio
