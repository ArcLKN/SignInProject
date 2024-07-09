import { useState, useEffect } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";
import {
  Box,
  FormLabel,
  Center,
  Button,
  Text,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Image,
  IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";

function Login() {
  const [doShowPassword, setDoShowPassword] = useState("hide");
  const [doShowWrongCredentials, setDoShowWrongCredentials] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function changePasswordState() {
    if (doShowPassword == "hide") {
      setDoShowPassword("show");
    } else {
      setDoShowPassword("hide");
    }
  }

  async function checkUser(event) {
    console.log("Trying to check user");
    const response = await window.fetch(
      "http://localhost:3001/api/check-login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );
    const json = await response.json();
    console.log(json);
    console.log("Finished to check user");
    if (json.msg && json.msg.token) {
      localStorage.setItem("token", json.msg.token);
      window.location.href = "/users";
    } else {
      setDoShowWrongCredentials(true);
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
            Sign in to your account
          </Text>
          <form
            onSubmit={handleSubmit((data) => {
              checkUser(data);
            })}
          >
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
            <Box mb="20px" mt="5px" textAlign="right">
              <ChakraLink color="blue.400">Forgot password?</ChakraLink>
            </Box>
            <Text color="red.300">{errors.password?.message}</Text>
            <Input
              mt="20px"
              type="submit"
              color="white"
              w="100%"
              colorScheme="teal"
              bgColor="teal.300"
              value="Login"
            />
            {doShowWrongCredentials && (
              <Text color="red.300">
                Email or password is wrong, try again.
              </Text>
            )}
          </form>
          <Flex mt="20px" justify="center" flexDirection="row">
            <Text color="gray.700">Don't have an account?</Text>
            <ChakraLink
              ml="5px"
              color="blue.400"
              as={ReactRouterLink}
              to="/sign-up"
            >
              Sign up.
            </ChakraLink>
          </Flex>
        </Box>
      </Center>
    </>
  );
}

export default Login;
