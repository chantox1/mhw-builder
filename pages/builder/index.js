import * as React from 'react';
import Container from '@mui/material/Container';
import { Box, Card, CardActionArea, CardMedia } from '@mui/material';
import Image from 'next/image';

export default function Builder() {
    return (
            <Container maxWidth="sm" sx={{height: "80vh"}}>
                <Box sx={{display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-around"}}>
                    <Card>
                        <CardActionArea href="/builder/IB/en">
                            <CardMedia sx={{objectFit: "contain"}}
                                component="img"
                                image="/logo/icebornelogo.png"
                            />
                        </CardActionArea>
                    </Card>
                    <Card>
                        <CardActionArea href="/builder/ICE">
                            <CardMedia sx={{objectFit: "contain"}}
                                component="img"
                                image="/logo/icelogo.png"
                            />
                        </CardActionArea>
                    </Card>
                </Box>
            </Container>
    );
}