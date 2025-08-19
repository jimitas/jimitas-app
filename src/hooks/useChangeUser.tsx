import { useCallback, useState } from "react";
import * as se from "src/components/se";

// できれば、user情報と成績をパスワードに変換して、「復活の呪文的に呼び出せる設定にしたい。

const GAKUNEN: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const KUMI: string[] = ["1", "2", "3", "4", "5", "6", "A", "B", "C", "D", "E", "F", "い", "ろ", "は", "に", "ほ", "へ"];
const BANGO: number[] = [];
for (let i = 0; i < 49; i++) {
  BANGO.push(i);
}

interface ChangeUserResult {
  GAKUNEN: number[];
  KUMI: string[];
  BANGO: number[];
  gakunen: number;
  kumi: string;
  bango: number;
  changeGakunen: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  changeKumi: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  changeBango: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const useChangeUser = (): ChangeUserResult => {
  const [gakunen, setGakunen] = useState<number>(1);
  const [kumi, setKumi] = useState<string>("1");
  const [bango, setBango] = useState<number>(1);

  const changeGakunen = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    se.pi.play();
    setGakunen(Number(e.target.value));
  }, []);

  const changeKumi = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    se.pi.play();
    setKumi(e.target.value);
  }, []);

  const changeBango = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    se.pi.play();
    setBango(Number(e.target.value));
  }, []);

  return { GAKUNEN, KUMI, BANGO, gakunen, kumi, bango, changeGakunen, changeKumi, changeBango };
};
