import React from "react";
import MainTitle from "src/components/MainTitle";
import Layout from "src/components/Layout";
import Links from "src/components/Links";

export default function Home() {
  return (
    <Layout title="">
      <MainTitle />
      <br />
      <Links />
    </Layout>
  );
}
