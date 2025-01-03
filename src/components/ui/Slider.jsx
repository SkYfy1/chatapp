import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

const Widget = styled('div')(({ theme }) => ({
    padding: 5,
    borderRadius: 16,
    width: 80,
    maxWidth: '100%',
    display: 'flex',
    position: 'relative',
    zIndex: 1,
    // backdropFilter: 'blur(40px)',
    ...theme.applyStyles('dark', {
        backgroundColor: 'rgba(0,0,0,0.6)',
    }),
}));

export default function MusicPlayerSlider({ duration, position, setPosition, ref, changeProgress }) {
    function formatDuration(value) {
        const minute = Math.floor(value / 60);
        const secondLeft = value - minute * 60;
        return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
    }
    return (
        <Widget>
            <Slider
                aria-label="time-indicator"
                size="small"
                value={position}
                min={0}
                step={1}
                max={duration}
                ref={ref}
                onChange={(_, value) => { setPosition(value); changeProgress(value)}}
                sx={(t) => ({
                    color: 'rgba(255, 255, 255, 0.87)',
                    height: 3,
                    '& .MuiSlider-thumb': {
                        width: 8,
                        height: 8,
                        transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                        '&::before': {
                            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                        },
                        '&:hover, &.Mui-focusVisible': {
                            boxShadow: `0px 0px 0px 8px ${'rgb(0 0 0 / 16%)'}`,
                            ...t.applyStyles('dark', {
                                boxShadow: `0px 0px 0px 8px ${'rgb(255 255 255 / 16%)'}`,
                            }),
                        },
                        '&.Mui-active': {
                            width: 20,
                            height: 20,
                        },
                    },
                    '& .MuiSlider-rail': {
                        opacity: 0.28,
                    },
                    ...t.applyStyles('dark', {
                        color: '#fff',
                    }),
                })}
            />
        </Widget>
    );
}
