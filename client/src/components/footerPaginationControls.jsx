import {
	Box,
	HStack,
	FormControl,
	Select,
	Text,
	Flex,
	IconButton,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { colors } from "../styleVariables.jsx";

export default function FooterPaginationControls({
	actualPage,
	userPerPage,
	maxPages,
	changeUsersPage,
	changeUsersPerPage,
}) {
	return (
		<Box p='2'>
			<Flex direction='row' justify='flex-end' align='center'>
				<HStack spacing='10'>
					<Box>
						<Flex direction='row' align='center'>
							<HStack spacing='3'>
								<Text color={colors.dagrey}>Rows per page</Text>
								<FormControl>
									<Select
										name='usersPerPage'
										value={userPerPage}
										onChange={changeUsersPerPage}
										color={colors.dagrey}
									>
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
					<Text color={colors.dagrey}>
						{actualPage + " of " + maxPages}
					</Text>
					<Box>
						<Flex direction='row' align='center'>
							<HStack spacing='3'>
								<IconButton
									bgColor={colors.bgColor}
									onClick={() => changeUsersPage(-1)}
								>
									<ChevronLeftIcon />
								</IconButton>
								<IconButton
									bgColor={colors.bgColor}
									onClick={() => changeUsersPage(1)}
								>
									<ChevronRightIcon />
								</IconButton>
							</HStack>
						</Flex>
					</Box>
				</HStack>
			</Flex>
		</Box>
	);
}
