import _ from 'lodash-es';

const getColumnWidth = ({data, accessor, columnContents, columnId, headerText, options}) => {
  console.log(headerText);
  const cellLength = Math.max(
    ...data.map(row => {
      let value = '';

      if (typeof accessor === 'string') {
        value = _.get(row, accessor);
      } else {
        value = accessor(row);
      }

      if (typeof value === 'number') return value.toString().length;
      return (value || '').length;
    }),
    headerText.length
  );

  const magicSpacing = 12;
  return cellLength * magicSpacing;
};

export default getColumnWidth;