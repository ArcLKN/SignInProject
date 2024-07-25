import { useState, useEffect } from "react";
import { useNavigate, Link as ReactRouterLink } from "react-router-dom";
import {
	Box,
	Button,
	Center,
	HStack,
	Text,
	Flex,
	Avatar,
	Link as ChakraLink,
	Image,
} from "@chakra-ui/react";
import FooterPaginationControls from "../components/footerPaginationControls.jsx";
import UsersTable from "../components/usersTable.jsx";
import NavUsersTable from "../components/navUsersTable.jsx";
import UsersEmptyState from "../components/usersEmptyState.jsx";
import AddUserModal from "../components/addUserModal.jsx";
import { colors } from "../styleVariables.jsx";
import {
	getUsers,
	databaseDeleteUser,
	getUser,
	databaseUpdateUser,
	bulkDeleteUsers,
	updateUserData,
	getSelfData,
} from "../api/UserRoutes.jsx";
import EditUserModal from "../components/editUserModal.jsx";
import ResetPasswordModal from "../components/resetPasswordModal.jsx";
import ExportUsersModal from "../components/exportUsersModal.jsx";
import ExportMailModal from "../components/exportMailModal.jsx";
import { sendMailTo } from "../api/UtilityRoutes.jsx";
import NavBar from "../components/navBar.jsx";

