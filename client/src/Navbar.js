import React, { useState } from "react";
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
  MDBBtn,
  MDBIcon,
  MDBNavbarNav,
} from "mdb-react-ui-kit";
import { purple, cyan, red } from "@mui/material/colors";
import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Center,
  IconButton,
  Box,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import { ChatIcon } from "@chakra-ui/icons";
import logo from "./resources/camp.png";
import Modallogin from "./Modallogin";
import Searchbar from "./SearchComponents/Searchbar";

export default function Navbar({ auth, setAuth }) {
  const [showNavNoTogglerSecond, setShowNavNoTogglerSecond] = useState(false);
  const [staticModal, setStaticModal] = useState(false);

  const toggleShow = () => setStaticModal(!staticModal);

  const handleLogout = () => {
    const authItems = [
      "authToken",
      "authemail",
      "authname",
      "authpicture",
      "authphone",
    ];
    authItems.forEach((item) => localStorage.removeItem(item));
    window.location.href = "/";
    setAuth(false);
  };

  const name = localStorage.getItem("authname");
  const picture = localStorage.getItem("authpicture");

  // Use Chakra UI's color mode values for dark theme
  const bgColor = useColorModeValue("gray.800", "gray.900");
  const textColor = useColorModeValue("white", "gray.200");
  const hoverColor = useColorModeValue("gray.700", "gray.700");

  return (
    <Box shadow="sm" bg={bgColor}>
      <MDBNavbar
        expand="lg"
        style={{
          backgroundColor: bgColor,
          padding: "0.5rem 0",
        }}
      >
        <MDBContainer fluid>
          <Flex align="center" justify="space-between" width="100%">
            <MDBNavbarBrand
              href="/"
              style={{ display: "flex", alignItems: "center" }}
            >
              <img
                src={logo}
                height="45"
                width="150"
                alt="Logo"
                loading="lazy"
                style={{ display: "block" }}
              />
            </MDBNavbarBrand>

            <MDBNavbarToggler
              type="button"
              onClick={() => setShowNavNoTogglerSecond(!showNavNoTogglerSecond)}
            >
              <MDBIcon icon="bars" fas style={{ color: textColor }} />
            </MDBNavbarToggler>

            <MDBCollapse navbar show={showNavNoTogglerSecond}>
              <Flex align="center" justify="space-between" width="100%">
                <MDBNavbarNav className="mr-auto">
                  <MDBNavbarItem>
                    <MDBNavbarLink
                      active
                      aria-current="page"
                      href="/"
                      style={{
                        fontWeight: "600",
                        color: textColor,
                        transition: "color 0.2s",
                        _hover: { color: hoverColor },
                      }}
                    >
                      Home
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                  <MDBNavbarItem>
                    <Box width="300px">
                      <Searchbar />
                    </Box>
                  </MDBNavbarItem>
                </MDBNavbarNav>

                <Flex align="center" gap={4}>
                  {auth && (
                    <IconButton
                      as="a"
                      href="/chat"
                      variant="ghost"
                      colorScheme="blue"
                      aria-label="Chat"
                      icon={<ChatIcon />}
                      _hover={{ bg: hoverColor }}
                    />
                  )}

                  {auth ? (
                    <Menu>
                      <MenuButton
                        as={Button}
                        rounded="full"
                        variant="link"
                        cursor="pointer"
                        minW={0}
                      >
                        <Avatar
                          size="sm"
                          src={picture}
                          _hover={{ ring: "2px", ringColor: "blue.400" }}
                        />
                      </MenuButton>
                      <MenuList bg={bgColor} borderColor={hoverColor}>
                        <Box px={4} py={2}>
                          <Center flexDirection="column">
                            <Avatar size="xl" src={picture} mb={2} />
                            <Box fontWeight="medium" color={textColor}>
                              {name}
                            </Box>
                          </Center>
                        </Box>
                        <MenuDivider />
                        <MenuItem
                          as="a"
                          href="/editprofile"
                          icon={<AccountBoxIcon sx={{ color: cyan[500] }} />}
                        >
                          View/Edit Profile
                        </MenuItem>
                        <MenuItem
                          as="a"
                          href="/myads"
                          icon={
                            <FavoriteTwoToneIcon sx={{ color: purple[500] }} />
                          }
                        >
                          My Ads
                        </MenuItem>
                        <MenuItem
                          onClick={handleLogout}
                          icon={<LogoutIcon sx={{ color: red[500] }} />}
                        >
                          Logout
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  ) : (
                    <Button
                      colorScheme="blue"
                      leftIcon={<MDBIcon far icon="user-circle" />}
                      onClick={toggleShow}
                      size="md"
                    >
                      Login
                    </Button>
                  )}

                  <Button
                    as="a"
                    href="/sell"
                    colorScheme="teal"
                    leftIcon={<MDBIcon fas icon="shopping-cart" />}
                    size="md"
                  >
                    Sell
                  </Button>
                </Flex>
              </Flex>
            </MDBCollapse>
          </Flex>
        </MDBContainer>
      </MDBNavbar>

      <Modallogin
        setStaticModal={setStaticModal}
        toggleShow={toggleShow}
        staticModal={staticModal}
      />
    </Box>
  );
}
