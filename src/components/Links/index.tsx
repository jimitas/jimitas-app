import React from "react";
import Link from "next/link";
import styles from "src/components/Links/Links.module.scss";

const ITEMS = [
  {
    title: "１年生",
    links: [
      { href: "01block", title: "ぶろっく" },
      { href: "02kazoeyou", title: "かぞえよう" },
      { href: "03nanbanme", title: "なんばんめ" },
      { href: "04ikutu", title: "いくつといくつ" },
      { href: "05tashizan1", title: "たしざんのしかた" },
      { href: "06hikizan1", title: "ひきざんのしかた" },
    ],
  },
  {
    title: "２年生",
    links: [
      { href: "07tokei", title: "とけい" },
      { href: "12ookinakazu", title: "大きな数" },
      // { href: "./", title: "d" },
      // { href: "./", title: "d" },
      // { href: "./", title: "d" },
      // { href: "./", title: "d" },
      // { href: "./", title: "d" },
    ],
  },
  {
    title: "そのほか",
    links: [
      { href: "08keisanbou", title: "けいさんぼう" },
      { href: "09okane", title: "おかね" },
      { href: "10kenban", title: "けんばん" },
      { href: "11hiragana1", title: "ひらがな１" },
    ],
  },
];

const Links: React.FC = () => {
  return (
    <div>
      {ITEMS.map((itemGroup) => (
        <div key={itemGroup.title}>
          <hr />
          <div className={styles.sub}>{itemGroup.title}</div>
          <div className={styles.grid}>
            {itemGroup.links.map((item) => (
              <Link key={item.href} href={item.href}>
                <button type="button" className={styles.btn}>
                  {item.title}
                </button>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Links;
