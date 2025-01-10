import React, { useEffect } from 'react'
import { Badge, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { statusColor } from '../../utils/statusColor';
import { useAuthStore } from '../../context/useAuthStore';
import useAppStore from '../../context/useAppStore';

const StyledBadge = styled(Badge)(({ theme, badgeColor, anim }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: badgeColor,
        color: badgeColor,
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: '-1px',
            left: '-1px',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: `${anim && 'ripple'} 1.2s infinite ease-in-out`,
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.5)',
            opacity: 0,
        },
    },
}));

const MiniAvatar = ({ img, status }) => {
    const currentUser = useAuthStore(state => state.currentUser);
    const anims = currentUser.hasOwnProperty('settings') ? currentUser?.settings?.animations : true;
    const isMobile = useAppStore(state => state.isMobile);


    useEffect(() => {
        console.log('tel ' + isMobile);
        console.log(status);
    }, [isMobile]);

    if (status === 'offline') {
        return (
            <img src={!img
                ? './avatar.png'
                : img || './avatar.png'} alt="" />
        )
    };
    return (
        <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            badgeColor={statusColor[status]}
            anim={anims}
        >
            <Avatar alt="Remy Sharp" src={img} sx={{ height: '50px', width: '50px' }} />
        </StyledBadge>
    )
}

export default MiniAvatar
