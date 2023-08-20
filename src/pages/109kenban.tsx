import Layout from "@/components/Layout";
import { useCallback, useEffect, useState, useRef } from "react";
import { Kenban } from "src/components/Kenban/Kenban";

const ITEM = ["けんばんハーモニカ", "リコーダー", "もっきん", "てっきん"];

export default function Home() {
  const el_select = useRef<HTMLSelectElement>(null);
  const [gakkiName, setGakkiName] = useState<string>("けんばんハーモニカ");
  const changeGakki = () => {
    setGakkiName((gakkiName) => el_select.current!.value);
  };

  return (
    <Layout title="けんばん">
      <p className="text-xs">
        スマートフォン等で上手く表示されない場合、ブラウザのメニューから「PC版で開く」を選んで表示してください。
      </p>
      <select ref={el_select} onChange={changeGakki} className="select m-8">
        {ITEM.map((item) => {
          return (
            <option key={item} value={item}>
              {item}
            </option>
          );
        })}
      </select>
      <Kenban gakki={gakkiName} />
    </Layout>
  );
}
