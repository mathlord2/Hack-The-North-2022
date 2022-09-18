import styled from "@emotion/styled";
import { Photo } from "../App";
import Picture from "./Picture";

interface PicturesProps {
  pictures: Photo[];
  onDelete: (id: string) => any;
}

const Pictures = ({ pictures, onDelete }: PicturesProps) => {
  return (
    <Container>
      {pictures.map((picture) => (
        <Picture
          {...picture}
          key={picture.id}
          onDelete={() => onDelete(picture.id)}
        />
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

export default Pictures;
