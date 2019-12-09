import _ from 'lodash-es';

const getColumnWidth = ({data, column, options}) => {
  const cellLength = column.width || Math.max(
    ...data.map(row => {
      let value = '';

      if (typeof column.accessor === 'string') {
        value = _.get(row, column.accessor);
      } else {
        value = column.accessor(row);
      }

      if (typeof value === 'number') return value.toString().length;
      return (value || '').length;
    }),
    column.Header.length
  );

  const magicSpacing = 12;
  return Math.min(cellLength, column.maxCharLength || Infinity) * magicSpacing;
};

export default getColumnWidth;