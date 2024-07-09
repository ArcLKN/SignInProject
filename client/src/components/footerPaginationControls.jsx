import { Box, HStack, FormControl, Select, Text, Flex, IconButton } from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

export default function FooterPaginationControls({ styleVariables, actualPage, userPerPage, maxPages, changeUsersPage, changeUsersPerPage }) {
    return (
    <Box p="2">
        <Flex direction="row" justify="flex-end" align="center">
            <HStack spacing="10">
                <Box>
                    <Flex direction="row" align="center">
                        <HStack spacing="3">
                            <Text color={styleVariables.colors.dagrey}>Rows per page</Text>
                            <FormControl>
                            <Select
                            name="usersPerPage"
                            value={userPerPage}
                            onChange={changeUsersPerPage}
                            color={styleVariables.colors.dagrey}>
                                <option value={7}>7</option>
                                <option value={14}>14</option>
                                <option value={21}>21</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                                <option value={200}>200</option>
                                <option value={500}>500</option>
                                <option value={Infinity}>All</option>
                            </Select>
                        </FormControl>
                        </HStack>
                    </Flex>
                </Box>
                <Text color={styleVariables.colors.dagrey}>
                    {actualPage + " of " + maxPages}
                </Text>
                <Box>
                    <Flex direction="row" align="center">
                        <HStack spacing="3">
                            <IconButton bgColor="white" onClick={() => changeUsersPage(-1)}>
                                <ChevronLeftIcon/>    
                            </IconButton>
                            <IconButton bgColor="white" onClick={() => changeUsersPage(1)}>
                                <ChevronRightIcon/>    
                            </IconButton>   
                        </HStack>
                    </Flex>
                </Box>
            </HStack>
        </Flex>
    </Box>
    )
}