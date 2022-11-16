import React, {
  Dispatch, SetStateAction, useState,
} from 'react';
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import './App.css';

const queryClient = new QueryClient();

const getArtwork = async (id: number) => {
  const response = await fetch(`https://api.artic.edu/api/v1/artworks/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

function getImageUrl(id: string) {
  return `https://www.artic.edu/iiif/2/${id}/full/843,/0/default.jpg`;
}

function postArtworkRating(ratedArtItem: RatedArtItemInterface) {
  fetch('https://20e2q.mocklab.io/rating', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ratedArtItem),
  }).then((response) => response.json())
    .then((data) => console.log('SUCCESS:', data))
    .catch(console.error);
}
export interface ArtItemInterface {
  id: number,
}
export interface RatedArtItemInterface extends ArtItemInterface {
  id: number,
  rating: number;
}

export interface ArtItemComponent extends ArtItemInterface {
  setArtItems: Dispatch<SetStateAction<ArtItemInterface[]>>
}

function ArtItem({ id, setArtItems }: ArtItemComponent): JSX.Element {
  const [voted, setVoted] = useState<boolean>(false);
  const [rating, setRating] = useState<number>();
  const { data } = useQuery(['art', id], () => getArtwork(id));
  const artWorkData = data?.data;

  const submit = (submittedRating: number) => {
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
    postArtworkRating({ id, rating: submittedRating });
  };

  return (
    <div className="item">
      <h2>{artWorkData?.title}</h2>
      <h3>{artWorkData?.artist_title}</h3>
      <img
        style={{ width: 100 }}
        alt=""
        src={getImageUrl(artWorkData?.image_id) ?? ''}
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
      <button disabled={!voted} onClick={() => submit(rating as number)} type="submit">
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

// Complete List:
// https://raw.githubusercontent.com/art-institute-of-chicago/api-data/master/getting-started/allArtworks.jsonl
function AddArtItem({ setArtItems }: {
  setArtItems : Dispatch<SetStateAction<ArtItemInterface[]>>
}): JSX.Element {
  const [id, setId] = useState('');
  const newArtItem: ArtItemInterface = { id: Number(id) };

  // TODO: Error States - number input, id exists, timeout
  return (
    <div>
      <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
      <button type="button" onClick={() => setArtItems((artItems: ArtItemInterface[]) => [...artItems, newArtItem])}>
        Add Art
      </button>
    </div>
  );
}

function App(): JSX.Element {
  const artItemList: ArtItemInterface[] = [
    { id: 27992 },
    { id: 27998 },
    { id: 27999 },
    { id: 27997 },
    { id: 27993 },
  ];

  const [artItems, setArtItems] = useState<ArtItemInterface[]>(artItemList);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <h1>Art Rater</h1>
        {artItems.map(
          (artItem) => (
            <ArtItem
              key={artItem.id}
              id={artItem.id}
              setArtItems={setArtItems}
            />
          ),
        )}
        <AddArtItem setArtItems={setArtItems} />
      </div>
    </QueryClientProvider>
  );
}

export { App, ArtItem };
