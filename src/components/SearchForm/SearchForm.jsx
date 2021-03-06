import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box } from '@rebass/grid';
import fetchAndParseMix from '../../utils/nts';
import { Input, Button, SearchIcon, Form } from './SearchForm.styles';
import { H1, Card } from '../common.styles';

const pattern = /https:\/\/www.nts.live\/shows\/([a-z-]+)\/episodes\/([a-z0-9-]+)$/;

const SearchForm = ({ onSubmit, resetMix }) => {
  const [isSearching, setIsSearching] = useState(false);
  const history = useHistory();
  const [value, setValue] = useState(
    'https://www.nts.live/shows/we-are/episodes/suncut-x-we-are-3rd-october-2016'
  );

  const handleSubmit = async e => {
    e.preventDefault();

    const isValidUrl = pattern.test(value);
    if (isValidUrl) {
      const [_, artist, episode] = Array.from(...value.matchAll(pattern));
      history.push(`/${artist}/${episode}`);
    }

    // setIsSearching(true);

    // const mix = await fetchAndParseMix(value);
    // resetMix();
    // onSubmit(mix);
    // setIsSearching(false);
  };

  return (
    <Card>
      <Box ml="3.8rem">
        <H1>PASTE NTS URL</H1>
      </Box>
      <Form onSubmit={handleSubmit}>
        <Button type="submit" disabled={isSearching}>
          <SearchIcon />
        </Button>
        <Input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="https://www.nts.live/shows/ ... /episodes/ ..."
          disabled={isSearching}
        />
      </Form>
    </Card>
  );
};

export default SearchForm;
