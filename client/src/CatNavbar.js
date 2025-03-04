import React from "react";
import { Navbar } from "react-bootstrap";
import { categories } from "./resources/Catagories";
import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Grid,
  GridItem,
  useColorModeValue,
  useMediaQuery,
  Link,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";

export default function CatNavbar() {
  const [isMobile] = useMediaQuery("(max-width: 480px)");

  // Use Chakra UI's color mode values for dark theme
  const bgColor = useColorModeValue("gray.900", "gray.900");
  const textColor = useColorModeValue("gray.900", "gray.900"); // Changed to a darker shade
  const hoverBgColor = useColorModeValue("gray.700", "gray.600");
  const borderColor = useColorModeValue("gray.600", "gray.500");
  const accentColor = useColorModeValue("teal.500", "teal.300");

  return (
    <Navbar
      expand="md"
      className="mt-1"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        padding: "0.5rem 1rem",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    >
      <Flex justify="space-between" align="center" w="100%">
        <Box mr={2}>
          {!isMobile && (
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Menu"
                icon={<HamburgerIcon />}
                variant="ghost"
                colorScheme="teal"
                _hover={{ bg: hoverBgColor, color: accentColor }}
              />
              <MenuList
                bg={bgColor}
                borderColor={borderColor}
                boxShadow="lg"
                borderRadius="md"
                p={4}
              >
                <Grid
                  templateColumns={[
                    "repeat(2, 1fr)",
                    "repeat(3, 1fr)",
                    "repeat(4, 1fr)",
                    "repeat(5, 1fr)",
                  ]}
                  gap={4}
                >
                  {categories.map((category, index) => (
                    <GridItem key={index}>
                      <MenuItem
                        isDisabled
                        color={textColor}
                        fontWeight="bold"
                        fontSize="lg"
                        mb={2}
                      >
                        {category.title}
                      </MenuItem>
                      {category.items.map((subCategory, subIndex) => (
                        <MenuItem
                          key={`${index}-${subIndex}`}
                          as={RouterLink}
                          to={`/${subCategory}`}
                          color={textColor}
                          _hover={{ bg: hoverBgColor, color: accentColor }}
                          borderRadius="md"
                          p={2}
                        >
                          {subCategory}
                        </MenuItem>
                      ))}
                      {index !== categories.length - 1 && (
                        <Divider borderColor={borderColor} my={2} />
                      )}
                    </GridItem>
                  ))}
                </Grid>
              </MenuList>
            </Menu>
          )}
        </Box>
        <Flex
          justify="center"
          align="center"
          flexWrap="wrap"
          borderBottom={`1px solid ${borderColor}`}
          pb={2}
        >
          {categories.map((category, index) => (
            <Box key={index} px={3} py={1}>
              <Link
                as={RouterLink}
                to={`/${category.title}`}
                color={textColor}
                _hover={{ color: accentColor, textDecoration: "underline" }}
                fontWeight="medium"
                fontSize="sm"
              >
                {category.title}
              </Link>
            </Box>
          ))}
        </Flex>
      </Flex>
    </Navbar>
  );
}
