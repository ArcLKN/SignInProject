import {
	Tooltip,
	TableContainer,
	Checkbox,
	Table,
	Tr,
	Th,
	Thead,
	Tbody,
	Menu,
	Button,
	MenuItem,
	Box,
	MenuButton,
	MenuList,
	Icon,
	MenuGroup,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { colors } from "../styleVariables.jsx";

export default function UsersTable({
	mockupUsersKeys,
	sortedUsers,
	selectedRows,
	setSelectedRows,
	selectAll,
	setSelectAll,
	deleteUser,
}) {
	function selectRow(userId) {
		setSelectedRows((prev) => ({
			...prev,
			[userId]: !prev[userId],
		}));
		console.log(selectedRows);
	}

	function selectAllRows(event) {
		const checked = event.target.checked;
		const newSelectedRows = {};
		if (checked) {
			for (let key in sortedUsers) {
				newSelectedRows[key] = true;
			}
		}
		setSelectAll(checked);
		setSelectedRows(newSelectedRows);
	}

	const listTableUsersKeys = Object.entries(mockupUsersKeys).map(
		([_, value]) => (
			<Th
				key={typeof value === "object" ? value.tooltip : value}
				border='1px solid'
				borderColor={colors.dagrey}
				position='sticky'
				zIndex='2'
				bgColor={colors.ligrey}
				top='0'
			>
				<Box>
					{typeof value === "object" ? (
						<Tooltip label={value.tooltip}>
							<span>{value.short}</span>
						</Tooltip>
					) : (
						value
					)}
				</Box>
			</Th>
		)
	);
	const listTableUsersValues = Object.entries(sortedUsers).map(
		([userId, value]) => (
			<Tr
				key={userId}
				w='100%'
				bgColor={selectedRows[userId] ? colors.vligrey : colors.bgColor}
			>
				<Th
					key={"checkbox" + userId}
					border={"1px solid"}
					borderColor={colors.ligrey}
					bgColor={colors.bgColor}
				>
					<Checkbox
						onChange={() => selectRow(userId)}
						isChecked={selectedRows[userId]}
					/>
				</Th>
				{Object.entries(
					Object.fromEntries(
						Object.keys(value)
							.filter((key) =>
								Object.keys(mockupUsersKeys).includes(key)
							)
							.map((key) => [key, value[key]])
					)
				).map(([information, secondValue]) => (
					<Th
						width='20px'
						key={information + userId}
						border={"1px solid"}
						borderColor={colors.ligrey}
					>
						{secondValue instanceof Date
							? `${
									secondValue.getMonth() + 1
							  }/${secondValue.getDate()}/${secondValue.getFullYear()} ${secondValue.getHours()}h`
							: String(secondValue)}
					</Th>
				))}
				<Th
					key={"manage" + userId}
					border={"1px"}
					borderColor={colors.ligrey}
					bgColor={colors.bgColor}
					p='0'
					zIndex='2'
					position='sticky'
					w='100%'
					right='0'
				>
					<Menu>
						<MenuButton
							rounded={"0px"}
							w='100%'
							as={Button}
							bgColor={"white"}
						>
							<Icon>
								<HamburgerIcon />
							</Icon>
						</MenuButton>
						<MenuList
							rootProps={{ style: { transform: "scale(0)" } }}
							fontSize={"20px"}
						>
							<MenuGroup title='Manage user'>
								<MenuItem
									p='2'
									bgColor={colors.redError}
									onClick={() =>
										deleteUser(userId, value._id)
									}
								>
									Delete
								</MenuItem>
							</MenuGroup>
						</MenuList>
					</Menu>
				</Th>
			</Tr>
		)
	);

	return (
		<Box h='100%' overflowY={"hidden"} minH='250px'>
			<TableContainer h='100%' overflowY={"auto"}>
				<Table variant='simple' w='100%'>
					<Thead>
						<Tr bgColor={colors.ligrey}>
							<Th
								key='corner'
								borderWidth={"1px"}
								borderColor={colors.dagrey}
								position='sticky'
								zIndex={"2"}
								bgColor={colors.ligrey}
								top='0'
							>
								<Checkbox
									onChange={(event) => selectAllRows(event)}
									isChecked={selectAll}
								/>
							</Th>
							{listTableUsersKeys}
							<Th
								key='menu'
								borderWidth={"1px"}
								borderColor={colors.dagrey}
								bgColor={colors.ligrey}
								zIndex={"3"}
								position='sticky'
								right='0'
								top='0'
							>
								Menu
							</Th>
						</Tr>
					</Thead>
					<Tbody w='100%'>{listTableUsersValues}</Tbody>
				</Table>
			</TableContainer>
		</Box>
	);
}
