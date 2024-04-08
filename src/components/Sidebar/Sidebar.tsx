import React, { useState } from 'react';
import { Box, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, Button } from '@chakra-ui/react';
import CreatePost from '../CreatePost/CreatePost';

export default function Sidebar() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const handleCreate = () => {
    setIsCreatePostOpen(true);
  };

  return (
    <>
    {!isOpen?(<Button onClick={onOpen}>
        Open Sidebar
      </Button>):('')}
      <Drawer placement={'left'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            {/* Your sidebar content here */}
            <Box p="4">
            <Button colorScheme="whiteAlpha" variant="outline" mr="4">
                Home
            </Button>
            <Button colorScheme="whiteAlpha" variant="outline" mr="4" onClick={handleCreate}>
                Create
            </Button>
            {isCreatePostOpen && <CreatePost/>}
            <Button colorScheme="whiteAlpha" variant="outline" mr="4">
                Search
            </Button>
            <Button colorScheme="whiteAlpha" variant="outline">
                Profile
            </Button>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      </>
  )
}
