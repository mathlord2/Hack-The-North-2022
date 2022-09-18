import { useState, useEffect } from 'react';
import { ChakraProvider, DarkMode, useColorMode } from "@chakra-ui/react";
import styled from "@emotion/styled";
import Pictures from "./pictures/Pictures";
import { db, storage } from "./utils/firebase";
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import { ref as dbRef, onValue } from "firebase/database";

export interface Photo {
  id: string;
  name: string;
  created: string;
  transcript: string;
  imageUrl: string;
}

function App() {
  const [pictures, setPictures] = useState<Photo[]>([]);
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (colorMode === "light") {
      toggleColorMode();
    }
  }, [colorMode, toggleColorMode]);

  useEffect(() => {
    const dataRef = dbRef(db, "images");
    onValue(dataRef, (snapshot: any) => {
      const data = snapshot.val();

      for (let d in data) {
        let photo = data[d];

        const sRef = storageRef(storage, "/" + data[d].id + ".png");
        getDownloadURL(sRef).then((url: string) => {
          photo.imageUrl = url;
          setPictures((prevPictures: Photo[]) => [...prevPictures, photo]);
        });
      }
    });
  }, []);

  return (
    <ChakraProvider>
      <DarkMode>
        <Container>
          <Title>InstaCap</Title>
          <PicturesContainer>
            <Pictures pictures={pictures}/>
          </PicturesContainer>
        </Container>
      </DarkMode>
    </ChakraProvider>
  );
}

const Container = styled.div``;

const Title = styled.div`
  font-size: 5rem;
  text-align: center;
  font-weight: 800;
  margin: 1rem 0;
`;

const PicturesContainer = styled.div`
  width: 90%;
  margin: 0 auto;
`;

export default App;
