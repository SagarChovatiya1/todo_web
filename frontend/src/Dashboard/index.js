import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { borderRadius } from '@mui/system';
import axios from 'axios';
import { toast } from 'react-toastify';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip';
import {useNavigate } from "react-router-dom"

const useStyles = makeStyles({
    container: {
        padding: 16,
    },
    bgList: {
        background: "#ededed",
        marginTop: "10px"

    }
});
const theme = createTheme({
    palette: {
        primary: {
            main: '#556cd6',
        },
    },
});

function Dashboard() {
    const [userData, setUserData] = React.useState({
        title: ''
    })
    const [userDataError, setUserDataError] = React.useState({})
    const [updateId, setUpdateId] = React.useState("")
    const [todoList,setTodoList]=React.useState([])
    const tokens = localStorage.getItem("token")
    const token = JSON.parse(tokens)
    const navigate = useNavigate()
    const handleChange = (e) => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]: value }, setUserDataError(validation(name, value)))
    }

    const validation = (name, value) => {
        switch (name) {
            case 'title':
                if (!value) {
                    return 'enter Title'
                } else {
                    return
                }
            default:
                break;
        }
    }

    const onSubmit = () => {
        let allErrors = {}
        Object.keys(userData).forEach(key => {
            const error = validation(key, userData[key])
            if (error && error.length) {
                allErrors[key] = error
            }
        });
        if (Object.keys(allErrors).length) {
            return setUserDataError(allErrors)
        } else {
            createNotes(userData)
        }
    }
    const createNotes = async (userData) => {

        if (updateId === "") {
            const result = await axios({
                method: 'POST',
                url: 'http://localhost:8080/api/v1/create',
                headers: { "token": `${token}` },
                data: userData
            }).then(result=>{
                if (result?.status) {
                    setUserData({
                        title: ""
                    })
                    toast.success(result?.data?.message)
                    getListCard()
                }
            })
            .catch(err=>{
                toast.error("image too large")
            })
           
        } else {
            const data = await axios({
                method: 'POST',
                url: `http://localhost:8080/api/v1/edit/${updateId}`,
                data: userData
            })
            if (data?.status) {
                setUpdateId('')

                toast(data.data.message)
                setUserData({
                    title: ""
                })
                getListCard()
             
            }
        }

    }
    const onEdit = async (val, id) => {
        setUpdateId(id)
        setUserData({
            title: val?.title
                })

    }

    const deleteNote = async (id) => {
        console.log(id)
        const data = await axios({
            method: 'POST',
            url: `http://localhost:8080/api/v1/delete/${id}`,
        })
        console.log("======",data)
        if (data?.status) {
            toast(data.data.message)
            getListCard()
        }
    }

    const onLogOut=()=>{
        localStorage.removeItem('auth');
        localStorage.removeItem('token');
        toast.success('logout successfully ')
        navigate("/"); 
    }

    const classes = useStyles();

    const getListCard = async () => {
        const data = await axios({
            method: 'GET',
            url: "http://localhost:8080/api/v1/listnotes",
            headers: { "token": `${token}` },
        })
        setTodoList(data?.data?.data)
    }
    React.useEffect(() => {
        getListCard()
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ flexGrow: 1, background: "#096589" }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
                            Todo App
                        </Typography>
                        <Tooltip title="logout" arrow>
                            <div onClick={()=>onLogOut()}>
                        <LogoutIcon/>
                            </div>
                        </Tooltip>
                    </Toolbar>
                </AppBar>
            </Box>

            <div className='main-todo'>
                <Box
                    sx={{
                        width: 600,
                        height: 150,
                        maxWidth: '100%',
                        boxShadow: "3px 3px #d1cfcf, -1em 0 0.4em #d7d7d7",
                        background: "white",
                        border: "0px solid gray",
                        borderRadius: "11px"
                    }}
                >
                    <div className="text-input-todo">
                        <div>
                            <TextField fullWidth
                                id="outlined-basic" label="Enter Title"
                                variant="outlined"
                                name='title'
                                onChange={(e) => handleChange(e)}
                                value={userData?.title}
                                helperText={userDataError?.title?.length > 0 ? userDataError?.title : null}
                                error={userDataError?.title?.length > 0 ? true : false}

                            />
                        </div>

                        <div className='add-btn'>
                            <Button variant="contained" onClick={onSubmit}>{updateId.length>0 ? `Edit`:`Add`}</Button>
                        </div>

                    </div>
                </Box>

            </div>

            <div>
                <Container className={classes.container} maxWidth="md">
                    {!todoList.length
                        ?
                        <Typography variant="h6" color="error" sx={{textAlign:"center"}}>No Data to display</Typography>
                        :
                        (<List >
                            {todoList?.map(item => {
                                return (
                                    <ListItem key={item.id} button className={classes.bgList}>
                                        <ListItemIcon>
                                             <CheckCircleIcon color="primary" /> 
                                        </ListItemIcon>

                                        <ListItemText primary={item.title} />
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" aria-label="edit" onClick={() => onEdit(item,item._id)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton edge="end" aria-label="delete" onClick={() => deleteNote(item._id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )
                            })}
                        </List>)
                    }
                </Container>
            </div>
        </ThemeProvider>
    )
}

export default Dashboard