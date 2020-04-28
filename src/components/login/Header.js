import React from 'react';
import {Typography, Paper} from '@material-ui/core';



const Header = () => {
  return (
    <div style={{display: 'flex', flexDirection:'column', alignItems:'center', marginTop:'5%'}}>
      <Paper elevation={3} style={{padding:'20px'}}><Typography variant="h3" style={{color:'black', fontWeight:'bold'}}>Stillwater Pub Quiz</Typography></Paper>
    </div>
  );
};

export default Header;