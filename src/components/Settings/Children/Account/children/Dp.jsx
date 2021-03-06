import React from 'react';
import {
    Box,
    Card,
    CardMedia,
    CardActions, Button,
    Typography,
    TextField,
    Input,
    Alert,
    LinearProgress
} from '@mui/material'
import { styled } from '@mui/material/styles';
import testDp from '../../../../../assets/imgs/placeholder.png'
import { useAuth } from '../../../../../contexts/AuthContext'
import { storage } from '../../../../../firebase/firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

const StyledBox = styled(Box)(({ theme }) => ({
    background: theme.palette.background.paper,
    padding: 20,
    display: 'flex',
    margin: 10,
    borderRadius: '20px',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: 'rgb(0, 0, 0) 0px 20px 30px -10px',
    width: '550px',
    [theme.breakpoints.down('xl')]: {
        width: '500px'
    },
    [theme.breakpoints.down('lg')]: {
        width: 'auto'
    },
    [theme.breakpoints.only('lg')]: {
        marginTop:0
    }
}))

const StyledCard = styled(Card)(({ theme }) => ({
    width: '50%',
    [theme.breakpoints.down('lg')]: {
        width: '100%',
        marginBottom:10,
    },
    borderRadius: 10,
}))
const StyledNameBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    width: '40%',
    [theme.breakpoints.down('lg')]:{
    width: '100%'
},
}))

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
    height: '200px',
    [theme.breakpoints.down('xl')]: {
        height: '150px',
    },
    [theme.breakpoints.down('lg')]: {
        height: '180px'
    },
    borderRadius: 10
}))

function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

function ImgMediaCard({ uploadImgHandler, newDp, progress }) {
    return (
        <StyledCard>
            <StyledCardMedia
                component="img"
                alt="Profile pic"
                image={newDp ? newDp : testDp}
            />
            <CardActions sx={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="icon-button-file">
                    <Input
                        inputProps={
                            {
                                accept: ".jpg, .jpeg, .png"
                            }
                        }
                        id="icon-button-file"
                        type="file"
                        sx={{ display: 'none' }}
                        onChange={uploadImgHandler}
                    />
                    <Button
                        variant="outlined"
                        component="span"
                        size="small"
                        sx={{ color: (theme) => theme.palette.mode === 'light' && 'black' }}
                    >
                        Upload Image
                    </Button>
                </label>
                {
                    progress > 1 && <Box sx={{ width: '100%' }}>
                        <LinearProgressWithLabel value={progress} />
                    </Box>
                }
            </CardActions>
        </StyledCard>
    );
}

function Dp() {
    const { currentUser, updateUserName, updateUserDp } = useAuth()
    const [showTextfield, setShowTextfield] = React.useState(false)
    const nameRef = React.useRef()
    const [uploadAlert, setUploadAlert] = React.useState()
    const [dpUrl, setDpUrl] = React.useState(currentUser.photoURL)
    const [progress, setProgress] = React.useState(1)

    React.useEffect(() => {
        if (progress >= 100) {
            setProgress()
        }
    }, [progress])

    const toogleEdit = async () => {
        await setShowTextfield(prev => !prev)
        nameRef.current.focus()
    }

    const saveNameHandler = () => {
        updateUserName(nameRef.current.value).then(() => {
            console.log('updated name successfully')
            setShowTextfield(false)
        }).catch(er => {
            console.log('error updating name')
            console.log(er)
            setShowTextfield(false)
        })
    }

    const imgUploadHandler = (e) => {
        const file = e.target.files[0]
        setUploadAlert()
        setProgress()
        if (parseInt(file.size) > (5 * 1024 * 1024)) {
            setUploadAlert('Upload size limit exceeded!')
            return
        }
        const storageRef = ref(storage, `profilePics/${currentUser.uid}/profile-pic`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed', (snapshot) => {
            const progressData = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(Math.round(progressData))
            console.log('Upload is ' + progressData + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('paused');
                    break;
                case 'running':
                    console.log('uploading');
                    break;
                default:
                    console.log('*************')
            }
        }, err => {
            switch (err.code) {
                case 'storage/unauthorized':
                    setUploadAlert('No permission to access the object')
                    break;
                case 'storage/canceled':
                    setUploadAlert('User canceled the upload')
                    break;
                case 'storage/unknown':
                    setUploadAlert("Unknown error occurred, inspect error.serverResponse")
                    break;
                default:
                    console.log('*************')
            }
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                updateUserDp(downloadURL).then(() => {
                    console.log('uploaded url successfully')
                    setDpUrl(downloadURL)
                }).then(er => {
                    console.log('failed uploading url')
                    console.log(er)
                })
            });
        })
    }


    return (
        <StyledBox>
            {
                uploadAlert &&
                <Alert
                    severity="error"
                    sx={{ justifyContent: 'center', width: '100%' }}
                >
                    {uploadAlert}
                </Alert>
            }
            <ImgMediaCard uploadImgHandler={imgUploadHandler} newDp={dpUrl} progress={progress} />
            <StyledNameBox>
                {
                    showTextfield ?
                        <TextField
                            sx={{
                                marginBottom: '10px'
                            }}
                            required
                            id="name"
                            label="Name"
                            defaultValue={currentUser.displayName}
                            inputRef={nameRef}
                            inputProps={{
                                onBlurCapture: saveNameHandler,
                                onKeyPress: (e) => {
                                    if (e.key === "Enter") {
                                        saveNameHandler()
                                    }
                                }
                            }}
                        /> :
                        <Typography variant='h6' gutterBottom>
                            {currentUser.displayName ? currentUser.displayName : 'N/A'}
                        </Typography>

                }
                {
                    !showTextfield &&
                    <Button
                        size="small"
                        sx={{ color: (theme) => theme.palette.mode === 'light' && 'black' }}
                        variant='outlined'
                        onClick={toogleEdit}
                    >
                        Change name
                    </Button>

                }

            </StyledNameBox>
        </StyledBox>
    )
}

export default Dp;
