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
    <div>
      <Card maxW="sm" className="mt-2 mb-2">
        <CardBody>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Image
              src={product.productpic1}
              alt={product.subcategory}
              borderRadius="lg"
              maxH="200px"
              maxW="400px"
            />
          </div>
          <Stack mt="6" spacing="3">
            <Text>{product.title}</Text>
            <Text color="blue.600" fontSize="2xl">
              <CurrencyRupeeTwoToneIcon />
              {product.price}
            </Text>
            <Button
              colorScheme="blue"
              isLoading={isPaymentLoading}
              onClick={handleBuyClick}
              loadingText="Processing Payment"
            >
              Buy Now
            </Button>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <Stack spacing="1" width="100%">
            <Flex justify="space-between">
              <Text color="blue.600" fontSize="xs">
                {`${address.area}, ${address.city}, ${address.state}, ${address.postcode}`}
              </Text>
              <Text color="blue.600" mx="4" fontSize="xs">
                {`${daysAgo} days ago`}
              </Text>
            </Flex>
          </Stack>
        </CardFooter>
      </Card>
    </div>
  );
}
