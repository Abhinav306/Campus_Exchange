import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  useToast,
} from "@chakra-ui/react";
import CatNavbar from "./CatNavbar";
import ProductCard from "./ProductCards/ProductCard";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Loading from "./resources/Loading";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleproducts, setVisibleProducts] = useState(6);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const hasMoreProductsToLoad = visibleproducts < products.length;
  const toast = useToast();
  const navigate = useNavigate();

  // Check if Razorpay is loaded
  useEffect(() => {
    const checkRazorpay = () => {
      if (window.Razorpay) {
        setIsRazorpayLoaded(true);
      }
    };
    checkRazorpay();
    const timeoutId = setTimeout(checkRazorpay, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getProducts");
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to load products",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePayment = async (product) => {
    try {
      if (!isRazorpayLoaded) {
        throw new Error("Razorpay SDK not loaded");
      }

      console.log("Starting payment for product:", product);

      const token = localStorage.getItem("authToken");
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please login to make a purchase",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        navigate("/login");
        return;
      }

      setIsPaymentLoading(true);

      // Get Razorpay Key
      const keyResponse = await axios.get("http://localhost:5000/api/getkey", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Key Response:", keyResponse.data);

      // Create Order
      const amount = Math.round(product.price * 100); // Convert to paise
      const orderResponse = await axios.post(
        "http://localhost:5000/api/checkout",
        {
          amount: amount,
          productId: product._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Order Response:", orderResponse.data);

      const { order } = orderResponse.data;

      // Initialize Razorpay options
      const options = {
        key: keyResponse.data.key,
        amount: order.amount,
        currency: "INR",
        name: "College Exchange",
        description: `Payment for ${product.title}`,
        order_id: order.id,
        prefill: {
          name: localStorage.getItem("authname") || "",
          email: localStorage.getItem("authemail") || "",
          contact: localStorage.getItem("authphone") || "",
        },
        handler: async function (response) {
          try {
            console.log("Payment successful, verifying...");
            const verificationResponse = await axios.post(
              "http://localhost:5000/api/paymentverification",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verificationResponse.data.success) {
              toast({
                title: "Payment Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
              });
              navigate(
                `/paymentsuccess?reference=${response.razorpay_payment_id}`
              );
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            toast({
              title: "Payment Verification Failed",
              description:
                error.response?.data?.message || "Please contact support",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal closed");
            setIsPaymentLoading(false);
          },
        },
        theme: {
          color: "#3182CE",
        },
      };

      // Create Razorpay instance and open payment modal
      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        toast({
          title: "Payment Failed",
          description: response.error.description,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsPaymentLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  if (loading) return <Loading />;

  return (
    <Box>
      <CatNavbar />
      <Container maxW="container.xl">
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
          gap={6}
        >
          {products.slice(0, visibleproducts).map((product) => (
            <GridItem key={product._id}>
              <Link to={`/preview_ad/${product._id}`}>
                <ProductCard
                  product={product}
                  isPaymentLoading={isPaymentLoading}
                  onBuyClick={handlePayment}
                />
              </Link>
            </GridItem>
          ))}
        </Grid>

        {hasMoreProductsToLoad && (
          <Box textAlign="center" mt={4} mb={4}>
            <Button
              bgGradient="linear(to-r, teal.400, cyan.600)"
              color="white"
              _hover={{
                bgGradient: "linear(to-r, teal.600, cyan.800)",
              }}
              _active={{
                bgGradient: "linear(to-r, teal.800, cyan.900)",
              }}
              onClick={() => setVisibleProducts((prev) => prev + 10)}
            >
              Load More
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Home;
