import React, { useState } from 'react';
import classNames from 'classnames';
import youtube from '../../utils/youtube';
import { Card } from '../common.styles';
import {
  Track,
  Artist,
  Title,
  DJ,
  Description,
  Location,
  Hr,
  BioWrapper,
  CreatePlaylistButton
} from './Mix.styles';

const Mix = ({ mix }) => {
  const [buttonText, setButtonText] = useState('CREATE PLAYLIST');
  const [isCreating, setIsCreating] = useState(false);
  const [trackIdx, setTrackIdx] = useState(-1);

  const handleClickCreate = async () => {
    setIsCreating(true);
    setButtonText('IN PROGRESS');

    // Create new playlist
    const title = `${mix.name} | ${mix.locationDate}`;
    const newPlaylist = await youtube.createPlaylist(title, mix.description);
    const playlistId = newPlaylist.id;

    // Populate playlist with first result from a youtube search
    for await (const [idx, track] of mix.tracklist.entries()) {
      setTrackIdx(idx);
      const trackname = `${track.title} ${track.artist}`;
      const searched = await youtube.searchForVideo(trackname);
      if (searched.items && searched.items.length > 0) {
        const videoId = searched.items[0].id.videoId;
        await youtube.addVideoToPlaylist(playlistId, videoId);
      }
    }

    setTrackIdx(mix.tracklist.length + 1);
    setButtonText('COMPLETE');
  };

  return (
    <Card>
      <BioWrapper>
        <section id="bio">
          <DJ>{mix.name}</DJ>
          <Location>{mix.locationDate}</Location>
        </section>
        <CreatePlaylistButton disabled={isCreating} onClick={handleClickCreate}>
          {buttonText}
        </CreatePlaylistButton>
      </BioWrapper>
      <Hr />
      <Description>{mix.description}</Description>
      <section id="mix">
        {mix.tracklist.map((track, idx) => {
          const active = trackIdx === idx;
          const complete = idx < trackIdx;
          const className = classNames({ active, complete });
          return (
            <Track key={idx} className={className}>
              <Artist>{track.artist}</Artist>
              <Title>{track.title}</Title>
            </Track>
          );
        })}
      </section>
    </Card>
  );
};

export default Mix;
