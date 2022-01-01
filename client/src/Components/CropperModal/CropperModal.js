import React, { useCallback, useState } from 'react'
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../Consts/cropImage';
import { Modal } from '@shopify/polaris';

export default function CropperModal(props) {

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)

    const active = props.active;
    const setActive = props.setActive;
    const onCropped = props.onCropped;
    const img = props.img;
    const handleChange = useCallback(() => setActive(!active), [active]);
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const retrieveCroppedImg = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                img,
                croppedAreaPixels,
                rotation
            )
            onCropped(croppedImage);
            handleChange();
        } catch (e) {
            console.error(e)
        }
    }, [croppedAreaPixels, rotation])


    return (
        <div className='CropperModal' style={{ height: '500px' }}>
            <Modal
                open={active}
                onClose={handleChange}
                title="Crop your image!"
                primaryAction={{
                    content: 'Confirm',
                    onAction: retrieveCroppedImg,
                }}
            >
                <Modal.Section>
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: 200,
                        background: '#333',
                    }} >
                        <Cropper
                            restrictPosition={false}
                            image={img}
                            crop={crop}
                            rotation={rotation}
                            zoom={zoom}
                            aspect={9 / 16}
                            onCropChange={setCrop}
                            onRotationChange={setRotation}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>

                </Modal.Section>
            </Modal>
        </div>
    )
}
