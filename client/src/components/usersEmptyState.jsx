import { Box, Center, Text } from '@chakra-ui/react'

export default function UsersEmptyState({ styleVariables }) {
    return(
        <Box w="100%" h="50vh" bgColor={styleVariables.colors.ligrey}>
            <Center h="100%">
                <Text color={styleVariables.colors.dagrey} fontWeight={"bold"} fontSize={"20"}>Oops... There are no users. Please add some.</Text>
            </Center>
        </Box>
    )
}