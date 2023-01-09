import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import * as React from 'react';
import DrawerSeller from './Dashboard/DrawerSeller';
import SellerShoppingPostsCharts from './SellerShoppingPostCharts';

export default function ViewChartsSeller() {
    const [value, setValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <>
            <DrawerSeller />
            <div className='ml-64 mr-5'>
                <Box sx={{ width: 'auto%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Estadisticas publicaciones" value="1" />
                                <Tab label="Ventas realizadas" value="2" />
                                <Tab label="Three" value="3" />
                            </TabList>
                        </Box>
                        <TabPanel value="1"> <SellerShoppingPostsCharts /></TabPanel>
                        <TabPanel value="2"> Balancete de ventas</TabPanel>
                    </TabContext>
                </Box>
            </div>
        </>
    );
}