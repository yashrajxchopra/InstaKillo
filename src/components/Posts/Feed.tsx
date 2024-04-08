import React, { useState, useEffect, CSSProperties } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import {  VStack, Box, Image, Text, Flex, Center, } from '@chakra-ui/react';
const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
export default function Feed() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const response = await fetch('https://api.github.com/users');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);
                setImages(data);
            } catch (err) {
                console.error(err);
            }
        };

        getPosts();
        }, []); 

    return (
        <div>
            <h3>Posts</h3>
            {images.length !== 0 ? (
                images.map((img, index) => (
                    <VStack key={index}>
                        <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"} my={2}>
                            <Flex alignItems={"center"} gap={2}>
                                <Box maxW="500px" borderWidth="3px" borderRadius="lg" overflow="hidden" m="2" p="4" borderColor='black' color='black'>
                                <Text fontSize="xl" fontWeight="bold">{img.login}</Text>
                                    <Box my={2} borderRadius={4} overflow={"hidden"}>
                                    <Image src={img.avatar_url} alt='avatar' />
                                    </Box>
                                </Box>
                            </Flex>
                        </Flex>
                    </VStack>
                    
                ))
            ) : (
                <Center>
                <ClipLoader
        color={'black'}
        loading={true}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
                </Center>)
              }
        </div>
    )
}
