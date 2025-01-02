import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import '../settings/userSettings.css'
import userService from '../../services/userService';

export default function BasicSelect({ id }) {
    const [status, setStatus] = React.useState('');

    const handleChange = async (event) => {
        setStatus(event.target.value);
        await userService.changeStatus(id, event.target.value)
    };

    return (
        <FormControl sx={{ minWidth: 120, color: 'white' }} className='form' size="small">
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
                sx={{ pl: 3, color: 'white' }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status}
                label="status"
                onChange={handleChange}
            >
                <MenuItem value={'online'}>Online</MenuItem>
                <MenuItem value={'dnd'}>Don't disturb</MenuItem>
                <MenuItem value={'Busy'}>Busy</MenuItem>
            </Select>
        </FormControl>
    );
}