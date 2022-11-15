import React, {
  Dispatch, SetStateAction, useEffect, useState,
} from 'react';
import './App.css';

async function getArtwork(id: number) {
  return fetch(`https://api.artic.edu/api/v1/artworks/${id}`);
}

function getImageUrl(id: string) {
  return `https://www.artic.edu/iiif/2/${id}/full/843,/0/default.jpg`;
}
// TODO: Review if this type is needed
export interface ArtItemInterface {
  id: number,
  disabled: boolean,
}

export interface ArtItemComponent extends ArtItemInterface {
  setArtItems: Dispatch<SetStateAction<ArtItemInterface[]>>
}

function ArtItem(props: ArtItemComponent): JSX.Element {
  const { id, disabled, setArtItems } = props;
  const [voted, setVoted] = useState<boolean>(false);
  const [rating, setRating] = useState<number>();
  const [artwork, setArtwork] = useState<any>(null);

  const submit = () => {
    console.log('Submitting!');
    /*
    Please have the submit button POST to https://20e2q.mocklab.io/rating with the following payload:

      {
        "id": {#id},
        "rating": {#rating}
      }

    Where id is the artwork's id, and rating is the selected rating.

    The endpoint should return the following:

    {
      "message": "Success"
    }
  */
    return () => {};
  };

  if (disabled) {
    return <>DISABLED</>;
  }

  // TODO: Update with React Query
  useEffect(() => {
    getArtwork(id)
      .then((r) => r.json())
      .then((json) => setArtwork(json));
  }, []);

  return (
    <div className="item">
      <h2>{artwork && artwork.data.title}</h2>
      <h3>{artwork && artwork.data.artist_title}</h3>
      <img
        style={{ width: 100 }}
        alt=""
        src={artwork != null ? getImageUrl(artwork.data.image_id) : ''}
      />
      <p>
        Rating:
        {' '}
        {rating ?? ''}
      </p>
      <button
        onClick={() => {
          setRating(1);
          setVoted(true);
        }}
        type="button"
      >
        1
      </button>
      <button
        onClick={() => {
          setRating(2);
          setVoted(true);
        }}
        type="button"
      >
        2
      </button>
      <button
        onClick={() => {
          setRating(3);
          setVoted(true);
        }}
        type="button"
      >
        3
      </button>
      <button
        onClick={() => {
          setRating(4);
          setVoted(true);
        }}
        type="button"
      >
        4
      </button>
      <button
        onClick={() => {
          setRating(5);
          setVoted(true);
        }}
        type="button"
      >
        5
      </button>
      <button disabled={!voted} onClick={submit()} type="submit">
        Submit
      </button>
      <button
        type="button"
        onClick={() => setArtItems(
          (artItems: ArtItemInterface[]) => artItems.filter(
            (art: ArtItemInterface) => art.id !== id,
          ),
        )}
      >
        Remove Art

      </button>
    </div>
  );
}

function App() {
  const artItemList: ArtItemInterface[] = [
    { id: 27992, disabled: false },
    { id: 27998, disabled: false },
    { id: 27999, disabled: false },
    { id: 27997, disabled: true },
    { id: 27993, disabled: false },
  ];

  const [artItems, setArtItems] = useState<ArtItemInterface[]>(artItemList);

  return (
    <div className="App">
      <h1>Art Rater</h1>
      {artItems.map(
        (artItem) => (
          <ArtItem
            key={artItem.id}
            id={artItem.id}
            disabled={artItem.disabled}
            setArtItems={setArtItems}
          />
        ),
      )}
    </div>
  );
}

export { App, ArtItem };
