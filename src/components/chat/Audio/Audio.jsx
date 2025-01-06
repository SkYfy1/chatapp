import React, { useEffect, useState, useRef } from 'react'
import MusicPlayerSlider from '../../ui/Slider';

const Audio = ({ audioMessage }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState();
    
    const progressBar = useRef(); // ref for progress bar
    const ref = useRef();   // ref for audio element   
    const timer = useRef(); // ref for timeout

    useEffect(() => {
        console.log(Math.ceil(duration), position)
        const timeout = () => {
            if (Math.ceil(duration) != position) {
                setPosition(prev => prev + 1);
            } else {
                setPosition(0)
                clearTimeout(timer.current);
                setIsPlaying(false);
            }
        }

        timer.current = isPlaying && setTimeout(timeout, 1000)

        return () => clearTimeout(timer.current)
    }, [isPlaying, position])

    const handleAudio = (event) => {
        event.stopPropagation();
        console.log(ref.current)
        if (!isPlaying) {
            ref.current?.play();
            setIsPlaying(true);
        } else {
            ref.current?.pause();
            clearTimeout(timer.current)
            setIsPlaying(false)
        }
    }

    const changeProgress = (value) => {
        console.log(ref.current.currentTime)
        ref.current.currentTime = value;
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
                {isPlaying ?
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                    </svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                    </svg>}
            </button>
            {/* <input className='range' value={position} max={Math.ceil(duration)} type="range" /> */}
            <MusicPlayerSlider duration={duration} position={position} setPosition={setPosition} isPlaying={isPlaying} changeProgress={changeProgress}/>
            {duration && <span className='time'>{duration.toFixed()} сек</span>}
        </div>
    )
}

export default Audio
