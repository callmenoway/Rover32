'use client';

import Image from 'next/image';
import { Container, Typography, Box, Paper } from '@mui/material';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/src/components/ui/breadcrumb";

const SchematicPage = () => {
    // You can replace this with your actual circuit diagram PNG
    const circuitDiagramPath = '/schema.png';

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/docs">Documentation</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/docs/schematic">Schematic</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Circuit Schematic
                </Typography>
                <Typography variant="body1" component="p" sx={{ mb: 2 }}>
                    Below is the circuit diagram for the Rover32 project. This schematic shows the electronic connections and components used in the system.
                </Typography>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
                <Box sx={{ position: 'relative', width: '100%', height: 'auto', minHeight: '500px' }}>
                    <Image
                        src={circuitDiagramPath}
                        alt="Rover32 Circuit Diagram"
                        layout="fill"
                        objectFit="contain"
                        priority
                    />
                </Box>
            </Paper>
        </Container>
    );
};

export default SchematicPage;