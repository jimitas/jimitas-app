import { useCallback, useState } from "react";
import * as se from "src/components/se";

// できれば、user情報と成績をパスワードに変換して、「復活の呪文的に呼び出せる設定にしたい。

const GAKUNEN = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const KUMI = ["1", "2", "3", "4", "5", "6", "A", "B", "C", "D", "E", "F", "い", "ろ", "は", "に", "ほ", "へ"];
const BANGO = [];
for (let i = 0; i < 49; i++) {
  BANGO.push(i);
}
export const useChangeUser = () => {
  const [gakunen, setGakunen] = useState(1);
  const [kumi, setKumi] = useState("1");
  const [bango, setBango] = useState(1);

  const changeGakunen = useCallback((e) => {
    se.pi.play();
    setGakunen(e.target.value);
  });
  const changeKumi = useCallback((e) => {
    se.pi.play();
    setKumi(e.target.value);
  });
  const changeBango = useCallback((e) => {
    se.pi.play();
    setBango(e.target.value);
  });

  return { GAKUNEN, KUMI, BANGO, gakunen, kumi, bango, changeGakunen, changeKumi, changeBango };
};
