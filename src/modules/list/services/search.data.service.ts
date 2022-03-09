export class SearchDataService {
  static formatters = {
    '=': {
      op: null,
      format(value) {
        return value.substring(1);
      },
    },
    '!=': {
      op: '$ne',
      format(value) {
        return value.substring(1);
      },
    },
    '>': {
      op: '$gt',
      format(value) {
        return value.substring(1);
      },
      supportedTypes: ['integer', 'number', 'decimal', 'datetime', 'date'],
    },
    '>=': {
      op: '$gte',
      format(value) {
        return value.substring(1);
      },
      supportedTypes: ['integer', 'number', 'decimal', 'datetime', 'date'],
    },
    '<': {
      op: '$lt',
      format(value) {
        return value.substring(1);
      },
      supportedTypes: ['integer', 'number', 'decimal', 'datetime', 'date'],
    },
    '<=': {
      op: '$lte',
      format(value) {
        return value.substring(1);
      },
      supportedTypes: ['integer', 'number', 'decimal', 'datetime', 'date'],
    },
    '^': {
      op: '$regex',
      format(value) {
        return '/^' + value.substring(1) + '/';
      },
    },
    $: {
      op: '$regex',
      format(value) {
        return '/' + value.substring(1) + '$/';
      },
    },
    default: {
      op: '$regex',
      format(value) {
        return value;
      },
    },
  }

  getQuickSearchOperatorByValue(value) {
    const startChar = value.charAt(0);
    const formatter =
      SearchDataService.formatters[startChar] ||
      SearchDataService.formatters.default;
    return {
      op: formatter.op,
      value: formatter.format(value),
      supportedTypes: formatter.supportedTypes,
    };
  }
}
