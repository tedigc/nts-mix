import React, { useState } from 'react';
import classNames from 'classnames';
import youtube from '../../utils/youtube';
import { Card } from '../common.styles';
import {
  Description,
  BioWrapper,
  Location,
  Artist,
  Button,
  Track,
  Title,
  Link,
  DJ,
  Hr
} from './Mix.styles';

const Mix = ({ mix }) => {
  const [playlistUrl, setPlaylistUrl] = useState('temp');
  const [buttonText, setButtonText] = useState('CREATE PLAYLIST');
  const [isCreating, setIsCreating] = useState(false);
  const [isComplete, setIsComplete] = useState(true);
  const [trackIdx, setTrackIdx] = useState(-1);

  const handleClickCreate = async () => {
    setIsCreating(true);
    setButtonText('IN PROGRESS');

    // Create new playlist
    const title = `${mix.name} | ${mix.date}`;
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

    // Enable the 'Go to playlist' link
    const urlPrefix = 'https://www.youtube.com/playlist?list=';
    const playlistUrl = `${urlPrefix}${playlistId}`;
    setPlaylistUrl(playlistUrl);
    setButtonText('COMPLETE');
    setIsComplete(true);
    setTrackIdx(mix.tracklist.length + 1);
  };

  return (
    <Card>
      <BioWrapper>
        <section id="bio">
          <DJ>{mix.name}</DJ>
          <Location>{mix.locationDate}</Location>
        </section>
        <Button disabled={isCreating} onClick={handleClickCreate}>
          {buttonText}
        </Button>
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
        {isComplete && playlistUrl && (
          <Link href={playlistUrl} target="_blank">
            GO TO PLAYLIST
          </Link>
        )}
      </section>
    </Card>
  );
};

export default Mix;
