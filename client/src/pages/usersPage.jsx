import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  HStack,
  Text,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";
import FooterPaginationControls from "../components/footerPaginationControls.jsx";
import UsersTable from "../components/usersTable.jsx";
import NavUsersTable from "../components/navUsersTable.jsx";
import UsersEmptyState from "../components/usersEmptyState.jsx";
import AddUserModal from "../components/addUserModal.jsx";

const styleVariables = {
  colors: {
    dagrey: "gray.700",
    ligrey: "gray.300",
    mainColor: "teal",
  },
};

export default function Users() {
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [doShowAddUserModal, setDoShowAddUserModal] = useState(false);
  const [mockupUsers, setUsers] = useState({});
  const [sortByUserType, setSortByUserType] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const navigate = useNavigate();
  const [sortedUsers, setSortedUsers] = useState({});
  const [userPerPage, setUserPerPage] = useState(14);
  const [actualPage, setActualPage] = useState(1);
  const [maxPages, setMaxPages] = useState(
    Math.ceil(Object.entries(mockupUsers).length / userPerPage)
  );

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/sign-in"); // Redirige vers la page de connexion s'il n'y a pas de token
        return;
      }

      try {
        const response = await window.fetch(
          "http://localhost:3001/api/get-users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await response.json();
        console.log(json);
        let allUsers = {};
        if (json) {
          allUsers = json["msg"];
        }
        console.log(allUsers);
        setUsers(allUsers);
        setSortedUsers(
          Object.fromEntries(Object.entries(allUsers).slice(0, 14))
        );
        setMaxPages(Math.ceil(Object.entries(allUsers).length / userPerPage));
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/sign-in"); // Redirige vers la page de connexion en cas d'erreur
      } finally {
        setLoading(false); // Fin du chargement
      }
    };
    checkAuth();
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
    socialPicture: "Social Picture",
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

  function getSortedList({
    updatedUsers = mockupUsers,
    updatedUserTypeSort = sortByUserType,
    updatedActualPage = actualPage,
    updatedUsersPerPage = userPerPage,
    updatedSearchFilter = searchFilter,
  }) {
    //console.log("1", updatedUsers)
    let newSortedUsers = updatedUsers;
    if (updatedUserTypeSort !== "") {
      newSortedUsers = Object.fromEntries(
        Object.entries(newSortedUsers).filter(
          ([key, value]) => value.userType === updatedUserTypeSort
        )
      );
    }
    //console.log("3", newSortedUsers)
    //console.log("Search filter:", updatedSearchFilter)
    newSortedUsers = Object.fromEntries(
      Object.entries(newSortedUsers).filter(
        ([key, value]) =>
          value.email.toLowerCase().includes(updatedSearchFilter) ||
          value.firstName.toLowerCase().includes(updatedSearchFilter) ||
          value.lastName.toLowerCase().includes(updatedSearchFilter)
      )
    );
    //console.log("4", newSortedUsers)
    if (updatedUsersPerPage == Infinity) {
      setMaxPages(1);
    } else {
      setMaxPages(
        Math.ceil(Object.entries(newSortedUsers).length / updatedUsersPerPage)
      );
    }
    newSortedUsers = Object.fromEntries(
      Object.entries(newSortedUsers).slice(
        updatedUsersPerPage * (updatedActualPage - 1),
        updatedUsersPerPage * updatedActualPage
      )
    );
    //console.log("2", newSortedUsers)
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

  const getApiAddUser = async (event) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/sign-in"); // Redirige vers la page de connexion s'il n'y a pas de token
      return;
    }
    try {
      const response = await window.fetch(
        "http://localhost:3001/api/add-user",
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

  const databaseDeleteUser = async (event) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/sign-in"); // Redirige vers la page de connexion s'il n'y a pas de token
      return;
    }
    try {
      const response = await window.fetch(
        "http://localhost:3001/api/delete-one-user",
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
      navigate("/sign-in"); // Redirige vers la page de connexion s'il n'y a pas de token
      return;
    }
    console.log(data);
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
      password: toString(Math.random().toString(16).slice(2)),
    };
    getApiAddUser(newUser);
    mockupUsers["id" + Math.random().toString(16).slice(2)] = newUser;
    setUsers(mockupUsers);
    sessionStorage.setItem("users", JSON.stringify(mockupUsers));
    getSortedList({ updatedUsers: mockupUsers });
  }

  function deleteUser(userId, trueId) {
    console.log("UserId", userId);
    delete mockupUsers[userId];
    setUsers(mockupUsers);
    sessionStorage.setItem("users", JSON.stringify(mockupUsers));
    getSortedList({ updatedUsers: mockupUsers });
    databaseDeleteUser({ id: trueId });
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

  function logout() {
    localStorage.removeItem("token");
    window.location.reload();
  }

  console.log(mockupUsers);

  return (
    <Box p="7" maxW="100vw" height="100vh">
      <AddUserModal
        isOpen={doShowAddUserModal}
        doOpen={setDoShowAddUserModal}
        createNewUser={createNewUser}
      />
      <Flex direction={"column"} h="100%">
        <Box mb="5">
          <Flex align="center" justify={"space-between"}>
            <HStack spacing="24px">
              <Text fontSize="4xl" fontWeight="bold">
                Users
              </Text>
              <IconButton background="white">
                <LinkIcon />
              </IconButton>
            </HStack>
            <Button onClick={logout}>Logout</Button>
          </Flex>
        </Box>
        <Center maxHeight="90%">
          <Box
            rounded="20px"
            borderWidth="1px"
            w="100%"
            h="100%"
            color={styleVariables.colors.ligrey}
          >
            <Flex direction={"column"} h="100%">
              <NavUsersTable
                styleVariables={styleVariables}
                showAddUserModal={showAddUserModal}
                changeUserType={changeUserType}
                sortByUserType={sortByUserType}
                searchBarFilter={searchBarFilter}
              />
              {Object.keys(sortedUsers).length > 0 ? (
                <UsersTable
                  styleVariables={styleVariables}
                  mockupUsersKeys={mockupUsersKeys}
                  sortedUsers={sortedUsers}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  selectAll={selectAll}
                  setSelectAll={setSelectAll}
                  deleteUser={deleteUser}
                />
              ) : (
                <UsersEmptyState styleVariables={styleVariables} />
              )}
              <FooterPaginationControls
                styleVariables={styleVariables}
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
  );
}
