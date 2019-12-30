// Because we're using non-table markup, there's no built-in way to have the
// table columns stretch to fill the container width, as we would expect. This
// is a basic column-sizing algorithm that solves that problem — stretching
// columns proportionally, up to 100% of the container width — but needs a bit
// more work if we want to allow reasonable minimum column widths, and the like.

import { get } from 'lodash-es';

const getColumnWidth = ({ data, column }) => {
  const cellLength = column.width || Math.max(
    ...data.map(row => {
      let value = '';

      if (typeof column.accessor === 'string') {
        value = get(row, column.accessor);
      } else {
        value = column.accessor(row);
      }

      if (typeof value === 'number') return value.toString().length;
      return (value || '').length;
    }),
    column.Header.length
  );

  // Eh, I dunno.. It's from some example code. We'll have to work on this.
  const magicSpacing = 12;
  return Math.min(cellLength, column.maxCharLength || Infinity) * magicSpacing;
};

export default getColumnWidth;