import {
	Box,
	Flex,
	HStack,
	InputGroup,
	InputLeftElement,
	Input,
	FormControl,
	Select,
	Button,
	MenuButton,
	Menu,
	MenuList,
	MenuItem,
} from "@chakra-ui/react";
import { SearchIcon, HamburgerIcon } from "@chakra-ui/icons";
import { colors } from "../styleVariables.jsx";
import AddUserButton from "./addUserButton.jsx";

export default function NavUsersTable({
	showAddUserModal,
	changeUserType,
	sortByUserType,
	searchBarFilter,
}) {
	return (
		<Box p='2'>
			<Flex direction='row' justify='space-between'>
				<Box>
					<Flex direction='row' align='center'>
						<HStack spacing='3'>
							<InputGroup>
								<InputLeftElement>
									<SearchIcon color={colors.ligrey} />
								</InputLeftElement>
								<Input
									onChange={(event) => searchBarFilter(event)}
									placeholder='Search'
									color={colors.dagrey}
								></Input>
							</InputGroup>
							<FormControl>
								<Select
									onChange={(event) => changeUserType(event)}
									value={sortByUserType}
									color={colors.dagrey}
								>
									<option value=''>All users</option>
									<option value='User'>User</option>
									<option value='Admin'>Admin</option>
									<option value='Super Admin'>
										Super Admin
									</option>
									<option value='Moderator'>Moderator</option>
									<option value='Content Moderator'>
										Content Moderator
									</option>
									<option value='Discussions Moderator'>
										Discussions Moderator
									</option>
									<option value='User Moderator'>
										User Moderator
									</option>
									<option value='Guest'>Guest</option>
								</Select>
							</FormControl>
							<Menu>
								<MenuButton
									background='white'
									color={colors.dagrey}
								>
									<HamburgerIcon />
								</MenuButton>
								<MenuList zIndex='4' color={colors.dagrey}>
									<MenuItem>
										Not too sure what I should put
									</MenuItem>
								</MenuList>
							</Menu>
						</HStack>
					</Flex>
				</Box>
				<AddUserButton showAddUserModal={showAddUserModal} />
			</Flex>
		</Box>
	);
}
