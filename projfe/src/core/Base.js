import { Box, Container } from '@material-ui/core';
import React from 'react'
import StickyFooter from './footer';
import AppMenu from './Menu';


const Base = ({
    
    children,
    filterSearch
},props) => (
    <Box >
        <AppMenu handleSearch={(search)=>filterSearch(search)} />
        <Box maxWidth="lg" mt={1} mr={2} ml={2} mb={12}>
            <Container maxWidth="xl" text="secondary">
                    {children}
            </Container>
        </Box>
        <StickyFooter />
    </Box>
);

export default Base;