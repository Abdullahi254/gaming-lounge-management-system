import React from 'react';
import BackDrop from '../../../../BackDrop/BackDrop';
import AddConsoleForm from './AddConsoleForm';

function UpdateConsoleForm({ name, brandProp, generationProp, price, open, handleClose, id }) {
    const handleClick = () => {
        handleClose()
    }
    return (
        <>
            <BackDrop open={open} clicked={handleClick} />
            <AddConsoleForm
                popup
                name={name}
                brandProp={brandProp}
                generationProp={generationProp}
                price={price}
                id={id}
                sx={{
                    position: 'fixed',
                    zIndex: (theme) => theme.zIndex.drawer + 10,
                    display:open?'flex':'none'
                }}
            />
        </>
    );
}

export default UpdateConsoleForm;
