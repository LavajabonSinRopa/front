import React from "react";

const GenericListView = ({ sendDataToParent,items, renderItem, idKey }) => {
  return (
    <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
      {items.map((item) => (
        <li key={item[idKey]}>{renderItem(sendDataToParent, item)}</li>
      ))}
    </ul>
  );
};

export default GenericListView;
