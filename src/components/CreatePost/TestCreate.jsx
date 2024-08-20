import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
  } from '@chakra-ui/react'
import React from 'react'

export default function ({ modalTitle, modalBody, primaryActionText, secondaryActionText }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
        <Button onClick={onOpen}>Open Modal</Button>

        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            Hello
            </ModalBody>

            <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
        </>
    )
  
}
