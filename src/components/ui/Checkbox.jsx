import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import useAppStore from '../../context/useAppStore';

export default function ControlledCheckbox({ user }) {
    const addGroupMembers = useAppStore(state => state.addGroupMembers);
    const groupMembers = useAppStore(state => state.groupMembers);
    const deleteGroupMembers = useAppStore(state => state.deleteGroupMembers);

    const handleAdd = () => {
        addGroupMembers(user);
    };
    const handleDelete = () => {
        deleteGroupMembers(user);
    };

    const inArray = groupMembers.find((el) => el == user) ? true : false

    React.useEffect(() => {
        console.log(groupMembers)
    }, [groupMembers]);

    // React.useEffect(() => {
    //     console.log(inArray)
    // }, [])

    return (
        <Checkbox
            onClick={(e) => { e.stopPropagation() }}
            sx={{
                marginLeft: 'auto'
            }}
            checked={groupMembers.includes(user)}
            onChange={inArray ? handleDelete : handleAdd}
            inputProps={{ 'aria-label': 'controlled' }}
        />
    );
}