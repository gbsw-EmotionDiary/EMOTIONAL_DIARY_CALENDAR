import React from "react";
import styles from "./TopNav.module.css";

function TopNav() {
  return (
    <nav className={styles.topNav}>
      <div className={styles.logo}>Diary</div>
      <ul className={styles.navItems}>
        <li>
          <a href="/">홈</a>
        </li>
      </ul>
    </nav>
  );
}

export default TopNav;
