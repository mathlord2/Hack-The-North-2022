import { CalendarIcon, DeleteIcon, LinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  HStack,
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
import { child, get, ref, remove } from "firebase/database";
import { ReactElement } from "react";
import { Photo } from "../App";
import { db } from "../utils/firebase";

function Picture({
  id,
  name,
  created,
  transcript,
  imageUrl,
  onDelete,
}: Photo & { onDelete: () => any }): ReactElement {
  const {
    isOpen: transcriptIsOpen,
    onOpen: transcriptOnOpen,
    onClose: transcriptOnClose,
  } = useDisclosure();
  const {
    isOpen: imageIsOpen,
    onOpen: imageOnOpen,
    onClose: imageOnClose,
  } = useDisclosure();

  return (
    <Container textAlign="center">
      <Box position="relative">
        <Image src={imageUrl} />
        <Overlay>
          <Center h="100%">
            <VStack>
              <Button leftIcon={<CalendarIcon />} onClick={transcriptOnOpen}>
                View Transcript
              </Button>
              <Button leftIcon={<LinkIcon />} onClick={imageOnOpen}>
                View Image
              </Button>
              <Button
                leftIcon={<DeleteIcon />}
                onClick={async () => {
                  const data = (await get(ref(db, "images"))).val();
                  const thisKey = Object.entries(data).find(
                    ([k, d]) => (d as any).id === id
                  )?.[0];
                  await remove(child(ref(db, "images"), thisKey!));
                  onDelete();
                }}
              >
                Delete
              </Button>
            </VStack>
            <Modal
              isOpen={imageIsOpen}
              onClose={imageOnClose}
              isCentered
              size="4xl"
            >
              <ModalOverlay />
              <ModalContent h="90vh">
                <ModalBody>
                  <Img
                    src={imageUrl}
                    borderRadius="5"
                    h="100%"
                    mx="auto"
                    objectFit="contain"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={imageOnClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <Modal
              isOpen={transcriptIsOpen}
              onClose={transcriptOnClose}
              isCentered
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Transcript</ModalHeader>
                <ModalCloseButton />
                <ModalBody>{transcript}</ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={transcriptOnClose}>
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
        {/* <IconButton aria-label="" icon={<EditIcon />} />
         <Menu>
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
