import React, { useCallback, useState, useEffect } from 'react'
import ReactCrop from 'react-image-crop';
import { useDispatch, useSelector } from 'react-redux';
import { update } from '../../Redux/profile/profileSlice';
import { Form, FormLayout, TextField, Button, Card, DropZone, Caption, Select } from '@shopify/polaris';
import { NoteMinor } from '@shopify/polaris-icons';
import 'react-image-crop/dist/ReactCrop.css';
import './ProfileForm.css';

// The image should be Crop option to size 16:9 
// Short description about yourself - Should be able to add bullets, bold text, and colors 

export default function ProfileForm() {

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
        var newProfileData = {
            uid: profile.uid,
            //image url will be updated after link has returned from server
            profile_image_url: window.URL.createObjectURL(file),
            title: jobTitle,
            company: currentCompany,
            about: about,
            phone: phone,
            area: areacode
        };
        // console.log(newProfileData)
        dispatch(update(newProfileData))
        // localStorage.setItem("profile", JSON.stringify(newProfileData))

        // setFile(null);
        // setJobTitle('');
        // setCurrentCompany('');
        // setAbout('');
        // setPhone('');
    };

    const isSaveButtonDisabled = () => {
        const phoneRegex = /^\+?(972|0)(\-)?0?(([23489]{1}\d{7})|[5]{1}\d{8})$/;
        return file === null || jobTitle.length === 0 || currentCompany.length === 0 || about.length === 0 || phone.length === 0 || phoneRegex.test(phone) === false;
    }
    const handleDropZoneDrop = useCallback(
        (_dropFiles, acceptedFiles, _rejectedFiles) =>
            setFile((file) => acceptedFiles[0]),
        [],
    );
    const handleJobTitleChange = useCallback((value) => setJobTitle(value), []);
    const handleCurrentCompanyChange = useCallback((value) => setCurrentCompany(value), []);
    const handleAboutChange = useCallback((value) => setAbout(value), []);
    const handleAreaCodeChange = useCallback((value) => setAreacode(value), []);
    const handlePhoneChange = useCallback((value) => setPhone(value), []);

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    const fileUpload = !file && <DropZone.FileUpload />;
    const uploadedFile = file && (
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
            </Card>

        </div>
    )
}
