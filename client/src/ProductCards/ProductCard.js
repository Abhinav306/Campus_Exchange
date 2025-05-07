import {
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  Image,
  Stack,
  Text,
  Button,
  Box,
} from "@chakra-ui/react";
import React from "react";
import CurrencyRupeeTwoToneIcon from "@mui/icons-material/CurrencyRupeeTwoTone";

export default function ProductCard({ product, onBuyClick, isPaymentLoading }) {
  const address = product.address?.[0] || {};
  const createdAt = new Date(product.createdAt);
  const now = new Date();
  const timeDiff = now.getTime() - createdAt.getTime();
  const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  const handleBuyClick = () => {
    onBuyClick(product);
  };

  return (
    <Card
      maxW="sm"
      className="mt-2 mb-4"
      _hover={{
        boxShadow: "xl",
        transform: "scale(1.02)",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <CardBody>
        <Box
          overflow="hidden"
          borderRadius="lg"
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="200px"
        >
          <Image
            src={product.productpic1}
            alt={product.subcategory}
            borderRadius="lg"
            maxH="200px"
            maxW="100%"
            objectFit="cover"
            transition="transform 0.3s ease"
            _hover={{ transform: "scale(1.1)" }}
          />
        </Box>

        <Stack mt="6" spacing="3">
          <Text fontWeight="semibold" fontSize="lg">
            {product.title}
          </Text>

          <Text
            color="blue.600"
            fontSize="2xl"
            display="flex"
            alignItems="center"
            gap={1}
          >
            <CurrencyRupeeTwoToneIcon fontSize="medium" />
            {product.price}
          </Text>

          <Button
            colorScheme="blue"
            isLoading={isPaymentLoading}
            onClick={handleBuyClick}
            loadingText="Processing Payment"
            size="sm"
            mt={2}
          >
            Buy Now
          </Button>
        </Stack>
      </CardBody>

      <Divider />

      <CardFooter>
        <Stack spacing="1" width="100%">
          <Flex justify="space-between" flexWrap="wrap">
            <Text color="gray.600" fontSize="xs">
              {`${address.area}, ${address.city}, ${address.state}, ${address.postcode}`}
            </Text>
            <Text color="gray.600" fontSize="xs">
              {`${daysAgo} days ago`}
            </Text>
          </Flex>
        </Stack>
      </CardFooter>
    </Card>
  );
}
