import { Button, Flex, Text, VStack, Checkbox, Input } from "@chakra-ui/react";
import { colors } from "../styleVariables.jsx";

export default function ProjectInformations({ project }) {
	return (
		<Flex direction={"column"} w='100%'>
			<VStack alignItems='flex-start' spacing={"10"} w='100%'>
				<VStack spacing={"5"} alignItems='flex-start'>
					<Text fontSize={"32px"} fontWeight={"bold"}>
						{project.title}
					</Text>
					<Text>{project.description}</Text>
				</VStack>
				<VStack spacing={"5"} alignItems='flex-start' w='100%'>
					<Input w='100%' />
					<Flex direction={"row"}>
						<Checkbox />
						<Text>
							Get the latest innovations straight to your inbox.
						</Text>
					</Flex>
					<Button
						colorScheme='teal'
						bgColor={colors.accentColor}
						w='100%'
					>
						Claim Your Early Access
					</Button>
				</VStack>
			</VStack>
		</Flex>
	);
}
