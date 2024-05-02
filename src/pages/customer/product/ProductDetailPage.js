import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
// @mui
import {
  Box,
  Card,
  Container,
  Divider,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

// redux
import { addToCart, gotoStep } from "src/redux/slices/cart";
import { useDispatch } from "src/redux/store";
// routes
import { PATH_CUSTOMER } from "src/routes/paths";
// components
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import Markdown from "src/components/markdown";
import { useSettingsContext } from "src/components/settings";
// sections
import {
  ProductDetailsCarousel,
  ProductDetailsSummary,
} from "src/sections/@customer/e-commerce/details";

import Item from "src/controller/inventory/Item.controller";
import ApiUrls from "src/routes/api";
import { ShopProductList } from "src/sections/@customer/customer_e-commerce/shop";
import { Api } from "src/utils";

// ----------------------------------------------------------------------

export default function ProductDetailPage() {
  const { themeStretch } = useSettingsContext();

  let { productId } = useParams();
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);

  const dispatch = useDispatch();

  const [currentTab, setCurrentTab] = useState("description");

  const handleAddCart = (newProduct) => {
    dispatch(addToCart(newProduct));
  };

  const handleGotoStep = (step) => {
    dispatch(gotoStep(step));
  };

  const TABS = [
    {
      value: "description",
      label: "description",
      component: product ? <Markdown children={product?.description} /> : null,
    },
  ];

  useEffect(() => {
    Item.get(productId)
      .then((res) => setProduct(res))
      .catch((err) => console.log(err));
  }, [productId]);

  useEffect(() => {
    if (product.category) {
      Api.get(
        `${ApiUrls.website.product}?category=${product.category[0].id}`
      ).then((res) => {
        if (res.result) {
          setProducts(res.data);
        }
      });
    }
  }, [product]);

  return (
    <>
      <Helmet>
        <title>{`Product: ${product?.name || ""} `}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Product Details"
          links={[
            { name: "Home", href: PATH_CUSTOMER.home.root },
            {
              name: "Product",
              href: PATH_CUSTOMER.product.root,
            },
            { name: product?.name },
          ]}
        />

        {product && (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={7}>
                <ProductDetailsCarousel product={product} />
              </Grid>

              <Grid item xs={12} md={6} lg={5}>
                <ProductDetailsSummary
                  product={product}
                  onAddCart={handleAddCart}
                  onGotoStep={handleGotoStep}
                />
              </Grid>
            </Grid>

            <Card>
              <Tabs
                value={currentTab}
                onChange={(event, newValue) => setCurrentTab(newValue)}
                sx={{ px: 3, bgcolor: "background.neutral" }}
              >
                {TABS.map((tab) => (
                  <Tab key={tab.value} value={tab.value} label={tab.label} />
                ))}
              </Tabs>

              <Divider />

              {TABS.map(
                (tab) =>
                  tab.value === currentTab && (
                    <Box
                      key={tab.value}
                      sx={{
                        ...(currentTab === "description" && {
                          p: 3,
                        }),
                      }}
                    >
                      {tab.component}
                    </Box>
                  )
              )}
            </Card>
            <Grid container>
              <Grid item xs={12} md={12}>
                <Stack sx={{ p: 2 }}>
                  <Typography variant="h6">You might also like </Typography>
                </Stack>
                <ShopProductList
                  products={products}
                  loading={!products.length}
                />
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </>
  );
}
