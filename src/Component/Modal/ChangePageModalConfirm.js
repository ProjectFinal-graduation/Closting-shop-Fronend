import React from 'react'
import { Button, Modal } from 'antd'
import { useNavigate } from 'react-router-dom';

export default function ChangePageModalConfirm(props) {
    const navigation = useNavigate();
    const { MustGoToPath, Show, OnClose } = props;

    const HandleNo = () => {
        OnClose();
    }

    const HandleYes = () => {
        navigation(MustGoToPath);
        OnClose();
    }

    return (
        <Modal
            closable
            open={Show}
            OnClose={OnClose}
            onCancel={OnClose}
            okButtonProps={{ className: "d-none" }}
            cancelButtonProps={{ className: "d-none" }}
        >
            <div className='p-5 text-center'>
                <h4>Are you sure you want to leave?</h4>
                <h5 className='mt-4'>
                    You are about to leave this page no progress will be save.
                </h5>
                <div className='d-flex mt-5 justify-content-between'>
                    <Button onClick={HandleNo} size='large'>NO</Button>
                    <Button onClick={HandleYes} size='large'>YES</Button>
                </div>
            </div>
        </Modal>
    )
}
