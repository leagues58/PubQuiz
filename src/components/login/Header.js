import React from 'react';
import {Typography} from '@material-ui/core';


const Header = () => {
  return (
    <div style={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
      <img src={'/logo.png'} alt="Logo" style={{width:'30vw', marginBottom:'5vh'}} />
      <Typography variant="h4">Stillwater Pub Quiz (now Virtual)!</Typography>
    </div>
  );
};

export default Header;