export default function Users() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [selectedRows, setSelectedRows] = useState({});
	const [selectAll, setSelectAll] = useState(false);
	const [doShowAddUserModal, setDoShowAddUserModal] = useState(false);
	const [doShowResetUserPasswordModal, setDoShowResetUserPasswordModal] =
		useState(false);
	const [doShowEditUserModal, setDoShowEditUserModal] = useState(false);
	const [doShowExportModal, setDoShowExportModal] = useState(false);
	const [doShowExportMail, setDoShowExportMail] = useState({
		isOpen: false,
		type: null,
	});
	const [editUserId, setEditUserId] = useState({
		firstName: "",
		lastName: "",
	});
	const [resetUserPasswordId, setResetUserPasswordId] = useState(null);
	const [mockupUsers, setUsers] = useState({});
	const [sortByUserType, setSortByUserType] = useState("");
	const [searchFilter, setSearchFilter] = useState("");
	const [sortedUsers, setSortedUsers] = useState({});
	const [userPerPage, setUserPerPage] = useState(14);
	const [actualPage, setActualPage] = useState(1);
	const [maxPages, setMaxPages] = useState(
		Math.ceil(Object.entries(mockupUsers).length / userPerPage)
	);
	const [isAdmin, setIsAdmin] = useState(false);
	const [userProfilePicture, setUserProfilePicture] = useState(null);
	const [userName, setUserName] = useState({
		firstName: "Unknown",
		lastName: "Unknown",
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getUsers();
				if (response.msg) {
					const allUsers = response.msg;
					setUsers(allUsers);
					const slicedAllUsers = Object.fromEntries(
						Object.entries(allUsers).slice(
							userPerPage * (actualPage - 1),
							userPerPage * actualPage
						)
					);
					setSortedUsers(slicedAllUsers);
					setMaxPages(
						Math.ceil(Object.entries(allUsers).length / userPerPage)
					);
				} else {
					navigate("/sign-in");
				}
			} catch (error) {
				console.error("Error fetching data:", error);
				navigate("/sign-in");
			} finally {
				setLoading(false);
			}
		};
		const checkAdmin = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				return;
			}
			try {
				const response = await window.fetch(
					`http://localhost:3001/api/isAdmin/${token}`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				if (!response.ok) {
					throw new Error(`${response.statusText}`);
				}
				const json = await response.json();
				if (json.msg) {
					setIsAdmin(true);
				}
			} catch (error) {
				console.error("There was an error!", error);
			}
		};
		const getUserName = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				return;
			}
			try {
				const response = await window.fetch(
					`http://localhost:3001/api/getUserName/${token}`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				if (!response.ok) {
					throw new Error(`${response.statusText}`);
				}
				const json = await response.json();
				if (json.msg) {
					setUserName({
						firstName: json.msg.firstName,
						lastName: json.msg.lastName,
					});
				}
			} catch (error) {
				console.error("There was an error!", error);
			}
		};
		const getUserProfilePicture = async () => {
			try {
				const response = await getSelfData("socialPicture");
				const imageUrl = `http://localhost:3001/images/${response.key}`;
				console.log("imageUrl", imageUrl, response.key);
				setUserProfilePicture(imageUrl);
			} catch (error) {
				console.error("Error fetching profile picture:", error);
			}
		};
		getUserProfilePicture();
		getUserName();
		checkAdmin();
		fetchData();
	}, [navigate]);

	if (loading) {
		return <div>Loading...</div>;
	}

	const mockupUsersKeys = {
		//id: "Id",
		createdAt: "Created At",
		email: "Email",
		firstName: "First Name",
		lastName: "Last Name",
		userType: "User Type",
		projectsCollaboratorsCount: {
			short: "Projects Collaborators.",
			tooltip: "Projects Collaborators Count",
		},
		projectsCount: "Projects Count",
		ideaProjectsCount: "Idea Projects Count",
		reservationsCount: "Reservations Count",
		//socialPicture: "Social Picture",
		subscriptionsCount: "Subscriptions Count",
		signUpMethod: "Sign Up Method",
		stripeCustomedId: "Stripe Customer ID",
		unseenSystemNotificationsCount: {
			short: "Unseen Notif.",
			tooltip: "Unseen System Notifications Count",
		},
		updatedAt: "Updated At",
		userProfileSurveyPassed: "User Profile Survey Passed",
		welcomePopupShown: "Welcome Popup Shown",
		wizardSurveyPassed: "Wizard Survey Passed",
	};

	// Change new users list from parameters
	function getSortedList({
		updatedUsers = mockupUsers,
		updatedUserTypeSort = sortByUserType,
		updatedActualPage = actualPage,
		updatedUsersPerPage = userPerPage,
		updatedSearchFilter = searchFilter,
	}) {
		let newSortedUsers = updatedUsers;
		if (updatedUserTypeSort !== "") {
			newSortedUsers = Object.fromEntries(
				Object.entries(newSortedUsers).filter(
					([key, value]) => value.userType === updatedUserTypeSort
				)
			);
		}
		//console.log("Search filter:", updatedSearchFilter)
		newSortedUsers = Object.fromEntries(
			Object.entries(newSortedUsers).filter(
				([key, value]) =>
					value.email.toLowerCase().includes(updatedSearchFilter) ||
					value.firstName
						.toLowerCase()
						.includes(updatedSearchFilter) ||
					value.lastName.toLowerCase().includes(updatedSearchFilter)
			)
		);
		if (updatedUsersPerPage == Infinity) {
			setMaxPages(1);
		} else {
			setMaxPages(
				Math.ceil(
					Object.entries(newSortedUsers).length / updatedUsersPerPage
				)
			);
		}
		newSortedUsers = Object.fromEntries(
			Object.entries(newSortedUsers).slice(
				updatedUsersPerPage * (updatedActualPage - 1),
				updatedUsersPerPage * updatedActualPage
			)
		);
		setSortedUsers(newSortedUsers);
		setActualPage(updatedActualPage);
		for (let userKey in newSortedUsers) {
			if (!selectedRows[userKey]) {
				setSelectAll(false);
				return;
			}
		}
		setSelectAll(true);
	}

	function showAddUserModal() {
		setDoShowAddUserModal(true);
	}

	function showResetUserPasswordModal(userId) {
		setDoShowResetUserPasswordModal(true);
		setResetUserPasswordId(userId);
	}

	function showExportModal() {
		setDoShowExportModal(true);
	}

	async function showEditUserModal(userId) {
		setDoShowEditUserModal(true);
		const fetchUserData = async () => {
			try {
				const response = await getUser(userId); // Waiting for promise
				if (response.msg) {
					const userData = response.msg;
					setEditUserId(userData);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};
		await fetchUserData();
	}

	const getApiAddUser = async (event) => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/sign-in"); // Redirige vers la page de connexion s'il n'y a pas de token
			return;
		}
		try {
			const response = await window.fetch(
				"http://localhost:3001/api/users",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(event),
				}
			);

			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}

			const data = await response.json();
			return data; // Process the response data if needed
		} catch (error) {
			console.error("There was an error!", error);
			// Handle the error appropriately
		}
	};

	async function createNewUser(data) {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/sign-in");
			return;
		}
		const creationDate = new Date();
		let randomGeneratedId = Math.random().toString(16).slice(2);
		try {
			const response = await window.fetch(
				"http://localhost:3001/api/generate-random-id",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}
			randomGeneratedId = await response.json();
			randomGeneratedId = randomGeneratedId["msg"];
		} catch (error) {
			console.error("There was an error!", error);
			// Handle the error appropriately
		}
		const newUser = {
			_id: randomGeneratedId,
			createdAt: creationDate.toLocaleString(),
			email: data.email,
			firstName: data["firstName"],
			lastName: data["lastName"],
			userType: data["userType"],
			projectsCollaboratorsCount: 0,
			projectsCount: 0,
			ideaProjectsCount: 0,
			reservationsCount: 0,
			socialPicture: "",
			subscriptionsCount: 0,
			signUpMethod: "Admin",
			stripeCustomedId: "",
			unseenSystemNotificationsCount: 0,
			updatedAt: creationDate.toLocaleString(),
			userProfileSurveyPassed: false,
			welcomePopupShown: false,
			wizardSurveyPassed: false,
			password: Math.random().toString(16).slice(2),
		};
		getApiAddUser(newUser);
		mockupUsers["id" + Math.random().toString(16).slice(2)] = newUser;
		setUsers(mockupUsers);
		getSortedList({ updatedUsers: mockupUsers });
	}

	async function deleteUser(userDictId, userIdentifier) {
		const result = await databaseDeleteUser({ id: userIdentifier });
		if (result.msg) {
			delete mockupUsers[userDictId];
			setUsers(mockupUsers);
			getSortedList({ updatedUsers: mockupUsers });
		}
	}

	async function editUser(newUserData) {
		const result = await databaseUpdateUser(newUserData);
		if (result.msg) {
			const userIndex = mockupUsers.findIndex(
				(user) => user._id === result.userId
			);
			if (userIndex !== -1) {
				mockupUsers[userIndex] = {
					...mockupUsers[userIndex],
					...result.msg,
				};
				setUsers(mockupUsers);
				return getSortedList({ updatedUsers: mockupUsers });
			} else {
				return null;
			}
			//
		}
	}

	function changeUsersPerPage(event) {
		setActualPage(1);
		setUserPerPage(Number(event.target.value));
		getSortedList({
			updatedUsersPerPage: Number(event.target.value),
			updatedActualPage: 1,
		});
	}
	function changeUsersPage(direction) {
		const newPage = Math.min(Math.max(actualPage + direction, 1), maxPages);
		setActualPage(newPage);
		getSortedList({ updatedActualPage: newPage });
	}
	function changeUserType(event) {
		const newSort = event.target.value;
		setSortByUserType(newSort);
		getSortedList({ updatedUserTypeSort: newSort, updatedActualPage: 1 });
	}
	function searchBarFilter(event) {
		const newSearch = event.target.value.toLowerCase();
		setSearchFilter(newSearch);
		getSortedList({ updatedSearchFilter: newSearch, updatedActualPage: 1 });
	}

	async function bulkDeleteUsersIntermediary() {
		if (Object.values(selectedRows).every((value) => value)) return;

		try {
			// Extract user ids from the dict key of their selected row.
			const allToBeDeletedKeys = Object.keys(selectedRows).map((key) => {
				if (selectedRows[key]) mockupUsers[key]._id;
			});

			const result = await bulkDeleteUsers(allToBeDeletedKeys);

			if (result.msg) {
				const { msg: idsToDelete } = result;
				setSelectedRows({});

				const updatedMockupUsers = mockupUsers.filter(
					(user) => !idsToDelete.includes(user._id)
				);
				setUsers(updatedMockupUsers);
				getSortedList({ updatedUsers: updatedMockupUsers });
			}
		} catch (error) {
			console.error("Error during bulk user deletion:", error);
		}
	}

	async function intermediaryExportUsers(fileType, receiver) {
		if (["json", "pdf", "csv", "xls"].includes(fileType)) {
			const result = await sendMailTo(fileType, receiver, sortedUsers);
			return result;
		}
		return { error: "Not a valid format." };
	}

	function logout() {
		localStorage.removeItem("token");
		window.location.reload();
	}

	return (
		<>
			<title>Users</title>
			<Box maxW='100vw' height='100vh'>
				<NavBar />
				<Box p='7' pt='2' pb='2' h='90%'>
					<AddUserModal
						isOpen={doShowAddUserModal}
						doOpen={setDoShowAddUserModal}
						createNewUser={createNewUser}
					/>
					<EditUserModal
						isOpen={doShowEditUserModal}
						doOpen={setDoShowEditUserModal}
						editUser={editUser}
						userData={editUserId}
					/>
					<ResetPasswordModal
						isOpen={doShowResetUserPasswordModal}
						doOpen={setDoShowResetUserPasswordModal}
						resetUserPassword={updateUserData}
						resetUserPasswordId={resetUserPasswordId}
					/>
					<ExportUsersModal
						isOpen={doShowExportModal}
						doOpen={setDoShowExportModal}
						setDoShowExportMail={setDoShowExportMail}
					/>
					<ExportMailModal
						isOpen={doShowExportMail}
						doOpen={setDoShowExportMail}
						intermediaryExportUsers={intermediaryExportUsers}
					/>
					<Flex direction={"column"} h='100%'>
						<Box mb='1'>
							<Flex align='center' justify={"space-between"}>
								<HStack spacing='24px'>
									<Text fontSize='4xl' fontWeight='bold'>
										Users
									</Text>
								</HStack>
							</Flex>
						</Box>
						<Center maxHeight='90%'>
							<Box
								rounded='20px'
								borderWidth='1px'
								w='100%'
								h='100%'
								color={colors.ligrey}
							>
								<Flex direction={"column"} h='100%'>
									<NavUsersTable
										isAdmin={isAdmin}
										showAddUserModal={showAddUserModal}
										changeUserType={changeUserType}
										sortByUserType={sortByUserType}
										searchBarFilter={searchBarFilter}
										bulkDeleteUsers={
											bulkDeleteUsersIntermediary
										}
										selectedRows={selectedRows}
										setDoShowExportModal={
											setDoShowExportModal
										}
									/>
									{Object.keys(sortedUsers).length > 0 ? (
										<UsersTable
											mockupUsersKeys={mockupUsersKeys}
											sortedUsers={sortedUsers}
											selectedRows={selectedRows}
											setSelectedRows={setSelectedRows}
											selectAll={selectAll}
											setSelectAll={setSelectAll}
											deleteUser={deleteUser}
											showEditUserModal={
												showEditUserModal
											}
											showResetUserPasswordModal={
												showResetUserPasswordModal
											}
										/>
									) : (
										<UsersEmptyState />
									)}
									<FooterPaginationControls
										actualPage={actualPage}
										userPerPage={userPerPage}
										maxPages={maxPages}
										changeUsersPage={changeUsersPage}
										changeUsersPerPage={changeUsersPerPage}
									/>
								</Flex>
							</Box>
						</Center>
					</Flex>
				</Box>
			</Box>
		</>
	);
}
