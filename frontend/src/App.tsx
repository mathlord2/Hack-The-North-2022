import { ChakraProvider, DarkMode } from "@chakra-ui/react";
import styled from "@emotion/styled";
import Pictures from "./pictures/Pictures";

function App() {
  return (
    <ChakraProvider>
      <DarkMode>
        <Container>
          <Title>InstaCap</Title>
          <PicturesContainer>
            <Pictures />
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
