import styled from "@emotion/styled";
import { ReactElement } from "react";
import { mockPicturesData } from "../mock/pictures";
import Picture from "./Picture";

interface PicturesProps {}

function Pictures({}: PicturesProps): ReactElement {
  return (
    <Container>
      {mockPicturesData.map((picture) => (
        <Picture {...picture} />
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
