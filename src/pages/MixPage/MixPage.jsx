import React, { useState, useEffect } from 'react';
import { Flex } from '@rebass/grid';
import { NavLink, useParams } from 'react-router-dom';
import { Card, Mix, LoadingSpinner } from '../../components';
import nts from '../../utils/nts';

const MixPage = () => {
  const { artist, episode } = useParams();
  const [loading, setLoading] = useState(true);
  const [mix, setMix] = useState(null);

  useEffect(() => {
    nts(artist, episode).then(result => {
      setMix(result);
      setLoading(false);
    });
  }, [artist, episode]);

  return (
    <Card>
      {loading ? (
        <Flex justifyContent="center">
          <LoadingSpinner size="32px" />
        </Flex>
      ) : (
        <Mix mix={mix} />
      )}
      <NavLink to="/">Back</NavLink>
    </Card>
  );
};

export default MixPage;
