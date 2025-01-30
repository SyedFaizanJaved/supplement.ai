import React from 'react';
import styles from './table.module.css';

export const Table = ({ children, className, ...props }) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={`${styles.table} ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children, ...props }) => {
  return <thead className={styles.tableHeader} {...props}>{children}</thead>;
};

export const TableBody = ({ children, ...props }) => {
  return <tbody {...props}>{children}</tbody>;
};

export const TableRow = ({ children, ...props }) => {
  return <tr className={styles.tableRow} {...props}>{children}</tr>;
};

export const TableHead = ({ children, ...props }) => {
  return <th className={styles.tableHead} {...props}>{children}</th>;
};

export const TableCell = ({ children, ...props }) => {
  return <td className={styles.tableCell} {...props}>{children}</td>;
};
