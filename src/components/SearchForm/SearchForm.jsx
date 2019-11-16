import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import fetchAndParseMix from '../../utils/nts';
import { H2, Input, Button, SearchIcon, Form } from './SearchForm.styles';
import { Card } from '../common.styles';

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
      <H2>PASTE NTS URL</H2>
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
