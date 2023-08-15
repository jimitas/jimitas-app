import React from "react";
import Layout from "@/components/Layout";
import { Hide } from "src/components/Hide";
import { Block } from "@/components/Block";

const Home: React.FC = () => {
  return (
    <Layout title="ぶろっく">
      <Block leftCount={10} rightCount={10} />
      <Hide />
    </Layout>
  );
};

export default Home;
