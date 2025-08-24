import Layout from "src/components/Layout";
import { Keisanbou } from "src/components/Keisanbou";

// 701けいさんぼうページ（ドラッグ&ドロップで数を学習）
export default function Home() {
  return (
    <Layout title="けいさんぼう">
      <Keisanbou hyaku={0} ju={0} ichi={0} />
    </Layout>
  );
}
