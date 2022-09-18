import { ChakraProvider, DarkMode, useColorMode } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { onValue, ref as dbRef, remove } from "firebase/database";
import { getDownloadURL, ref as storageRef, deleteObject } from "firebase/storage";
import { useEffect, useState } from "react";
import Pictures from "./pictures/Pictures";
import { db, storage } from "./utils/firebase";

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
      let newPhotos: Photo[] = [];
      let count = Object.keys(data).length;
      
      for (let d in data) {
        let photo = data[d];
        const sRef = storageRef(storage, "/" + data[d].id + ".png");
        
        getDownloadURL(sRef).then((url: string) => {
          photo.imageUrl = url;
          newPhotos.push(photo);
          count--;

          if (count === 0) {
            setPictures(newPhotos);
          }
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
            <Pictures
              pictures={pictures}
              onDelete={(id) => {
                setPictures(pictures.filter((p) => p.id !== id));
                
                // Delete from Realtime DB
                const dataRef = dbRef(db, "images");
                onValue(dataRef, (snapshot: any) => {
                  const data = snapshot.val();

                  for (let d in data) {
                    if (data[d].id === id) {
                      remove(dbRef(db, "images/" + d));
                    }
                  }
                });

                // Delete from Storage
                const sRef = storageRef(storage, "/" + id + ".png");
                deleteObject(sRef);
              }}
            />
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
