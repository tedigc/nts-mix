import React, { Component } from 'react';
import CopyButton from './CopyButton';

const examples = [
  { mix: 'DJ Koze & Róisín Murphy - London, 04.05.18', url: 'https://www.nts.live/shows/guests/episodes/dj-koze-roisin-murphy-4th-may-2018' },
  { mix: 'Floating Points & Four Tet - Tisno, 06.08.18', url: 'https://www.nts.live/shows/love-international-2018/episodes/floating-points-four-tet-live-from-love-international-2nd-july-2018' },
  { mix: 'Bonobo - Los Angeles, 24.06.15', url: 'https://www.nts.live/shows/bonobo/episodes/bonobo-24thjune-2015' },
];

class Info extends Component {
  state = { justCopied: Array(examples.length).fill(false) }

  notifyCopy = async (id) => {
    const justCopied = await this.state.justCopied.map((item, i) => (i === id));
    this.setState({ justCopied });
  }

  render() {
    const { justCopied } = this.state;
    return (
      <div className="info">
        <h1>ABOUT</h1>
        <p>
          <a href="https://www.nts.live/" target="_blank">NTS Radio</a> is an online radio station based in London with studios in Los Angeles, Shanghai and Manchester.
          Broadcasting underground music live, 24/7.
        </p>
        <p>
          NTS mix offers a way of turning your favourite mixes into YouTube playlists.
          Simply copy and paste the URL of a mix found on <a href="https://www.nts.live/" target="_blank">nts.live</a>, search, and click "CREATE PLAYLIST".
        </p>

        <p>
          To get started, try some of the mixes below. Simply click the mix title to copy it to your clipboard, and past it into the search bar on the left.
        </p>

        {examples.map((example, i) => <CopyButton key={i} id={i} notifyCopy={this.notifyCopy} mix={example.mix} url={example.url} justCopied={justCopied[i]} />)}

        <p>
          DISCLAIMER: NTS Radio is an underground radio station, meaning that certain uncommon or unreleased tracks will not be found, and close matches may be used instead, when creating playlists.
        </p>
      </div>
    );
  }
}

export default Info;
