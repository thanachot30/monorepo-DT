import React, { ReactNode, useState } from 'react';
import {
    Drawer, List, ListItemButton, ListItemText, ListItemIcon, Collapse,
    Toolbar, Divider,
    Box,
    AppBar,
    CssBaseline,
    Typography,
    IconButton,
    Menu,
    MenuItem
} from '@mui/material';
import {
    People, ExpandLess, ExpandMore, Settings, Folder,
    AccountCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

interface Props {
    children: ReactNode;
}

const Sidebar: React.FC<Props> = ({ children }) => {
    const [openPlatform, setOpenPlatform] = useState<boolean>(false);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleClickPlatform = () => {
        setOpenPlatform((prev) => !prev);
    };

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                <ListItemButton onClick={() => navigate('/user')}>
                    <ListItemIcon><People /></ListItemIcon>
                    <ListItemText primary="User" />
                </ListItemButton>

                <ListItemButton onClick={handleClickPlatform}>
                    <ListItemIcon><Settings /></ListItemIcon>
                    <ListItemText primary="Platform" />
                    {openPlatform ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openPlatform} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/okx')}>
                            <ListItemIcon><Folder /></ListItemIcon>
                            <ListItemText primary="OKX" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/platform/sub2')}>
                            <ListItemIcon><Folder /></ListItemIcon>
                            <ListItemText primary="platform2" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/platform/sub3')}>
                            <ListItemIcon><Folder /></ListItemIcon>
                            <ListItemText primary="platform3" />
                        </ListItemButton>
                    </List>
                </Collapse>
            </List>
        </div>
    )

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
            >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" noWrap component="div">
                        DT User Management
                    </Typography>
                    {/* Profile Menu */}
                    <Box>
                        <IconButton
                            size="large"
                            edge="end"
                            color="inherit"
                            onClick={(event) => setAnchorEl(event.currentTarget)}
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            <MenuItem onClick={() => {
                                setAnchorEl(null);
                                navigate('/settings');
                            }}>Settings</MenuItem>
                            <MenuItem onClick={() => {
                                setAnchorEl(null);
                                // add your logout logic here
                                console.log('Logging out...');
                            }}>Logout</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                {drawer}
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    p: 3,
                    width: `calc(100% - ${drawerWidth}px)`
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default Sidebar;
