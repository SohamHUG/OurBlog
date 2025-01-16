import * as React from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import './Modal.scss';

const Modal = (props) => {

    React.useEffect(() => {
        if (props.open) {
            document.body.classList.add('block');
        } else {
            document.body.classList.remove('block');
        }

        return () => {
            document.body.classList.remove('block');
        };
    }, [props.open]);

    return (

        <div className='modal-container' onClick={props.cancel}>
            <div className='modal-content' onClick={(e) => { e.stopPropagation() }}>
                <div className='modal-header'>
                    <span className='close-modal-btn' onClick={props.cancel}>
                        <CloseOutlinedIcon />
                    </span>

                </div>

                <div className='modal-main'>
                    <h2>{props.title}</h2>
                    {props.content}
                </div>
                <div className='modal-footer'>
                    {
                        props.validButton &&
                        <button onClick={props.valid}>
                            {props.validButton}
                        </button>
                    }

                    {
                        props.cancelButton &&
                        <button onClick={props.cancel}>
                            {props.cancelButton}
                        </button>
                    }
                </div>
            </div>
        </div>

    )
}

export default Modal;