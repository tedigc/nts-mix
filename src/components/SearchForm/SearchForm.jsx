import React, { useState } from 'react';
import fetchAndParseMix from '../../utils/nts';
import { H2, Input, Button, SearchIcon, Form } from './SearchForm.styles';
import { Card } from '../common.styles';

const SearchForm = ({ onSubmit, resetMix }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [value, setValue] = useState(
    'https://www.nts.live/shows/we-are/episodes/suncut-x-we-are-3rd-october-2016'
  );

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSearching(true);
    resetMix();
    const mix = await fetchAndParseMix(value);
    onSubmit(mix);
    setIsSearching(false);
  };

  return (
    <Card>
      <H2>SEARCH</H2>
      <Form onSubmit={handleSubmit}>
        <Button type="submit" disabled={isSearching}>
          <SearchIcon />
        </Button>
        <Input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="NTS url here"
          disabled={isSearching}
        />
      </Form>
    </Card>
  );
};

export default SearchForm;
