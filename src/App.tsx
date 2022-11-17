/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  Dispatch, SetStateAction, useState,
} from 'react';
import Carousel from 'react-material-ui-carousel';
import { v4 as uuid } from 'uuid';
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import './App.css';
import { Button, TextField } from '@mui/material';

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
    .then((data) => {
      console.log('SUCCESS:', data);
      alert('Sucess');
    })
    .catch(console.error);
}

export function useGetArtWork(id: number) {
  return useQuery(['art', id], () => getArtwork(id));
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
  const [submitted, setSubmitted] = useState<boolean>(false);
  const { data } = useGetArtWork(id);
  const artWorkData = data?.data;
  const ratings = [1, 2, 3, 4, 5];

  /*
  clicking submit POSTs update, displays a toast success message, hides buttons
  Please have the submit button POST to https://20e2q.mocklab.io/rating with the following payload:
  The endpoint should return the following:
  {
    "message": "Success"
  }
*/
  const submit = (submittedRating: number) => {
    postArtworkRating({ id, rating: submittedRating });
  };

  return (
    <div className="item">
      <h2>{artWorkData?.title}</h2>
      <h3>{artWorkData?.artist_title}</h3>
      <img
        style={{ width: 550, height: 550, objectFit: 'contain' }}
        alt=""
        src={artWorkData?.image_id && getImageUrl(artWorkData?.image_id)}
      />
      <p>
        {rating ? `Rating: ${rating}` : ''}
      </p>
      {ratings.map((r) => (
        <Button
          key={uuid()}
          variant="outlined"
          onClick={() => {
            setRating(r);
            setVoted(true);
          }}
        >
          {r}
        </Button>
      ))}
      {!submitted && (
      <Button
        variant="contained"
        color="success"
        disabled={!voted}
        onClick={() => {
          setSubmitted(true);
          submit(rating as number);
        }}
      >
        Submit
      </Button>
      )}
      <Button
        variant="contained"
        color="error"
        onClick={() => setArtItems(
          (artItems: ArtItemInterface[]) => artItems.filter(
            (art: ArtItemInterface) => art.id !== id,
          ),
        )}
      >
        Remove Art
      </Button>
    </div>
  );
}

// Complete List:
// https://raw.githubusercontent.com/art-institute-of-chicago/api-data/master/getting-started/allArtworks.jsonl
function AddArtItem({ setArtItems }: {
  setArtItems : Dispatch<SetStateAction<ArtItemInterface[]>>
}): JSX.Element {
  const [newId, setNewId] = useState('');
  const [isError, setIsError] = useState(false);

  function addArtItem(id: number) {
    getArtwork(id).then(
      (artItem) => {
        setIsError(false);
        setArtItems((artItems) => [...artItems, { id: artItem.data.id }]);
      },
    ).catch((e) => setIsError(true));
  }

  return (
    <div className="add-art-container">
      {(isError || Number.isInteger(newId)) && <div className="add-art-input">Invalid Id</div>}
      <TextField
        id="outlined-basic"
        label="Enter Id"
        variant="outlined"
        value={newId}
        onChange={(e) => setNewId(e.target.value)}
        className={isError ? 'add-art-input' : ''}
      />
      <Button
        variant="contained"
        onClick={() => {
          addArtItem(Number(newId));
          if (!isError) { setNewId(''); }
        }}
      >
        Add Art
      </Button>
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
        <Carousel autoPlay={false} height={800}>
          {artItems.map(
            (artItem) => (
              <ArtItem
                key={uuid()}
                id={artItem.id}
                setArtItems={setArtItems}
              />
            ),
          )}
        </Carousel>
        <AddArtItem setArtItems={setArtItems} />
      </div>
    </QueryClientProvider>
  );
}

export { App, ArtItem };
