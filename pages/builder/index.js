import * as React from 'react';
import Container from '@mui/material/Container';
import { Card, CardActionArea, CardMedia } from '@mui/material';
import Image from 'next/image';

import IBLogo from '../../assets/logo_iceborne_l.png'
import ICELogo from '../../public/IceLogo.fw.png'

export default function Builder() {
    return (
        <Container maxWidth="xl">
            <Container maxWidth="sm">
                <CardActionArea href="/builder/IB/en" style={{marginBottom: 20, marginTop: 20}}>
                    <Card>
                        <CardMedia style={{height: "35vh", position: "relative"}}>
                            <Image src={IBLogo} fill style={{objectFit: "cover"}}/>
                        </CardMedia>
                    </Card>
                </CardActionArea>
                <CardActionArea href="/builder/ICE">
                    <Card>
                        <CardMedia style={{height: "35vh", position: "relative"}}>
                            <Image src={ICELogo} fill style={{objectFit: "cover"}}/>
                        </CardMedia>
                    </Card>
                </CardActionArea>
            </Container>
        </Container>
    );
}