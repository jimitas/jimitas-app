import Layout from "src/components/Layout";
import { Okane } from "src/components/Okane";

// 702おかねページ（ドラッグ&ドロップでお金の計算を学習）
export default function Home() {
  return (
    <Layout title="おかね">
      <Okane hyaku={0} goju={0} ju={0} go={0} ichi={0} />
    </Layout>
  );
}
