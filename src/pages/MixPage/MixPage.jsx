import React from 'react';
import { NavLink } from 'react-router-dom';
import { Card } from '../../components';

const MixPage = () => {
  return (
    <Card>
      <h1>Mix page</h1>
      <NavLink to="/">Back</NavLink>
    </Card>
  );
};

export default MixPage;
