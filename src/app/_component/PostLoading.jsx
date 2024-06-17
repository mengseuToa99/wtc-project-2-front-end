import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function Variants() {
  return (
    <div>
      <Stack spacing={1} width={826}>
      {/* For variant="text", adjust the height via font-size */}
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
      <Skeleton variant="circular" width={45} height={45} />
      <Skeleton variant="rectangular" width={826} height={20} />
      <Skeleton variant="rectangular" width={826} height={20} />
      <Skeleton variant="rectangular" width={826} height={20} />
      <Skeleton variant="rectangular" width={826} height={20} />
      <Skeleton variant="rectangular" width={826} height={20} />
      <Skeleton variant="rectangular" width={826} height={200} />
      
    </Stack>

    <Stack spacing={1} width={826}>
      {/* For variant="text", adjust the height via font-size */}
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
      <Skeleton variant="circular" width={45} height={45} />
      <Skeleton variant="rectangular" width={826} height={20} />
      <Skeleton variant="rectangular" width={826} height={20} />
      <Skeleton variant="rectangular" width={826} height={20} />
      <Skeleton variant="rectangular" width={826} height={20} />
      <Skeleton variant="rectangular" width={826} height={20} />
      <Skeleton variant="rectangular" width={826} height={200} />
      
    </Stack>



    </div>
    

    
  );
}
