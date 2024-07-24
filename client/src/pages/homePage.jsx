import { Link as ReactRouterLink } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";
import { Button, Center, Flex, Box, Text } from "@chakra-ui/react";
import { colors } from "../styleVariables.jsx";

export default function Home() {
	return (
		<>
			<title>Backoffice</title>
			<Center h='100vh' w='100wh'>
				<Box width={"20%"}>
					<Flex
						direction={"row"}
						align={"center"}
						justify={"space-evenly"}
					>
						<ChakraLink as={ReactRouterLink} to='/sign-in'>
							<Button
								w='100%'
								colorScheme={colors.mainColor}
								bgColor='teal.300'
							>
								Sign-in
							</Button>
						</ChakraLink>
						<Text>or</Text>
						<ChakraLink as={ReactRouterLink} to='/sign-up'>
							<Button
								w='100%'
								colorScheme={colors.mainColor}
								bgColor='teal.300'
							>
								Sign-up
							</Button>
						</ChakraLink>
					</Flex>
				</Box>
			</Center>
		</>
	);
}
