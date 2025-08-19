import React from "react";
import Header from "../Header";
import styles from "src/components/Layout/layout.module.css";

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="body">
      <Header />
      <main className={styles.main}>
        <div className={styles.mainTitle}>{title}</div>
        <div>{children}</div>
      </main>
    </div>
  );
};

export default Layout;
