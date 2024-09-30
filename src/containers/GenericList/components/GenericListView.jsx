import React from "react";

const GenericListView = ({ items, renderItem, idKey }) => {
  return (
    <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
      {items.map((item) => (
        <li key={item[idKey]}>{renderItem(item)}</li>
      ))}
    </ul>
  );
};

export default GenericListView;
