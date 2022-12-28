import * as React from 'react';
import Container from '@mui/material/Container';
import NavBar from '../../../components/navbar';
import Builder from '../../../components/mhw';

import armor from '../../../data/IB/jp/Armor.json';
import decoData from '../../../data/IB/jp/decoData.json';

export default function IB() {
    const data = {
        armor: armor,
        decoData: decoData,
    }

    React.useEffect(() => {
        document.title = "アイスボーン・ビルダー"
     }, []);

    return (
        <div>
            <title>アイスボーン・ビルダー</title>
            <NavBar IB msg="アイスボーン・ビルダー"/>
            <Container maxWidth="xl">
                { Builder(data) }
            </Container>
        </div>
    );
}