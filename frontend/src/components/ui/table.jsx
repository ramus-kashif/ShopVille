import PropTypes from "prop-types";

export const Table = ({ children, className = "" }) => {
  return (
    <div className={`overflow-x-auto w-full ${className}`}>
      <table className="min-w-full border-collapse border border-gray-200">
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children, ...props }) => {
  return (
    <thead className="bg-gray-100" {...props}>
      {children}
    </thead>
  );
};

export const TableRow = ({ children, className = "", ...props }) => {
  return (
    <tr className={`hover:bg-gray-50 ${className}`} {...props}>
      {children}
    </tr>
  );
};

export const TableHead = ({ children, className = "", ...props }) => {
  return (
    <th
      className={`text-left font-semibold text-sm uppercase text-gray-700 px-4 py-2 border-b border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </th>
  );
};

export const TableBody = ({ children, ...props }) => {
  return <tbody {...props}>{children}</tbody>;
};

export const TableCell = ({ children, className = "", ...props }) => {
  return (
    <td
      className={`text-sm text-gray-600 px-4 py-2 border-b border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </td>
  );
};

// Adding propTypes for validation
Table.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

TableHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

TableRow.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

TableHead.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

TableBody.propTypes = {
  children: PropTypes.node.isRequired,
};

TableCell.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
