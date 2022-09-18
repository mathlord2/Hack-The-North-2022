import {
  CalendarIcon,
  DeleteIcon,
  DownloadIcon,
  EditIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  HStack,
  IconButton,
  Img,
  MenuButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { ReactElement } from "react";
import { Photo } from "../App";

function Picture({
  id,
  name,
  created,
  transcript,
  imageUrl,
}: Photo): ReactElement {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Container textAlign="center">
      <Box position="relative">
        <Image src={imageUrl}></Image>
        <Overlay>
          <Center h="100%">
            <VStack>
              <Button leftIcon={<CalendarIcon />} onClick={onOpen}>
                View Transcript
              </Button>
              <Button leftIcon={<DownloadIcon />}>Download</Button>
              <Button leftIcon={<DeleteIcon />}>Delete</Button>
            </VStack>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Transcript</ModalHeader>
                <ModalCloseButton />
                <ModalBody>{transcript}</ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onClose}>
                    Close
                  </Button>
                  {/* <Button variant="ghost">Copy</Button> */}
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Center>
        </Overlay>
      </Box>
      <HStack mx="auto" w="max-content" mt="5">
        <Title>{name}</Title>
        <IconButton aria-label="" icon={<EditIcon />} />
        {/* <Menu>
          <Options
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="outline"
          />
          <MenuList>
            <MenuItem icon={<EditIcon />}>Rename</MenuItem>
            <MenuItem icon={<DeleteIcon />}>Delete</MenuItem>
          </MenuList>
        </Menu> */}
      </HStack>
      <Created>{created}</Created>
    </Container>
  );
}

const Container = styled(Box)`
  margin: 1rem;
`;

const Overlay = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  opacity: 0;
  border-radius: 1rem;

  &:hover {
    opacity: 1;
    /* cursor: pointer; */
  }

  transition: all 0.2s ease-in-out;
`;

const Image = styled(Img)`
  height: 15rem;
  margin: 0 auto;
  border-radius: 1rem;
`;

const Title = styled.div`
  font-size: 1.5rem;
`;

const Created = styled.div`
  font-size: 1rem;
`;

const Options = styled(MenuButton)``;

export default Picture;
