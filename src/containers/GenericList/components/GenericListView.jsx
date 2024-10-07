import React from "react";

const GenericListView = ({ items, renderItem, idKey }) => {
  return (
    <div>
      <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
        {items.map((item) => (
          <li key={item[idKey]}>{renderItem(item)}</li>
        ))}
      </ul>
    </div>
  );
};

export default GenericListView;
