import styled from "@emotion/styled";
import { ReactElement } from "react";
import { mockPicturesData } from "../mock/pictures";
import Picture from "./Picture";
import { Photo } from "../App";

interface PicturesProps {
  pictures: Photo[];
}

const Pictures = (props: PicturesProps) => {
  return (
    <Container>
      {props.pictures.map((picture) => (
        <Picture {...picture} key={picture.id}/>
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

export default Pictures;
