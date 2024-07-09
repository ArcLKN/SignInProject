import { useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";
import {
  Box,
  Center,
  Button,
  Text,
  Flex,
  Input,
  InputGroup,
  FormLabel,
  InputRightElement,
  Image,
  IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const [doShowPassword, setDoShowPassword] = useState("hide");
  const [doShowAccountExists, setDoShowAccountExists] = useState(false);

  function changePasswordState() {
    if (doShowPassword == "hide") {
      setDoShowPassword("show");
    } else {
      setDoShowPassword("hide");
    }
  }

  async function signUp(event) {
    console.log("Trying to sign up user");
    const creationDate = new Date();
    const newUser = {
      createdAt: creationDate.toLocaleString(),
      email: event.email,
      firstName: event.firstName,
      lastName: event.lastName,
      userType: "User",
      projectsCollaboratorsCount: 0,
      projectsCount: 0,
      ideaProjectsCount: 0,
      reservationsCount: 0,
      socialPicture: "",
      subscriptionsCount: 0,
      signUpMethod: "Sign-Up",
      stripeCustomedId: "",
      unseenSystemNotificationsCount: 0,
      updatedAt: creationDate.toLocaleString(),
      userProfileSurveyPassed: false,
      welcomePopupShown: false,
      wizardSurveyPassed: false,
      password: event.password,
    };
    const response = await window.fetch("http://localhost:3001/api/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    const json = await response.json();
    console.log(json);
    console.log("Finished to check user");
    if (json.msg && json.msg.token) {
      localStorage.setItem("token", json.msg.token);
      window.location.href = "/users";
    } else {
      setDoShowAccountExists(true);
    }
  }

  return (
    <>
      <Box pos="absolute" p="15px">
        <ChakraLink as={ReactRouterLink} to="/">
          <Button w="100%" bgColor={"white"}>
            <Flex align="center">
              <Image src="../prelaunchLogo.png" width="30px"></Image>
              <Text ml="5px" fontWeight="bold" fontSize="20px">
                Prelaunch.com
              </Text>
            </Flex>
          </Button>
        </ChakraLink>
      </Box>
      <Center h="100vh">
        <Box p="5" w="440px" maxW="440px" textAlign="center">
          <Text
            mt={2}
            fontSize="28px"
            fontWeight="bold"
            className="title"
            color="gray.700"
          >
            Great to See You Here!
          </Text>
          <Text color="gray.500" className="subTitle">
            Create your account
          </Text>
          <form
            onSubmit={handleSubmit((data) => {
              signUp(data);
            })}
          >
            <Flex direction="column">
              <FormLabel>First Name</FormLabel>
              <Input
                {...register("firstName", {
                  required: "First name is required.",
                  minLength: { value: 4, message: "Min length is 4." },
                  pattern: {
                    value: /^[A-Za-z0-9 -]+$/i,
                    message: "Should only contain alphanumerical characters.",
                  },
                })}
                placeholder="First Name"
              />
              <Text color="red.300">{errors.firstName?.message}</Text>
              <FormLabel>Last Name</FormLabel>
              <Input
                {...register("lastName", {
                  required: "Last name is required.",
                  minLength: { value: 4, message: "Min length is 4." },
                  pattern: {
                    value: /^[A-Za-z0-9 -]+$/i,
                    message: "Should only contain alphanumerical characters.",
                  },
                })}
                placeholder="Last Name"
              />
              <Text color="red.300">{errors.lastName?.message}</Text>
              <FormLabel>Email</FormLabel>
              <Input
                {...register("email", {
                  required: "Email is required.",
                  pattern: {
                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                    message: "This is not an email.",
                  },
                })}
                placeholder="example@email.com"
              />
              <Text color="red.300">{errors.email?.message}</Text>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={doShowPassword == "hide" ? "password" : "text"}
                  {...register("password", {
                    required: "Password is required.",
                    minLength: { value: 4, message: "Min length is 4." },
                  })}
                  placeholder="Password"
                />
                <InputRightElement>
                  <IconButton
                    bgColor="white"
                    color="gray.400"
                    onClick={changePasswordState}
                    icon={
                      doShowPassword == "hide" ? <ViewOffIcon /> : <ViewIcon />
                    }
                  />
                </InputRightElement>
              </InputGroup>
              <Text color="red.300">{errors.password?.message}</Text>
              <Input
                mt="20px"
                type="submit"
                color="white"
                w="100%"
                colorScheme="teal"
                bgColor="teal.300"
                value="Sign-up"
              />
              {doShowAccountExists && (
                <Text color="red.300">Account already exists.</Text>
              )}
            </Flex>
          </form>
          <Flex mt="20px" justify="center" flexDirection="row">
            <Text color="gray.700">Already have an account?</Text>
            <ChakraLink
              ml="5px"
              color="blue.400"
              as={ReactRouterLink}
              to="/sign-in"
            >
              Sign-in.
            </ChakraLink>
          </Flex>
        </Box>
      </Center>
    </>
  );
}

export default SignUp;
