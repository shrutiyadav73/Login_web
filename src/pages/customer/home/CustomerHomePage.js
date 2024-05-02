import { Helmet } from "react-helmet-async";
// @mui
import { Container, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Manufacture from "src/controller/inventory/Manufacture.controller";
import ApiUrls from "src/routes/api";
import { ShopProductList } from "src/sections/@customer/customer_e-commerce/shop";
import { Api } from "src/utils";
// _mock_
import { _appFeatured } from "../../../_mock/arrays";
// components
import { useSettingsContext } from "../../../components/settings";
// sections
import { AppFeatured } from "../../../sections/@dashboard/general/app";
// assets

import Manufacturer from "./Manufacturer";

// ----------------------------------------------------------------------

export default function CustomerHomePage() {
  const { themeStretch } = useSettingsContext();

  const [manufacturersList, setManufacturersList] = useState([]);
  const [newestProductList, setNewestProductList] = useState([]);
  const [trendingProductList, setTrendingProductList] = useState([]);

  useEffect(() => {
    Manufacture.list().then((res) => {
      setManufacturersList(res);
    });

    Api.get(`${ApiUrls.website.product}?filter=newest`).then((res) => {
      if (res.result) {
        setNewestProductList(res.data);
      }
    });
    Api.get(`${ApiUrls.website.product}?filter=trending`).then((res) => {
      if (res.result) {
        setTrendingProductList(res.data);
      }
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>InviIMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "xl"} sx={{ pt: 5 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <AppFeatured list={_appFeatured} />
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack sx={{ pb: 2 }}>
              <Typography variant="h6">Newest Products</Typography>
            </Stack>
            <ShopProductList
              products={newestProductList}
              loading={!newestProductList.length}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <Stack sx={{ pb: 2 }}>
              <Typography variant="h6">Trending Products</Typography>
            </Stack>
            <ShopProductList
              products={trendingProductList}
              loading={!trendingProductList.length}
            />
          </Grid>

          <Stack sx={{ p: 3 }}>
            <Typography variant="h6">Featured Manufacturers</Typography>
          </Stack>

          <Grid container spacing={1} sx={{ ml: "16px" }}>
            {manufacturersList?.slice(0, 4)?.map((item) => (
              <Grid item xs={12} sm={6} md={3}>
                <Manufacturer data={item} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
