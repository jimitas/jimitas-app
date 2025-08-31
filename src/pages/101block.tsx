import React from "react";
import Layout from "src/components/Layout";
import { Hide } from "src/components/Hide";
import { Block } from "src/components/Block";

export default function Home() {
  return (
    <Layout title="ぶろっく">
      <Block leftCount={10} rightCount={10} />
      <Hide />
    </Layout>
  );
}
