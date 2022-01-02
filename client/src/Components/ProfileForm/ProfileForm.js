import React, { useCallback, useState, useEffect } from 'react'
import CropperModal from '../CropperModal/CropperModal';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useDispatch, useSelector } from 'react-redux';
import { update } from '../../Redux/profile/profileSlice';
import { ProgressBar, Form, FormLayout, TextField, Button, Card, DropZone, Caption, Select } from '@shopify/polaris';
import { NoteMinor } from '@shopify/polaris-icons';
import './ProfileForm.css';
import { storage } from '../../Firebase/firebase';

export default function ProfileForm() {

    const [isCropModalShown, setIsCropModalShown] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [downloadingPerc, setDownloadingPerc] = useState(0);
    const [file, setFile] = useState();
    const [jobTitle, setJobTitle] = useState('');
    const [currentCompany, setCurrentCompany] = useState('');
    const [about, setAbout] = useState('');
    const [areacode, setAreacode] = useState('+972');
    const [phone, setPhone] = useState('');

    const profile = useSelector((state) => state.profile.value);
    const dispatch = useDispatch();

    useEffect(() => {

        setJobTitle(profile.title);
        setCurrentCompany(profile.company);
        setAbout(profile.about);
        setPhone(profile.phone);
        setAreacode(profile.areacode);
        return () => {

        }
    }, [])

    const handleSubmit = () => {

        const imageRef = ref(storage, profile.uid + '/' + profile.uid);
        const uploadTask = uploadBytesResumable(imageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                setIsUploading(true);
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setDownloadingPerc(progress);
            },
            (error) => {
                // Handle unsuccessful uploads
                setIsUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    var newProfileData = {
                        uid: profile.uid,
                        profile_image_url: downloadURL,
                        title: jobTitle,
                        company: currentCompany,
                        about: about,
                        phone: phone,
                        areacode: areacode
                    };

                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newProfileData)
                    };
                    fetch('/profile/update', requestOptions)
                        .then(response => response.json())
                        .then(data => {
                            dispatch(update(newProfileData))
                            setIsUploading(false);
                        }).catch(() => {
                            setIsUploading(false);
                        });
                });
            }
        );
    };

    const handleCropped = (croppedImage) => {
        setFile(croppedImage);
    }

    const isSaveButtonDisabled = () => {
        const phoneRegex = /^\(?([0-9]{2})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        return file === null || jobTitle.length === 0 || currentCompany.length === 0 || about.length === 0 || phone.length === 0 || phoneRegex.test(phone) === false || isUploading;
    }
    const handleDropZoneDrop = useCallback(
        (_dropFiles, acceptedFiles, _rejectedFiles) => { setFile((file) => acceptedFiles[0]); setIsCropModalShown(true) },
        [],
    );
    const handleJobTitleChange = useCallback((value) => setJobTitle(value), []);
    const handleCurrentCompanyChange = useCallback((value) => setCurrentCompany(value), []);
    const handleAboutChange = useCallback((value) => setAbout(value), []);
    const handleAreaCodeChange = useCallback((value) => setAreacode(value), []);
    const handlePhoneChange = useCallback((value) => setPhone(value), []);

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    const fileUpload = !file && !profile.profile_image_url && <DropZone.FileUpload />;
    const uploadedFile = file ? (
        <div>
            <img
                width="100%"
                height="100%"
                style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                }}
                alt={file.name}
                src={
                    validImageTypes.includes(file.type)
                        ? window.URL.createObjectURL(file)
                        : NoteMinor
                } />
            <div>
                {file.name} <Caption>{file.size} bytes</Caption>
            </div>
        </div>
    ) : (
        <div>
            <img
                width="100%"
                height="100%"
                style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                }}
                alt='profile'
                src={profile.profile_image_url} />
        </div>
    );


    return (
        <div className='ProfileForm'>
            <Card title="User Profile" sectioned>
                <Form noValidate onSubmit={handleSubmit}>
                    <FormLayout>
                        <Card title="Profile picture">
                            <DropZone allowMultiple={false} onDrop={handleDropZoneDrop}>
                                {uploadedFile}
                                {fileUpload}
                            </DropZone>
                        </Card>
                        <TextField
                            value={jobTitle}
                            onChange={handleJobTitleChange}
                            label="Job title"
                            type="text"
                            autoComplete="off"
                            showCharacterCount
                            maxLength={20}
                        />
                        <TextField
                            value={currentCompany}
                            onChange={handleCurrentCompanyChange}
                            label="Current company"
                            type="text"
                            autoComplete="off"
                            showCharacterCount
                            maxLength={20}
                        />
                        <TextField
                            label="About yourself"
                            value={about}
                            onChange={handleAboutChange}
                            multiline={4}
                            autoComplete="off"
                        />

                        <TextField
                            label="Phone number"
                            type="tel"
                            value={phone}
                            onChange={handlePhoneChange}
                            autoComplete="off"
                            connectedLeft={
                                <Select
                                    value={areacode}
                                    label="Area code"
                                    onChange={handleAreaCodeChange}
                                    labelHidden
                                    options={['+972', '+1', '+91']}
                                />
                            }
                        />

                        <div className="Save-Btn-Container">
                            <Button disabled={isSaveButtonDisabled()} className="Save-Btn" submit>Save</Button>
                        </div>
                    </FormLayout>
                </Form>
                {
                    isUploading &&
                    (
                        <div className='ProgressBar-Container'>
                            <ProgressBar progress={downloadingPerc} size="small" />
                        </div>
                    )
                }
            </Card>
            <CropperModal img={file ? window.URL.createObjectURL(file) : ''} active={isCropModalShown} setActive={setIsCropModalShown} onCropped={handleCropped} />
        </div>
    )
}
